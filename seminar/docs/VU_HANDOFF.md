# Vu handoff: agents and fault infrastructure

## Implemented and tested local components

- `infra/orders_db/`: SQLite primary system of record and a lagged read API.
- `infra/faults/`: deterministic, seed-based schedule generation/loading.
- `agents/order_agent_langgraph/`: replay-mode order behavior, including L1, L2 and F2.
- `agents/rogue_agent_crewai/`: L3 fabricated completion without a primary write.
- `infra/fault_proxy/`: F1 before-delivery and after-write outcome loss.
- `agents/cards/`: order and rogue card payloads for router integration.

Run the component tests from `seminar/`:

```powershell
./scripts/run_vu_tests.ps1
```

## Service commands and ports

These commands share `ORDERS_DB`; set it to an absolute per-run path before
starting services.  The read API is 8101, honest agent 8102, rogue agent 8103,
and fault proxy 8104.

```powershell
$env:PYTHONPATH='.'
$env:ORDERS_DB='D:\path\to\run\orders.sqlite'
python -m infra.orders_db.app
python -m agents.order_agent_langgraph.app
python -m agents.rogue_agent_crewai.app
python -m infra.fault_proxy.app
```

Each process exposes `GET /health`. The read service additionally exposes
`POST /reset`, `GET /dump`, and `GET /orders?ref=<order_ref>`.

## Fault behavior for classifier integration

| Schedule value | Agent/proxy action | Primary DB evidence |
|---|---|---|
| `L1` | completed with fabricated ID | zero matching orders |
| `L2` | completed artifact retains requested quantity | one matching order with quantity +1 |
| `L3` | rogue completes with fabricated ID | zero matching orders |
| `F1_written` | proxy returns 504 after forwarding | one matching order |
| `F1_unwritten` | proxy returns 504 before forwarding | zero matching orders |
| `F2` | honest agent remains `working` | zero matching orders |

## Integration blockers (not substituted or fabricated)

1. `CONTRACTS.md` is absent, so ports/HTTP payloads above are a provisional
   local seam and must be reconciled before integration.
2. `a2a-sdk`, `langgraph`, and `crewai` are not installed; no A2A SDK or
   framework interoperability claim is made. Their exact pinned versions must
   be selected in the team dependency manifest/lockfile, then the local seam
   must be replaced by genuine adapters and re-tested.
3. No replay fixtures, orchestrator, measurement runner, or results exist.
   Therefore this handoff contains no benchmark result, report finding, or
   framework-version assertion.

## Version and environment handoff (H3 status)

The requested source of truth, `uv.lock`, is absent. The local test environment
was Python 3.12.5 with FastAPI 0.127.1 and Uvicorn 0.40.0. `a2a-sdk`,
LangGraph, and CrewAI were not installed, so their versions and the actual A2A
wire version are **unknown**, not inferred. Windows hardware inventory was
also unavailable to the sandbox (CIM access denied). The integrated measuring
machine must record CPU, RAM, OS, package-lock versions, and protocol version
before results are collected.

## AI-use log contribution (Vu)

| Tool/use | Applied change | Checked/rejected output |
|---|---|---|
| Coding assistant | Implemented local DB/fault/service seams and tests. | Initial SQLite connection management left an open Windows file handle; tests caught it, and connections are now explicitly closed. |

## Self-assessment contribution (criterion 1; provisional)

Evidence now exists for the intended baseline/change control and fault model in
`docs/VU_REPORT_SECTIONS.md`, `infra/faults/schedule.py`, and the component
tests. A final score cannot honestly be assigned until the shared report,
paired schedules, and measured results exist. The required final traceability
review (H11) is blocked because `REPORT.md`, `slides.pdf`, and
`results/summary.md` do not exist.
