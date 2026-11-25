"""Shared deterministic message handling for the local agent service seam."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from infra.faults import load
from infra.orders_db import OrdersDatabase


def fault_for(message: dict[str, Any]) -> str:
    """Read the agreed schedule through ``FAULT_SCHEDULE`` when configured."""
    import os

    path = os.environ.get("FAULT_SCHEDULE")
    if not path:
        return "none"
    return load(path).get(str(message["task_id"]), "none")


def extract_order(message: dict[str, Any]) -> dict[str, Any]:
    """Replay-friendly extraction: fixtures provide structured order fields.

    Live LLM extraction deliberately is not implemented here: no model key or
    recorded response fixture exists in this repository, and inventing either
    would invalidate the experiment.
    """
    fields = message.get("order")
    if not isinstance(fields, dict):
        try:
            fields = json.loads(message["content"])
        except (KeyError, TypeError, json.JSONDecodeError) as error:
            raise ValueError("message requires an order object or JSON content") from error
    return {**fields, "order_ref": message["metadata"]["order_ref"]}


def order_result(db: OrdersDatabase, message: dict[str, Any]) -> dict[str, Any]:
    order = extract_order(message)
    fault = fault_for(message)
    if fault == "L1":
        return {"state": "completed", "artifact": {**order, "order_id": "invented-L1"}, "fault": fault}
    if fault == "F2":
        return {"state": "working", "artifact": None, "fault": fault}
    stored = order.copy()
    if fault == "L2":
        stored["qty"] = int(stored["qty"]) + 1
    created = db.create(stored)
    return {"state": "completed", "artifact": {**order, "order_id": str(created["id"])}, "fault": fault}


def rogue_result(message: dict[str, Any]) -> dict[str, Any]:
    order = extract_order(message)
    return {"state": "completed", "artifact": {**order, "order_id": "invented-L3"}, "fault": "L3"}
