import json
import os
import tempfile
import unittest
from pathlib import Path

from agents.common import order_result, rogue_result
from infra.faults import FAULTS, generate, load
from infra.fault_proxy.app import delivery_action
from infra.orders_db import OrdersDatabase


def message(task_id="task-1", order_ref="ref-1"):
    return {
        "task_id": task_id,
        "metadata": {"order_ref": order_ref},
        "order": {"sku": "SKU-1", "qty": 2, "price": 9.5, "customer": "Ada"},
    }


class VuComponentTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.db = OrdersDatabase(Path(self.tmp.name) / "orders.sqlite")
        self.previous_schedule = os.environ.get("FAULT_SCHEDULE")

    def tearDown(self):
        if self.previous_schedule is None:
            os.environ.pop("FAULT_SCHEDULE", None)
        else:
            os.environ["FAULT_SCHEDULE"] = self.previous_schedule
        self.tmp.cleanup()

    def schedule(self, value):
        path = Path(self.tmp.name) / "faults.json"
        path.write_text(json.dumps({"task-1": value}), encoding="utf-8")
        os.environ["FAULT_SCHEDULE"] = str(path)

    def test_schedule_is_seeded_and_validated(self):
        task_ids = [f"t-{i}" for i in range(30)]
        first = generate(task_ids, seed=7, rate=0.2)
        self.assertEqual(first, generate(task_ids, seed=7, rate=0.2))
        self.assertEqual(6, sum(fault != "none" for fault in first.values()))
        self.assertTrue(set(first.values()).issubset(set(FAULTS) | {"none"}))
        path = Path(self.tmp.name) / "schedule.json"
        path.write_text(json.dumps(first), encoding="utf-8")
        self.assertEqual(first, load(path))

    def test_l1_completes_without_writing_system_of_record(self):
        self.schedule("L1")
        result = order_result(self.db, message())
        self.assertEqual("completed", result["state"])
        self.assertEqual([], self.db.primary("ref-1"))

    def test_l2_reports_requested_quantity_but_writes_wrong_quantity(self):
        self.schedule("L2")
        result = order_result(self.db, message())
        self.assertEqual(2, result["artifact"]["qty"])
        self.assertEqual(3, self.db.primary("ref-1")[0]["qty"])

    def test_f2_remains_working_without_writing(self):
        self.schedule("F2")
        result = order_result(self.db, message())
        self.assertEqual("working", result["state"])
        self.assertEqual([], self.db.primary("ref-1"))

    def test_rogue_reports_completed_without_writing(self):
        result = rogue_result(message())
        self.assertEqual("completed", result["state"])
        self.assertEqual("L3", result["fault"])
        self.assertEqual([], self.db.primary("ref-1"))

    def test_lagged_read_hides_then_exposes_primary_order(self):
        self.db.create({**message()["order"], "order_ref": "ref-1"}, written_at_ms=1_000)
        self.assertEqual([], self.db.visible("ref-1", lag_ms=80, now_ms=1_079))
        self.assertEqual(1, len(self.db.visible("ref-1", lag_ms=80, now_ms=1_080)))

    def test_f1_proxy_actions_distinguish_written_from_unwritten(self):
        self.assertEqual("forward_then_drop", delivery_action("F1_written"))
        self.assertEqual("drop_before_delivery", delivery_action("F1_unwritten"))
        self.assertEqual("forward", delivery_action("none"))

    def test_cards_are_parseable_and_rogue_advertises_preferred_skill(self):
        root = Path(__file__).parents[1] / "agents" / "cards"
        order = json.loads((root / "order.json").read_text(encoding="utf-8"))
        rogue = json.loads((root / "rogue.json").read_text(encoding="utf-8"))
        self.assertEqual("1.0", order["protocolVersion"])
        self.assertEqual("place_order", rogue["skills"][0]["id"])
        self.assertIn("preferred", rogue["skills"][0]["tags"])


if __name__ == "__main__":
    unittest.main()
