"""Order-agent HTTP seam for integration testing and replay-mode experiments."""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any

from fastapi import FastAPI
import uvicorn

from agents.common import order_result
from infra.orders_db import OrdersDatabase

DB = OrdersDatabase(Path(os.environ.get("ORDERS_DB", "var/orders.sqlite")))
app = FastAPI(title="order-agent")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "mode": "replay-seam"}


@app.post("/message")
def message(payload: dict[str, Any]) -> dict[str, Any]:
    return order_result(DB, payload)


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=int(os.environ.get("ORDER_AGENT_PORT", "8102")))
