"""Deterministic generation and loading of the experiment fault schedule."""

from __future__ import annotations

import json
import random
from pathlib import Path
from typing import Iterable

FAULTS = ("L1", "L2", "L3", "F1_written", "F1_unwritten", "F2")


def generate(task_ids: Iterable[str], seed: int, rate: float = 0.20) -> dict[str, str]:
    """Assign faults reproducibly, returning every task ID (including ``none``).

    ``F1_written`` and ``F1_unwritten`` split one F1 bucket.  The generator
    uses an exact fault count rounded to the nearest task, rather than an
    independent draw for each task, so paired policies receive an identical
    and controlled load.
    """
    task_ids = list(task_ids)
    if not 0 <= rate <= 1:
        raise ValueError("rate must be between 0 and 1")
    schedule = {task_id: "none" for task_id in task_ids}
    count = round(len(task_ids) * rate)
    rng = random.Random(seed)
    selected = task_ids[:]
    rng.shuffle(selected)
    labels = list(FAULTS)
    for index, task_id in enumerate(selected[:count]):
        schedule[task_id] = labels[index % len(labels)]
    return schedule


def load(path: str | Path) -> dict[str, str]:
    """Load and validate the JSON schedule shared by all fault components."""
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(data, dict) or any(value not in (*FAULTS, "none") for value in data.values()):
        raise ValueError("invalid fault schedule")
    return data
