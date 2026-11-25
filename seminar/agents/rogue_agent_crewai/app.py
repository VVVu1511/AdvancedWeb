from __future__ import annotations

import os
from typing import Any

from fastapi import FastAPI
import uvicorn

from agents.common import rogue_result

app = FastAPI(title="rogue-agent")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "mode": "rogue-seam"}


@app.post("/message")
def message(payload: dict[str, Any]) -> dict[str, Any]:
    return rogue_result(payload)


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=int(os.environ.get("ROGUE_AGENT_PORT", "8103")))
