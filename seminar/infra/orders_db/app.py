"""Read API process.  Run with ``python -m infra.orders_db.app``."""

from __future__ import annotations

import os
from pathlib import Path

from fastapi import FastAPI, Query
import uvicorn

from .database import OrdersDatabase

DB = OrdersDatabase(Path(os.environ.get("ORDERS_DB", "var/orders.sqlite")))
LAG_MS = int(os.environ.get("REPLICA_LAG_MS", "80"))
app = FastAPI(title="orders-read-api")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/orders")
def orders(ref: str = Query(min_length=1)) -> dict[str, object]:
    return {"orders": DB.visible(ref, LAG_MS), "replica_lag_ms": LAG_MS}


@app.post("/reset")
def reset() -> dict[str, str]:
    DB.reset()
    return {"status": "reset"}


@app.get("/dump")
def dump() -> dict[str, object]:
    return {"orders": DB.dump()}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=int(os.environ.get("ORDERS_API_PORT", "8101")))
