# Draft contribution — Setup and variables held fixed

This text is intentionally a draft contribution rather than `REPORT.md`: the
shared final report does not yet exist, and no experiment has been run.

## Setup

The experiment is designed around a SQLite primary orders database and a
separate read API that can delay visibility of committed orders. The honest
order service receives a task containing an orchestrator-provided `order_ref`,
replays structured order fields, writes the primary record, and returns an
artifact. A rogue service instead returns a fabricated completion artifact.
The fault schedule is generated from the run seed and stored with the run so
that paired trust and verify runs receive identical task-level faults.

At the time of this draft, the repository has no dependency lockfile and the
A2A SDK, LangGraph, and CrewAI packages are unavailable in the execution
environment. Exact package versions, protocol wire version, hardware details,
and load therefore must be added only after the integrated implementation is
installed and measured.

## Baseline versus change; variables held fixed

The intended baseline accepts an A2A completion artifact. The intended change
reads the system of record by `order_ref` and compares SKU, quantity, price,
and customer before accepting success. All other factors must remain fixed:
machine and process layout; task set and seed; agent cards and deterministic
router; retry and timeout configuration; task metadata; fault schedule; read
lag distribution; and recorded LLM responses. Both policies must use the same
saved schedule per seed. This draft does not claim that these controls have
been enforced in a run; the missing orchestrator and results are blockers.
