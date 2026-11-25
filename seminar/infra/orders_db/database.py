"""SQLite system-of-record and deterministic lagged-read model."""

from __future__ import annotations

import json
import sqlite3
import time
from contextlib import closing
from pathlib import Path
from typing import Any


class OrdersDatabase:
    def __init__(self, path: str | Path) -> None:
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._init()

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.path)
        connection.row_factory = sqlite3.Row
        return connection

    def _init(self) -> None:
        with closing(self._connect()) as conn:
            with conn:
                conn.execute(
                    """CREATE TABLE IF NOT EXISTS orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    order_ref TEXT NOT NULL,
                    sku TEXT NOT NULL,
                    qty INTEGER NOT NULL,
                    price REAL NOT NULL,
                    customer TEXT NOT NULL,
                    written_at_ms INTEGER NOT NULL
                    )"""
                )

    def reset(self) -> None:
        with closing(self._connect()) as conn:
            with conn:
                conn.execute("DELETE FROM orders")

    def create(self, order: dict[str, Any], *, written_at_ms: int | None = None) -> dict[str, Any]:
        required = {"order_ref", "sku", "qty", "price", "customer"}
        missing = required.difference(order)
        if missing:
            raise ValueError(f"order missing fields: {sorted(missing)}")
        written_at_ms = written_at_ms if written_at_ms is not None else time.time_ns() // 1_000_000
        with closing(self._connect()) as conn:
            with conn:
                cursor = conn.execute(
                    "INSERT INTO orders (order_ref, sku, qty, price, customer, written_at_ms) VALUES (?, ?, ?, ?, ?, ?)",
                    (order["order_ref"], order["sku"], order["qty"], order["price"], order["customer"], written_at_ms),
                )
                order_id = cursor.lastrowid
                cursor.close()
        return {**order, "id": order_id, "written_at_ms": written_at_ms}

    def primary(self, order_ref: str) -> list[dict[str, Any]]:
        return self._select("order_ref = ?", (order_ref,))

    def visible(self, order_ref: str, lag_ms: int, *, now_ms: int | None = None) -> list[dict[str, Any]]:
        now_ms = now_ms if now_ms is not None else time.time_ns() // 1_000_000
        return self._select("order_ref = ? AND written_at_ms + ? <= ?", (order_ref, lag_ms, now_ms))

    def dump(self) -> list[dict[str, Any]]:
        return self._select("1 = 1", ())

    def dump_json(self) -> str:
        return json.dumps(self.dump(), indent=2, sort_keys=True)

    def _select(self, where: str, parameters: tuple[Any, ...]) -> list[dict[str, Any]]:
        with closing(self._connect()) as conn:
            rows = conn.execute(f"SELECT * FROM orders WHERE {where} ORDER BY id", parameters).fetchall()
        return [dict(row) for row in rows]
