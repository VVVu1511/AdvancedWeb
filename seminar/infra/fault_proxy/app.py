"""Proxy that models F1 outcome-stream loss without changing the DB action."""

from __future__ import annotations

import os
from typing import Any

from fastapi import FastAPI, HTTPException
import httpx
import uvicorn

from infra.faults import load

app = FastAPI(title="fault-proxy")


def _fault(task_id: str) -> str:
    path = os.environ.get("FAULT_SCHEDULE")
    return load(path).get(task_id, "none") if path else "none"


def delivery_action(fault: str) -> str:
    """Return whether F1 drops before or after the agent's side effect."""
    if fault == "F1_unwritten":
        return "drop_before_delivery"
    if fault == "F1_written":
        return "forward_then_drop"
    return "forward"


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/message")
async def message(payload: dict[str, Any]) -> dict[str, Any]:
    fault = _fault(str(payload["task_id"]))
    action = delivery_action(fault)
    if action == "drop_before_delivery":
        raise HTTPException(status_code=504, detail="simulated stream drop before delivery")
    target = os.environ.get("ORDER_AGENT_URL", "http://127.0.0.1:8102") + "/message"
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.post(target, json=payload)
        response.raise_for_status()
    if action == "forward_then_drop":
        raise HTTPException(status_code=504, detail="simulated stream drop after write")
    return response.json()


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=int(os.environ.get("FAULT_PROXY_PORT", "8104")))
