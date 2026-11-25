# TASK DIVISION: Seminar E4 "Trust the A2A task state, or verify the outcome?"

> Tài liệu đi kèm [PLAN.md](PLAN.md). PLAN.md trả lời câu hỏi **làm gì và vì sao**. File này trả lời câu hỏi **ai làm, giao gì cho ai, khi nào**.
> Lịch đánh số **Ngày 1 → Ngày 12**. Nhóm điền ngày thật khi chốt hạn nộp.

---

## Mục lục

1. [Tóm tắt một trang](#1-tóm-tắt-một-trang)
2. [Sơ đồ phụ thuộc](#2-sơ-đồ-phụ-thuộc)
3. [Vũ: Agents & hạ tầng lỗi](#3-vũ-agents--hạ-tầng-lỗi)
4. [Linh: Orchestrator & lệnh đo](#4-linh-orchestrator--lệnh-đo)
5. [Thái: Nguồn, phân tích & truyền thông](#5-thái-nguồn-phân-tích--truyền-thông)
6. [Chi tiết từng lần bàn giao (H0 → H12)](#6-chi-tiết-từng-lần-bàn-giao)
7. [Lịch bàn giao theo ngày](#7-lịch-bàn-giao-theo-ngày)
8. [Quy tắc bàn giao & mẫu ghi chú](#8-quy-tắc-bàn-giao--mẫu-ghi-chú)
9. [Việc chung của cả nhóm](#9-việc-chung-của-cả-nhóm)

---

## 1. Tóm tắt một trang

| | **Vũ** | **Linh** | **Thái** |
|---|---|---|---|
| **Vai trò** | Agents & hạ tầng lỗi | Orchestrator & lệnh đo | Nguồn, phân tích & truyền thông |
| **Sở hữu code** | `agents/`, `infra/` | `orchestrator/`, `bench/measure.py`, `bench/classify.py` | `bench/analyze.py`, `docs/sources.md` |
| **Sở hữu tài liệu** | REPORT §Setup, §Held fixed | README.md, REPORT §Method, §Limits (kỹ thuật) | REPORT §Question, §Findings, §Recommendation, §Sources (biên tập toàn bài), slides.pdf, TALK.md |
| **Chủ trì tiêu chí rubric** | 1. Question & baseline (15đ) | 2. Re-run (30đ) | 3. Findings (20đ), 4. Talk (15đ), 5. Sources (10đ) |
| **Đoạn talk** | Đoạn 2: kiến trúc, mô hình lỗi, demo | Đoạn 3: log chạy, headline + spread | Đoạn 1: câu hỏi, Đoạn 4: khuyến nghị |
| **Review PR của** | Thái | Vũ | Linh |
| **Phụ thuộc vào** | Linh (lịch lỗi đã chốt trong hợp đồng) | Vũ (agents chạy được), Thái (yêu cầu trường dữ liệu) | Linh (results), Vũ (versions), cả hai (phần REPORT/slide) |
| **Ước tính** | ~20h | ~20h | ~20h |

---

## 2. Sơ đồ phụ thuộc

Mũi tên `A ──Hx──► B` nghĩa là **B phải chờ A giao Hx thì mới làm tiếp được**.

```
                    ┌───────────────────────────┐
                    │ H0  CONTRACTS.md (Ngày 1) │  ← cả 3 cùng ký
                    └─────────────┬─────────────┘
          ┌───────────────────────┼────────────────────────┐
          ▼                       ▼                        ▼
       ┌─────┐   H1 agents+DB  ┌──────┐   H4 dry-run    ┌──────┐
       │ VŨ  │ ───────────────►│ LINH │ ───────────────►│ THÁI │
       │     │◄─────────────── │      │◄─────────────── │      │
       └─────┘  H2 báo cáo tích└──────┘  H5 yêu cầu bổ  └──────┘
          │       hợp + bug       │        sung trường      ▲ │
          │                       │                         │ │
          │                       │ H6 results/ chính thức  │ │
          │                       └────────────────────────►│ │
          │                       ◄─────────────────────────┘ │
          │                         H7 bất thường cần xem lại │
          │                                                   │
          │  H3 versions + bảng lỗi                           │
          └──────────────────────────────────────────────────►│
          ◄───────────────────────────────────────────────────┘
             H3' nguồn đã kiểm chứng + sửa sai

   H8  Thái ─► Vũ, Linh : khung REPORT + khung slide + kịch bản talk
   H9  Vũ, Linh ─► Thái : nội dung phần mình (REPORT, slide, AI-LOG, bằng chứng)
   H10 Thái ─► Linh     : kết quả fresh-clone trên máy khác  →  Linh sửa, trả commit
   H11 Thái ─► Vũ       : bản REPORT+slide cuối  →  Vũ trả danh sách số không có log
   H12 Thái ─► Linh     : sources.md cuối  →  Linh trả danh sách nguồn có vấn đề
```

**Đường găng (critical path):** H0 → H1 → H2 → **Freeze (Ngày 6)** → H6 → H8/H9 → Quay talk → H10–H12 → Nộp.
Nếu H1 trễ thì cả nhóm trễ. Vì vậy Vũ ưu tiên tuyệt đối cho H1.

---

## 3. Vũ: Agents & hạ tầng lỗi

**Mục tiêu:** dựng toàn bộ "thế giới" mà orchestrator nói chuyện cùng, gồm:
- Order agent trung thực.
- Rogue agent.
- Orders DB có replica lag.
- Bộ tiêm lỗi.

Yêu cầu cốt lõi: mỗi loại lỗi phải xảy ra **đúng như lịch** và **lặp lại được theo seed**.

### 3.1 Danh sách việc

| # | Việc | Ngày | Chờ ai? | Ước tính |
|---|---|---|---|---|
| V0 | Cùng nhóm viết `CONTRACTS.md` (phụ trách mục Read API, Agent Card, fault schedule) | 1 | — | 1h |
| V1 | Spike: 1 agent LangGraph + 1 agent CrewAI expose qua `a2a-sdk`, gọi thử bằng client. Ghi version thật từ PyPI/GitHub | 1–2 | H0 | 3h |
| V2 | Order agent (LangGraph): nhận message, trích trường bằng LLM qua lớp record/replay, ghi DB kèm `order_ref`, trả artifact | 3–4 | V1 | 3h |
| V3 | Rogue agent (CrewAI) + `cards/rogue.json` khai khống skill `place_order` + `cards/order.json` thật | 3 | V1 | 2h |
| V4 | Orders DB: SQLite primary + read API `GET /orders?ref=` có lag theo seed + lệnh reset/dump DB | 3 | H0 | 2h |
| V5 | `infra/faults/`: sinh và đọc `fault_schedule.json` từ seed. Tiêm L1/L2/F2 trong agent. Fault proxy cắt SSE cho F1 | 4–5 | V2, V4 | 4h |
| V6 | Unit test: mỗi loại lỗi tạo đúng hành vi | 5 | V5 | 2h |
| — | **Bàn giao H1 cho Linh** | **cuối Ngày 5** | | |
| — | **Bàn giao H3 cho Thái** | **Ngày 5** | | |
| V7 | Sửa bug theo H2 của Linh, trước freeze | 6 | H2 | (trong V5/V6) |
| V8 | Viết REPORT §Setup + §Held fixed | 8 | H8 | 2h |
| V9 | Slide + quay đoạn talk 2 (~2 phút, có demo chạy lệnh đo) | 9–10 | H8 | 1h |
| V10 | AI-LOG phần agents/infra. Review PR của Thái. Kiểm tra số (H11) | xuyên suốt, 11 | H11 | 1h |

### 3.2 Vũ phải bàn giao được khi xong việc

- [ ] `agents/order_agent_langgraph/` chạy được bằng **một lệnh**, có health check.
- [ ] `agents/rogue_agent_crewai/` chạy được bằng **một lệnh**.
- [ ] `agents/cards/order.json`, `agents/cards/rogue.json` hợp lệ theo A2A v1.0.
- [ ] `infra/orders_db/`: primary DB, read API có lag, lệnh `reset` và `dump` (xuất `db_dump.json`).
- [ ] `infra/faults/`: hàm `generate(seed, rate, mix)` và `load(path)`, fault proxy cho F1.
- [ ] Test chứng minh từng loại lỗi L1, L2, L3, F1 (đã ghi / chưa ghi), F2 hoạt động đúng.
- [ ] Bảng **version thật** của mọi package (lấy từ `uv.lock`) kèm nguồn PyPI/GitHub.
- [ ] REPORT §Setup + §Held fixed, slide đoạn 2, video đoạn 2.
- [ ] Ít nhất 1 mục AI-LOG "assistant sai, mình bắt được" (phần agents/infra).
- [ ] Dòng bằng chứng cho tiêu chí 1 trong SELF_ASSESSMENT.

---

## 4. Linh: Orchestrator & lệnh đo

**Mục tiêu:** orchestrator có 2 policy chỉ khác nhau đúng một nhánh code, cùng một lệnh `uv run measure`. Lệnh này phải chạy từ fresh clone và sinh ra toàn bộ `results/` để ai chạy lại cũng ra số trong spread. Phần này chiếm **30 điểm**, nặng nhất rubric.

### 4.1 Danh sách việc

| # | Việc | Ngày | Chờ ai? | Ước tính |
|---|---|---|---|---|
| L0 | Cùng nhóm viết `CONTRACTS.md` (phụ trách mục `events.jsonl`, CLI của `measure`, cấu trúc `results/`) | 1 | — | 1h |
| L1 | Spike: orchestrator ADK deterministic gọi agent mẫu qua A2A. Nếu không ổn thì dùng client `a2a-sdk` thuần | 1–2 | H0 | 3h |
| L2 | Router đọc Agent Card và chấm điểm theo skill (luật cố định) | 3 | H0 (dùng card giả cho tới H1) | 1h |
| L3 | Policy `trust` / `verify`: chung code, có timeout, retry ≤ 2, cửa sổ chờ `W` | 3–4 | H0 (dùng read API giả cho tới H1) | 3h |
| L4 | `measure.py`: start/stop process mỗi run, DB mới, 10 task warm-up, 2 policy × 5 seed, ghi `results/` | 4–5 | H0 | 4h |
| L5 | `classify.py`: gán nhãn `correct` / `silent_wrong` / `loud_fail` / `false_alarm` / `duplicate` từ `db_dump.json` + `events.jsonl` | 5 | H0 | 2h |
| — | **Bàn giao H4 (dry-run) cho Thái** | **Ngày 5** | | |
| L6 | Tích hợp agents thật của Vũ, chạy 20 task end-to-end | 6 | **H1** | (trong L4) |
| — | **Bàn giao H2 cho Vũ** | **sáng Ngày 6** | | |
| L7 | Replay mode mặc định + `--live` có giới hạn chi phí. Ghi `llm_replay/`. **FREEZE** | 6 | H2 đã xử lý xong | 2h |
| L8 | Chạy đo chính thức + độ nhạy (W, fault rate) | 7 | Freeze, H5 | (máy chạy) |
| — | **Bàn giao H6 cho Thái** | **cuối Ngày 7** | | |
| L9 | README.md: từ fresh clone tới lệnh đo, cho Windows + Linux/macOS | 7–8 | Freeze | 2h |
| L10 | REPORT §Method + §Limits (kỹ thuật). Slide + video đoạn 3 | 8–10 | H8 | 2h |
| L11 | Sửa theo H7 / H10, chạy lại nếu code đổi. Kiểm tra nguồn (H12). Review PR của Vũ | 8, 11 | H7, H10, H12 | 1h |

### 4.2 Linh phải bàn giao được khi xong việc

- [ ] `orchestrator/` với router và 2 policy (diff giữa `trust` và `verify` nằm gọn trong **một hàm**).
- [ ] `uv run measure` chạy từ fresh clone, mặc định replay, in bảng tóm tắt.
- [ ] `results/<policy>/<seed>/`: `events.jsonl`, `fault_schedule.json`, `db_dump.json`, `summary.json`, `env.json` (máy, OS, Python, commit hash).
- [ ] `results/sensitivity/` cho W ∈ {0, 100, 300, 1000} và fault rate ∈ {0, 10, 20, 30}%.
- [ ] `bench/fixtures/llm_replay/` đã commit, kèm ghi chú chi phí đã tiêu cho live.
- [ ] README.md đã được người khác chạy thử thành công (H10).
- [ ] REPORT §Method + §Limits (kỹ thuật), slide + video đoạn 3.
- [ ] Ít nhất 1 mục AI-LOG "assistant sai, mình bắt được" (phần orchestrator/bench).
- [ ] Dòng bằng chứng cho tiêu chí 2 trong SELF_ASSESSMENT.

---

## 5. Thái: Nguồn, phân tích & truyền thông

**Mục tiêu:**
- Mọi fact đều có nguồn chính thức kèm ngày đọc.
- Mọi con số trên REPORT và slide đều **sinh ra từ log** bằng `analyze.py`.
- REPORT ≤ 3 trang và talk ≤ 8 phút, mở bằng câu hỏi và kết bằng khuyến nghị.

### 5.1 Danh sách việc

| # | Việc | Ngày | Chờ ai? | Ước tính |
|---|---|---|---|---|
| T0 | Cùng nhóm viết `CONTRACTS.md` (phụ trách mục `summary.json` và danh sách chỉ số). Cập nhật câu hỏi trên sheet đăng ký | 1 | — | 1h |
| T1 | Kiểm chứng facts nền: spec A2A, OWASP, các paper, GitHub issue. Lập `docs/sources.md` (URL + ngày đọc + câu trích) | 2–4 | — | 3h |
| T2 | Khung `analyze.py` chạy trên dữ liệu giả theo hợp đồng | 3–4 | H0 | 1h |
| T3 | Kiểm chứng version thật mà Vũ gửi, gắn nguồn cho bảng lỗi | 5–6 | **H3** | 1h |
| — | **Trả H3' cho Vũ** | **Ngày 6** | | |
| T4 | Chạy `analyze.py` trên dry-run, phát hiện trường còn thiếu | 5 | **H4** | 1h |
| — | **Gửi H5 cho Linh** | **Ngày 5–6, trước freeze** | | |
| T5 | Chạy `analyze.py` trên dữ liệu thật: bảng median, min–max, IQR, biểu đồ PNG, độ nhạy | 8 | **H6** | 2h |
| — | **Gửi H7 cho Linh** (nếu có bất thường) | **Ngày 8** | | |
| T6 | Gửi H8: khung REPORT (mục + chủ + giới hạn chữ), khung slide, kịch bản talk có mốc thời gian | 8 | — | 1h |
| T7 | Viết REPORT §Question, §Findings, §Recommendation, §When NOT to use, §Sources. Ghép phần của Vũ và Linh, cắt còn ≤ 3 trang | 8–9 | **H9** | 4h |
| T8 | slides.pdf: mỗi con số có chú thích tên file log | 9 | H9 | 3h |
| T9 | Quay đoạn 1 + 4, ghép video ≤ 8 phút, `TALK.md` | 10 | H9 | 2h |
| T10 | Tự red-team: gửi H10, H11, H12 và tổng hợp kết quả | 11 | Freeze | 1h |
| T11 | Nộp zip đúng tên file. Review PR của Linh | 12, xuyên suốt | — | 0.5h |

### 5.2 Thái phải bàn giao được khi xong việc

- [ ] `docs/sources.md`: mọi version/date/status/con số trích dẫn đều có URL chính thức + ngày đọc.
- [ ] `bench/analyze.py`: một lệnh sinh ra `results/summary.md` + `results/figures/*.png`.
- [ ] REPORT.md hoàn chỉnh, ≤ 3 trang, dòng đầu là link repo, mọi số đều có trong `results/summary.md`.
- [ ] slides.pdf, video ≤ 8 phút (cả 3 người cùng nói), TALK.md có link xem được.
- [ ] Bài đăng Facebook đã soạn sẵn (tiêu đề, câu hỏi, 1 headline number, link talk) để giao Linh đăng.
- [ ] Ít nhất 1 mục AI-LOG "assistant sai, mình bắt được" (phần nguồn).
- [ ] Dòng bằng chứng cho tiêu chí 3, 4, 5 trong SELF_ASSESSMENT.
- [ ] File zip `<MSSV1>-<MSSV2>-<MSSV3>_<total>.zip` có `.git`, đã nộp.

---

## 6. Chi tiết từng lần bàn giao

Mỗi lần bàn giao ghi rõ: **người gửi phải xong gì → gửi gì → người nhận làm gì → người nhận trả lại gì → hạn**.

---

### H0: Hợp đồng giao tiếp `CONTRACTS.md` (cả 3 người, Ngày 1)

Không ai được code song song trước khi H0 được merge.

| Mục | Người soạn | Nội dung bắt buộc |
|---|---|---|
| Cổng & lệnh chạy | Vũ | Port của order agent, rogue agent, read API, proxy. Lệnh khởi động từng service |
| Read API | Vũ | `GET /orders?ref=<order_ref>` → JSON mẫu. Lag lấy từ `seed`. Lệnh `reset` / `dump` |
| Agent Card | Vũ | Đường dẫn file, các trường orchestrator sẽ đọc (`skills[].id`, `tags`, `description`, interface URL) |
| Fault schedule | Vũ | Định dạng `{task_id: "none"\|"L1"\|"L2"\|"L3"\|"F1_written"\|"F1_unwritten"\|"F2"}`. Agent đọc qua biến môi trường `FAULT_SCHEDULE` |
| `order_ref` | Linh | Do orchestrator sinh, gửi trong `message.metadata.order_ref` |
| `events.jsonl` | Linh | Danh sách trường: `run, seed, policy, task_id, fault, ts_start, ts_end, latency_ms, a2a_calls, db_reads, final_a2a_state, orchestrator_verdict` |
| CLI `measure` | Linh | `uv run measure [--runs 5] [--tasks 200] [--window 300] [--fault-rate 0.2] [--live]` |
| Cấu trúc `results/` | Linh | `results/<policy>/<seed>/...` như PLAN.md §2 |
| `summary.json` + chỉ số | Thái | Trường bắt buộc: các đếm theo nhãn, `latency_p50`, `latency_p95`, `a2a_calls_mean`, `db_reads_mean`, `payload_to_rogue` |

**Xong khi:** `CONTRACTS.md` được merge vào nhánh chính của repo study và cả 3 người đã approve PR.

---

### H1: Vũ → Linh: Agents, DB và bộ lỗi chạy được (cuối Ngày 5)

**Vũ phải xong trước khi gửi:**
- V2–V6 hoàn tất, test của V6 pass.
- Tự chạy được: gửi một message A2A tới order agent và thấy đơn xuất hiện trong read API sau lag.

**Vũ gửi cho Linh:**
1. Link PR đã merge (agents + infra).
2. Lệnh khởi động từng service và lệnh health check.
3. Đường dẫn 2 Agent Card.
4. Cách truyền lịch lỗi (`FAULT_SCHEDULE=...`) và seed lag.
5. Lệnh `reset` DB (dùng đầu mỗi run) và `dump` (dùng cuối mỗi run).
6. Bảng "lỗi → hành vi mong đợi → cách nhận biết trong DB", để Linh kiểm `classify.py`.
7. Các giới hạn đã biết, ví dụ "proxy chỉ cắt được SSE, không cắt được JSON-RPC thường".

**Linh nhận và làm:**
- Thay card giả và API giả bằng đồ thật.
- Chạy **20 task** với lịch lỗi có đủ 7 loại, chạy cả 2 policy.
- Kiểm tra với từng loại lỗi rằng nhãn do `classify.py` gán khớp với bảng hành vi của Vũ.

**Linh trả lại → H2.**

---

### H2: Linh → Vũ: Báo cáo tích hợp (sáng Ngày 6)

**Linh gửi cho Vũ:**
1. Thư mục `results/dryrun/` của 20 task.
2. Bảng "loại lỗi × policy → nhãn thực tế / nhãn mong đợi", đánh dấu ✅/❌.
3. Danh sách bug: mỗi bug ghi bước tái hiện, log liên quan, mức độ (chặn freeze / không chặn).
4. Những gì orchestrator cần thêm, nếu có (ví dụ trường trong artifact).

**Vũ nhận và làm:**
- Sửa mọi bug "chặn freeze" trong **Ngày 6**.

**Vũ trả lại:**
- Link commit sửa lỗi + ghi chú bug nào đã sửa.
- Bug nào không sửa thì nêu lý do và cách ghi vào §Limits.

**Linh:** chạy lại 20 task. Nếu toàn bộ ✅ thì **FREEZE** (gắn tag `freeze-v1`).

---

### H3: Vũ → Thái: Versions & bảng lỗi (Ngày 5)

**Vũ gửi cho Thái:**
1. Bảng package → version thật (từ `uv.lock`): `a2a-sdk`, `google-adk`, `langgraph`, `crewai`, Python, cùng bất kỳ package nào nêu trong REPORT.
2. Phiên bản giao thức A2A mà các agent thực sự nói (v1.0 hay có lớp v0.3).
3. Bảng mô hình lỗi L1–F2 kèm vị trí code tiêm lỗi.
4. Thông tin máy dùng để đo: CPU, RAM, OS.

**Thái nhận và làm:**
- Đối chiếu từng version với PyPI/GitHub releases, ghi ngày phát hành và ngày đọc.
- Gắn nguồn thực tế cho từng loại lỗi (paper/issue/OWASP), sau khi đã đọc bản gốc.
- Ghi nhận mọi chỗ sai, ví dụ assistant khai một API không tồn tại. Đây là tư liệu cho AI-LOG.

**Thái trả lại → H3' (Ngày 6):**
- Bảng version đã xác minh, gồm cột "nguồn" và "ngày đọc", để Vũ dán vào §Setup.
- Danh sách sửa sai, nếu có. Vũ sửa code hoặc ghi chú trước freeze.
- Bảng lỗi đã có trích dẫn, dùng chung cho REPORT và slide.

---

### H4: Linh → Thái: Dữ liệu dry-run (Ngày 5)

Linh có thể chạy với agents giả nếu H1 chưa xong. Mục đích là để Thái dựng `analyze.py` sớm.

**Linh gửi cho Thái:**
1. `results/dryrun-fake/` theo đúng cấu trúc hợp đồng.
2. Mô tả ngắn: dữ liệu giả ở chỗ nào, trường nào còn thiếu.

**Thái nhận và làm:**
- Chạy `analyze.py` trên dữ liệu đó, dựng thử bảng và biểu đồ.
- Liệt kê trường còn thiếu hoặc khó dùng.

**Thái trả lại → H5.**

---

### H5: Thái → Linh: Yêu cầu bổ sung dữ liệu (Ngày 5–6, **trước freeze**)

**Thái gửi cho Linh:**
1. Danh sách trường cần thêm hoặc sửa trong `events.jsonl` / `summary.json`, kèm lý do. Ví dụ: cần `verify_wait_ms` để tách latency do chờ lag.
2. Bản nháp bảng kết quả và biểu đồ dự kiến, để Linh biết số nào sẽ lên slide.

**Linh nhận và làm:**
- Bổ sung trường **trước freeze**.
- Cập nhật `CONTRACTS.md`.

**Linh trả lại:**
- Commit đã bổ sung + dòng xác nhận "đã có trường X, Y".

> Sau freeze, mọi yêu cầu thêm trường đều buộc chạy lại toàn bộ. Vì vậy Thái phải gửi H5 trước khi Linh gắn tag `freeze-v1`.

---

### H6: Linh → Thái: Kết quả đo chính thức (cuối Ngày 7)

**Linh phải xong trước khi gửi:**
- Đã freeze.
- Đã chạy đủ 2 policy × 5 seed + độ nhạy.
- Mọi run ghi `env.json` có commit hash.

**Linh gửi cho Thái:**
1. Commit hash/tag của bản đã đo, cùng lệnh chính xác đã chạy.
2. Thư mục `results/` đầy đủ (đã commit).
3. Mô tả máy và điều kiện chạy: đã tắt app nào, cắm sạc hay không.
4. Những điều bất thường Linh đã thấy khi chạy. Ví dụ seed 3 chậm hơn hẳn, hoặc task bị timeout không như dự kiến.

**Thái nhận và làm:**
- Chạy `analyze.py` → `results/summary.md` + biểu đồ.
- So sánh với dự đoán trong PLAN.md §1.7.
- Đánh dấu số bất thường: spread quá lớn, nhãn mâu thuẫn, hoặc kết quả lệch xa dự đoán mà không giải thích được.

**Thái trả lại:**
- Nếu không có bất thường: bảng số chính thức + biểu đồ (đây là nguồn duy nhất cho REPORT và slide).
- Nếu có bất thường → **H7**.

---

### H7: Thái → Linh: Bất thường cần xem lại (Ngày 8, nếu có)

**Thái gửi cho Linh:**
1. Danh sách bất thường. Mỗi mục ghi: file log, task_id/seed, con số, lý do nghi ngờ.

**Linh nhận và làm:**
- Điều tra từng mục.
- Nếu là **bug code**: sửa, chạy lại **toàn bộ** 5 seed, freeze lại thành `freeze-v2`.
- Nếu là **hành vi thật**, ví dụ bug SDK làm task kẹt: giữ nguyên số liệu, viết giải thích.

**Linh trả lại:**
- Mỗi mục được kết luận "bug đã sửa (commit …)" hoặc "hành vi thật, giải thích: …".
- `results/` mới nếu đã chạy lại.

**Thái:** chạy lại `analyze.py` và chốt số.

---

### H8: Thái → Vũ, Linh: Khung REPORT, slide, talk (Ngày 8)

**Thái gửi:**
1. `REPORT.md` khung: tiêu đề mục, chủ của từng mục, **giới hạn số chữ** để tổng ≤ 3 trang:
   - §Setup + §Held fixed (Vũ): ~250 từ.
   - §Method + §Limits kỹ thuật (Linh): ~250 từ.
   - Phần còn lại (Thái).
2. Template slide (font, màu, cỡ số tối thiểu) + danh sách slide của từng người.
3. Kịch bản talk có mốc thời gian:
   - Đoạn 1 (Thái): 0:00–1:30.
   - Đoạn 2 (Vũ): 1:30–3:30.
   - Đoạn 3 (Linh): 3:30–5:30.
   - Đoạn 4 (Thái): 5:30–7:30.
   - Dự phòng: 30 giây.
4. Bảng số chính thức (từ H6/H7). **Chỉ được dùng số trong bảng này.**

**Vũ và Linh nhận và làm:** viết phần mình, làm slide phần mình, quay đoạn talk của mình.

**Vũ và Linh trả lại → H9.**

---

### H9: Vũ, Linh → Thái: Nội dung phần mình (Ngày 9, quay talk Ngày 10)

**Mỗi người gửi cho Thái:**
1. Đoạn REPORT của mình, đúng giới hạn chữ, bằng tiếng Anh.
2. Slide phần mình. Mỗi con số có chú thích file log.
3. File video đoạn talk của mình, hoặc lịch quay chung.
4. Các mục AI-LOG của mình (tool, phần nào, Changed/Rejected, lỗi assistant đã bắt).
5. Dòng bằng chứng cho tiêu chí mình chủ trì trong SELF_ASSESSMENT (điểm tự chấm + file/mục/log/mốc thời gian).

**Thái nhận và làm:**
- Ghép và biên tập REPORT ≤ 3 trang.
- Xuất slides.pdf.
- Ghép video ≤ 8 phút.
- Gom AI-LOG và SELF_ASSESSMENT.

**Thái trả lại:**
- Bản ghép để cả nhóm duyệt.
- Mọi chỗ đã cắt hoặc sửa trong phần của người khác được ghi rõ để người đó xác nhận.

---

### H10: Thái → Linh: Fresh clone trên máy khác (Ngày 11)

**Thái làm:**
- Clone repo public về một máy khác chưa từng chạy dự án.
- Chỉ làm theo README, không hỏi Linh.

**Thái gửi cho Linh:**
1. Từng bước đã làm, bước nào lỗi, lỗi gì (copy nguyên log).
2. Số liệu thu được so với số trong REPORT, nêu rõ có nằm trong spread không.

**Linh nhận và làm:**
- Sửa README/code.
- Nếu sửa code đo thì chạy lại toàn bộ và báo Thái để cập nhật số.

**Linh trả lại:**
- Commit đã sửa, ghi bước nào đã sửa.

**Thái:** chạy lại từ đầu cho tới khi qua được không lỗi.

---

### H11: Thái → Vũ: Kiểm tra truy vết số (Ngày 11)

**Thái gửi cho Vũ:** REPORT.md + slides.pdf bản cuối.

**Vũ làm:** với **từng con số**, tìm nó trong `results/summary.md` hoặc trong log.

**Vũ trả lại:**
- Danh sách số không tìm được log, hoặc lệch so với log.
- Danh sách chỗ baseline có thể bị coi là khác hơn 1 điểm.

**Thái:** sửa hết trước khi nộp.

---

### H12: Thái → Linh: Kiểm tra nguồn (Ngày 11)

**Thái gửi cho Linh:** `docs/sources.md` + REPORT §Sources.

**Linh làm:**
- Mở từng link.
- Kiểm tra câu trích có đúng nằm trong nguồn và có đúng nghĩa không.
- Kiểm tra version/date có khớp không.

**Linh trả lại:**
- Danh sách nguồn chết, nguồn thứ cấp cần thay bằng nguồn chính thức, và câu khẳng định mà nguồn không ủng hộ.

**Thái:** sửa, hoặc bỏ fact đó.

---

## 7. Lịch bàn giao theo ngày

| Ngày | Vũ | Linh | Thái | Bàn giao trong ngày |
|---|---|---|---|---|
| 1 | V0, bắt đầu V1 | L0, bắt đầu L1 | T0 | **H0** (cả nhóm) |
| 2 | V1 | L1 | T1 | — |
| 3 | V3, V4 | L2, L3 | T1, T2 | — |
| 4 | V2, V5 | L3, L4 | T1, T2 | — |
| 5 | V5, V6 | L4, L5 | T4 | **H1** Vũ→Linh, **H3** Vũ→Thái, **H4** Linh→Thái, **H5** Thái→Linh |
| 6 | V7 sửa bug | L6, L7, **FREEZE** | T3 | **H2** Linh→Vũ, **H3'** Thái→Vũ |
| 7 | (rảnh: bắt đầu nháp §Setup) | L8 đo chính thức, L9 | (đọc nguồn bổ sung) | **H6** Linh→Thái |
| 8 | V8 | L9, L10, xử lý H7 | T5, T6 | **H7** Thái→Linh, **H8** Thái→cả nhóm |
| 9 | V9 slide | L10 slide | T7, T8 | **H9** Vũ, Linh→Thái |
| 10 | quay đoạn 2 | quay đoạn 3 | T9, ghép video | — |
| 11 | kiểm số | sửa README, kiểm nguồn | T10 | **H10**, **H11**, **H12** |
| 12 | duyệt cuối | đăng Facebook | nộp zip | — |

---

## 8. Quy tắc bàn giao & mẫu ghi chú

1. **Bàn giao = PR đã merge + ghi chú bàn giao** trong nhóm chat (hoặc issue GitHub có nhãn `handoff`). Nói miệng không tính là bàn giao.
2. Người nhận phải **xác nhận trong 12 giờ** ("đã nhận H1, bắt đầu tích hợp"). Nếu thiếu thông tin thì hỏi lại ngay, không tự đoán.
3. Bàn giao trễ quá 1 ngày thì người gửi báo cả nhóm và đề xuất cắt gì. Thứ tự cắt: phần độ nhạy trước, headline giữ lại sau cùng.
4. Không ai sửa code của người khác mà không báo. Muốn sửa thì mở PR và tag chủ của phần đó.
5. Sau `freeze-v1`, code thí nghiệm chỉ được sửa qua H7/H10 và **bắt buộc chạy lại toàn bộ**.

### Mẫu ghi chú bàn giao (copy vào chat/issue)

```markdown
### Handoff H<số>: <Người gửi> → <Người nhận>
- Đã xong: <việc nào, test nào pass>
- Link: <PR / commit / thư mục>
- Cách dùng: <lệnh chạy, biến môi trường, đường dẫn>
- Kết quả mong đợi: <người nhận sẽ thấy gì nếu đúng>
- Giới hạn đã biết: <những gì chưa làm hoặc chưa ổn>
- Cần trả lại: <cái gì, trước khi nào>
```

---

## 9. Việc chung của cả nhóm

| Việc | Khi nào | Ai |
|---|---|---|
| Viết và ký `CONTRACTS.md` | Ngày 1 | Cả 3 |
| Ghi AI-LOG cho phần mình **ngay khi** dùng assistant. Mỗi người ≥ 1 mục "assistant sai, mình bắt được" | Xuyên suốt | Cả 3 |
| Review PR theo vòng: Linh review Vũ, Thái review Linh, Vũ review Thái | Xuyên suốt | Cả 3 |
| Duyệt REPORT, slide, video bản ghép | Ngày 10 | Cả 3 |
| SELF_ASSESSMENT: mỗi người điền tiêu chí mình chủ trì, cả nhóm thống nhất tổng điểm. Chấm sát, không thổi | Ngày 10–11 | Cả 3 |
| Red team đội khác (mở 1 issue `[red-team] <MSSV>` đúng hạn): Linh chạy lệnh đo, Vũ soi baseline, Thái soi nguồn và số trên slide | Sau khi nộp | Cả 3 |
| Nếu được chọn trình bày live: tập lại 10 phút. Ai cũng phải trả lời được mọi phần, vì giảng viên hỏi ngẫu nhiên một thành viên | Trước buổi live | Cả 3 |

**AI-LOG có sẵn từ giai đoạn chọn đề** (Thái ghi vào):
- Assistant đưa ra ngày phát hành A2A v1.0 mâu thuẫn nhau.
- Assistant hiểu nhầm "150 tổ chức ủng hộ" thành "150 production deployments".
- Câu hỏi v2 (đối chiếu chéo) không áp dụng được cho task có tác dụng phụ, nên đã bị loại.
