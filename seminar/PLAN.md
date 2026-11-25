# Kế hoạch Seminar E4: "Trust the A2A task state, or verify the outcome?"

> Tài liệu nội bộ của nhóm (Vũ, Thái, Linh). Các file nộp bài (README, REPORT, slides, SELF_ASSESSMENT) phải viết bằng tiếng Anh.
> Hạn nộp đã được dời. Lịch dưới đây đánh số theo **Ngày 1 → Ngày 12**, nhóm điền ngày thật vào cột "Ngày" khi chốt hạn mới.

---

## 0. Câu hỏi đã chốt

> **When a remote A2A agent from another framework reports "completed" for work it never did (a false success, a rogue agent with a poisoned Agent Card, or a task whose stream dropped), does verifying each outcome against the system of record instead of trusting the A2A task state cut wrong orders per 100 tasks, and how much median latency (ms) and how many false alarms does it add?**

Bản ngắn (Facebook, slide 1): *"Your A2A agent says 'completed'. Should you believe it?"*

**Việc cần làm ngay:** cập nhật dòng E4 trên sheet đăng ký bằng câu hỏi này. Nếu giảng viên đã comment thì trả lời comment đó. (Thái phụ trách.)

---

## 1. Thiết kế thí nghiệm

### 1.1 Kịch bản

Một shop có **orchestrator** nhận yêu cầu đặt hàng và uỷ quyền qua A2A cho một **order agent** từ xa. Order agent do "team khác" viết bằng framework khác. Order agent ghi đơn vào **orders DB**, đây là hệ thống gốc (system of record).

```
                    A2A (JSON-RPC + SSE)
 ┌──────────────┐   ┌──────────────┐   ┌────────────────────┐
 │ Orchestrator │──►│ Fault proxy  │──►│ Order agent        │──► orders DB (primary)
 │ (Google ADK) │   │ (cắt stream) │   │ (LangGraph, trung  │           │
 │ policy:      │   └──────────────┘   │  thực)             │           ▼ (replica lag)
 │ trust/verify │──────────────────────►│ Rogue agent        │   read API ◄── orchestrator
 └──────────────┘                      │ (CrewAI, card độc) │      (chỉ khi policy = verify)
        ▲ router đọc Agent Card         └────────────────────┘
```

- **Ba framework khác nhau**: orchestrator dùng Google ADK, order agent trung thực dùng LangGraph, rogue agent dùng CrewAI.
  - Mỗi agent được expose qua **SDK A2A chính thức (`a2a-sdk`)** để không phụ thuộc vào mức độ hỗ trợ A2A riêng của từng framework.
  - Phương án dự phòng nếu framework nào gây khó khăn: xem mục 6.
- **Router chọn agent bằng luật cố định**: chấm điểm theo skill trong Agent Card và chọn agent điểm cao nhất. Không dùng LLM nên kết quả lặp lại được. Rogue card khai khống skill `place_order` để thắng router ở những task được lịch lỗi chỉ định.
- **LLM**: order agent dùng LLM để trích các trường của đơn hàng từ câu yêu cầu. Lệnh đo mặc định chạy ở **replay mode** từ các response đã ghi sẵn, nên không cần key và không tốn tiền. Mode `--live` chỉ dùng để ghi lại response, có giới hạn chi phí.

### 1.2 Một biến duy nhất: chính sách của orchestrator

| | **Baseline: `trust`** | **Change: `verify`** |
|---|---|---|
| Nhận `completed` | Chấp nhận artifact, đánh dấu thành công | Đọc DB theo `order_ref` và so khớp các trường (sku, qty, price, customer). Khớp thì thành công. Chưa thấy đơn thì chờ tối đa `W` ms. Vẫn không thấy hoặc sai trường thì coi là **thất bại có báo lỗi** |
| Stream đứt / timeout / `failed` | Gửi lại message (tạo task mới), tối đa 2 lần | **Kiểm tra DB trước**. Đã có đơn thì thành công, không gửi lại. Chưa có thì gửi lại như baseline |

**Giữ cố định giữa hai cấu hình** (ghi rõ trong REPORT.md):
- Cùng máy, cùng process layout.
- Cùng bộ task và cùng seed nên cùng lịch lỗi.
- Cùng router, cùng agent, cùng số lần retry, cùng timeout.
- Cùng `order_ref` trong metadata.
- Cùng replica lag và cùng response LLM đã ghi.

### 1.3 Mô hình lỗi (tổng 20% số task, tiêm theo seed và `task_id`)

| Mã | Lỗi | Hành vi | Bằng chứng ngoài đời (trích trong REPORT) |
|---|---|---|---|
| L1 | Thành công giả | Trả `completed` kèm `order_id` bịa, **không ghi DB** | False-success paper (arXiv 2606.09863), MAST |
| L2 | Nói dối một phần | Ghi đơn **sai qty**, nhưng artifact báo qty đúng | MAST: verification failures |
| L3 | Rogue agent | Card độc thắng router, trả artifact bịa, không ghi DB | A2ABreak (arXiv 2609.10871), arXiv 2611.18887 |
| F1 | Stream đứt | Proxy cắt SSE sau `working`. Theo seed: ½ số lần đơn **đã ghi**, ½ chưa ghi | a2a-python #1175, kagent #2447, A2A #1986 |
| F2 | Task treo | Task kẹt ở `working` cho tới timeout, không ghi DB | a2a-rs #431 |

Phân bổ mặc định: 4% mỗi loại, cộng lại thành 20%. Lịch lỗi được sinh từ `seed` và lưu vào `results/<run>/fault_schedule.json`. **Red team kiểm tra được hai policy nhận đúng cùng một lịch lỗi.**

**Replica lag**: read API chỉ thấy một đơn sau `lag` ms, với `lag` lấy theo phân phối có seed (ví dụ median 80 ms, p95 300 ms). Đây là nguồn gây báo động giả của `verify`.

### 1.4 Phân loại kết quả mỗi task (sự thật lấy từ **primary DB** khi kết thúc run)

| Nhãn | Định nghĩa |
|---|---|
| `correct` | Đúng 1 đơn khớp mọi trường, orchestrator báo thành công |
| `silent_wrong` | Orchestrator báo **thành công** nhưng DB có 0 đơn, đơn sai trường, hoặc nhiều hơn 1 đơn |
| `loud_fail` | Orchestrator báo thất bại và DB đúng là không có đơn đúng (báo đúng) |
| `false_alarm` | Orchestrator báo thất bại nhưng DB **có** đúng 1 đơn đúng |
| `duplicate` | DB có nhiều hơn 1 đơn cho cùng `order_ref`. Đếm riêng, có thể trùng với nhãn khác |

### 1.5 Chỉ số

- **Headline:** `silent_wrong` trên 100 task (wrong orders / 100 tasks).
- Phụ:
  - `duplicate` trên 100 task.
  - `false_alarm` trên 100 task.
  - Tỷ lệ `correct` (%).
- **Cái giá phải trả:**
  - Latency end-to-end mỗi task, gồm **median (ms)** và p95.
  - Số lượt gọi A2A và số lượt đọc DB mỗi task.
- **Giới hạn đo được:** số task mà payload đã tới rogue agent. Con số này **giống nhau ở cả hai policy**, vì verify không ngăn được rò rỉ dữ liệu.

### 1.6 Quy trình đo

- Mỗi run gồm 200 task. Chạy **5 run** cho mỗi policy, seed 1–5. Hai policy dùng chung seed.
- Mỗi run khởi động lại tất cả process và tạo **DB mới**. 10 task warm-up được ghi log riêng và không tính vào kết quả. Nêu rõ điều này trong REPORT để red team không bắt lỗi "warm cache".
- Báo cáo **median và min–max** (kèm IQR) qua 5 run.
- **Phân tích độ nhạy** (phụ, đưa vào phần limits):
  - `W` ∈ {0, 100, 300, 1000} ms trên trục báo động giả và latency.
  - Fault rate ∈ {0, 10, 20, 30}%.
  - Headline chỉ dùng `W = 300 ms` và fault rate 20%.

### 1.7 Dự đoán trước (ghi vào REPORT trước khi chạy, để kết quả đo có cái mà đối chiếu)

**Trust:**
- `silent_wrong` ≈ L1 + L2 + L3 ≈ 12/100.
- Cộng thêm `duplicate` ≈ 2/100 do F1 có đơn đã ghi mà vẫn bị gửi lại.

**Verify:**
- `silent_wrong` ≈ 0.
- `false_alarm` > 0 khi `W` nhỏ hơn lag.
- Latency tăng khoảng một lần đọc DB, cộng thời gian chờ trong các trường hợp lag.

---

## 2. Cấu trúc repository (repo public, nộp riêng)

```
a2a-trust-or-verify/
├── README.md              # fresh clone → lệnh đo, từng bước
├── REPORT.md              # ≤ 3 trang, dòng đầu là link repo
├── TALK.md · AI-LOG.md · SELF_ASSESSMENT_REPORT.md · slides.pdf
├── pyproject.toml / uv.lock   # pin đúng version
├── agents/
│   ├── order_agent_langgraph/     # Vũ
│   ├── rogue_agent_crewai/        # Vũ
│   └── cards/                     # Agent Card thật + card độc
├── infra/
│   ├── orders_db/ (primary + read API có lag)   # Vũ
│   └── fault_proxy/                             # Vũ
├── orchestrator/ (ADK, router, policy trust/verify)  # Linh
├── bench/
│   ├── measure.py   # lệnh đo duy nhất          # Linh
│   ├── classify.py  # gán nhãn kết quả từ DB    # Linh
│   ├── analyze.py   # median/spread, biểu đồ    # Thái
│   └── fixtures/ (tasks.jsonl, llm_replay/)
└── results/<policy>/<seed>/  events.jsonl, fault_schedule.json, db_dump.json, summary.json
```

**Lệnh duy nhất:** `uv run measure` chạy cả 2 policy × 5 seed ở replay mode, in ra bảng và ghi vào `results/`. Thêm các cờ `--live`, `--runs`, `--window`, `--fault-rate`.

### Hợp đồng giao tiếp (chốt trong Ngày 1–2, trước khi code song song)

1. `events.jsonl`: mỗi dòng là `{run, seed, policy, task_id, ts, event, a2a_state, latency_ms, a2a_calls, db_reads, ...}`
2. `fault_schedule.json`: `{task_id: "none" | "L1" | "L2" | "L3" | "F1_written" | "F1_unwritten" | "F2"}`
3. Read API: `GET /orders?ref=<order_ref>` trả về danh sách đơn đã "nhìn thấy được" sau lag.
4. Agent Card: file JSON tĩnh trong `agents/cards/`, phiên bản giao thức ghi rõ (v1.0).

---

## 3. Chia việc

**Nguyên tắc công bằng:**
1. Mỗi người sở hữu **một phần code**, **một phần REPORT**, **một đoạn talk** và **một phần bằng chứng** cho SELF_ASSESSMENT.
2. Khối lượng ước tính tương đương nhau, khoảng 20 giờ mỗi người.
3. Mỗi PR do một người khác review theo vòng:
   - Linh review code của Vũ.
   - Thái review code của Linh.
   - Vũ review phần của Thái.
4. Ai cũng phải ghi AI-LOG cho phần mình. Mỗi người có **ít nhất 1 mục "assistant sai và mình bắt được"**.

### 🟦 Vũ: Agents & hạ tầng lỗi (Criterion 1 + phần của 2)

| # | Việc | Ước tính |
|---|---|---|
| V1 | Spike Ngày 1–2: dựng 1 agent LangGraph và 1 agent CrewAI expose qua `a2a-sdk`, gọi thử từ client. Ghi lại version thật của từng package, lấy từ PyPI/GitHub releases | 3h |
| V2 | Order agent (LangGraph): nhận message, trích trường (LLM qua lớp record/replay), ghi DB với `order_ref`, trả artifact | 3h |
| V3 | Rogue agent (CrewAI) + Agent Card độc khai khống skill. Agent Card thật cho order agent | 2h |
| V4 | Orders DB (SQLite primary) + read API có replica lag theo seed | 2h |
| V5 | Fault injector cho L1/L2/F2 trong agent, fault proxy cắt SSE cho F1, tất cả đọc chung `fault_schedule.json` | 4h |
| V6 | Unit test: mỗi loại lỗi tạo ra đúng hành vi đã định | 2h |
| V7 | **REPORT:** viết mục *Setup* (versions, máy, data, load) và *Baseline vs change / what was held fixed* | 2h |
| V8 | **Talk:** đoạn 2 (khoảng 2 phút), gồm kiến trúc, mô hình lỗi, và demo chạy lệnh đo | 1h |
| V9 | AI-LOG phần agents/infra. Review PR của Thái | 1h |

### 🟪 Thái: Nguồn, phân tích & truyền thông (Criterion 3, 4, 5)

| # | Việc | Ước tính |
|---|---|---|
| T1 | Cập nhật câu hỏi trên sheet đăng ký và theo dõi comment của giảng viên | 0.5h |
| T2 | **Kiểm chứng facts**: đọc bản gốc và ghi URL + ngày đọc cho mọi version/date/status. Bao gồm A2A spec v1.0/1.0.1, `a2a-sdk`, ADK, LangGraph, CrewAI, OWASP ASI07/08/10, các paper (75,8%, A2ABreak 11 lỗ hổng, MAST) và các GitHub issue. Lập `docs/sources.md` | 4h |
| T3 | `analyze.py`: tính median, min–max, IQR từ `results/`, xuất bảng markdown và biểu đồ PNG. **Mọi số trên slide và REPORT đều sinh từ script này** | 3h |
| T4 | Chạy và phân tích phần độ nhạy (W, fault rate) | 2h |
| T5 | **REPORT:** viết *Question*, *Findings*, *Recommendation*, *When NOT to use*, *Sources*. Biên tập toàn bài cho ≤ 3 trang | 4h |
| T6 | **slides.pdf**: số đọc rõ, mỗi con số có chú thích tên file log | 3h |
| T7 | Kịch bản talk, ghép video ≤ 8 phút, `TALK.md`. Bài đăng Facebook `#AWADSeminar23KTPM1` | 2h |
| T8 | **Talk:** đoạn 1 (câu hỏi, lý do quan trọng, bằng chứng thực tế) và đoạn 4 (khuyến nghị, khi nào không nên dùng) | 1h |
| T9 | AI-LOG phần nguồn/facts. Review PR của Linh | 0.5h |

### 🟩 Linh: Orchestrator & lệnh đo (Criterion 2, 30 điểm)

| # | Việc | Ước tính |
|---|---|---|
| L1 | Spike Ngày 1–2: orchestrator ADK gọi remote agent qua A2A với logic **deterministic** (custom agent, không LLM). Nếu không ổn định thì dùng client `a2a-sdk` thuần bên trong ADK, xem mục 6 | 3h |
| L2 | Router đọc Agent Card và chấm điểm theo skill (luật cố định) | 1h |
| L3 | Policy `trust` và `verify` dùng chung code, chỉ khác một nhánh. Có timeout, retry, cửa sổ chờ `W` | 3h |
| L4 | `measure.py`: khởi động/dừng process mỗi run, DB mới, warm-up, 2 policy × 5 seed, ghi `results/` | 4h |
| L5 | `classify.py`: gán nhãn mỗi task từ primary DB và event log | 2h |
| L6 | Replay mode mặc định + mode `--live` có giới hạn chi phí | 2h |
| L7 | **README.md:** từ fresh clone tới lệnh đo, từng bước (Windows + Linux/macOS). Thử trên máy sạch | 2h |
| L8 | **REPORT:** viết mục *Method / how to re-run* và mục *Limits* (phần kỹ thuật) | 1h |
| L9 | **Talk:** đoạn 3 (khoảng 2 phút), gồm log chạy thật và các con số headline kèm spread | 1h |
| L10 | AI-LOG phần orchestrator/bench. Review PR của Vũ | 1h |

**Tổng ước tính:** Vũ ~20h, Thái ~20h, Linh ~20h.

### Việc chung (cả 3 người)

- **SELF_ASSESSMENT_REPORT.md:** mỗi người điền bằng chứng cho tiêu chí mình phụ trách:
  - Vũ: tiêu chí 1.
  - Linh: tiêu chí 2.
  - Thái: tiêu chí 3, 4, 5.
  - Cả nhóm: tiêu chí 6.

  Chấm sát thực tế, không thổi điểm. Lệch quá +10 điểm so với điểm thật sẽ bị trừ.
- **Tự red-team trước khi nộp** (Ngày 11), theo vòng:
  - Thái clone repo về một máy khác và chạy theo README.
  - Vũ đối chiếu mọi con số trong REPORT và slide với log.
  - Linh kiểm tra từng nguồn trích dẫn.
- **Red team chính thức:** ngồi chung một buổi để mở issue `[red-team] <MSSV>` trên repo đội được phân công.
  - Chia việc: Linh chạy lệnh đo, Vũ soi baseline và độ fair, Thái soi nguồn và số trên slide.

---

## 4. Lịch trình

| Ngày | Mốc | Ai | Xong khi |
|---|---|---|---|
| 1 | Kickoff, chốt hợp đồng giao tiếp (mục 2), tạo repo public, cập nhật sheet | Cả nhóm | Repo + `CONTRACTS.md` merged |
| 1–2 | Spike framework + A2A, kiểm chứng version | Vũ, Linh / Thái | Agent mẫu trả lời qua A2A. Bảng version có nguồn |
| 3–5 | Xây agents, DB, proxy / orchestrator, policy, measure / sources, `analyze.py` khung | Từng người | Chạy được 1 run end-to-end với 20 task |
| 6 | **Freeze code thí nghiệm**, ghi response LLM (live, giới hạn chi phí) | Linh, Vũ | `llm_replay/` committed |
| 7 | Chạy đo chính thức 5 seed × 2 policy + độ nhạy | Linh, Thái | `results/` đầy đủ, có `summary.json` |
| 8 | Phân tích, viết REPORT bản nháp | Cả nhóm (theo mục) | REPORT ≤ 3 trang, mọi số có log |
| 9 | Slides + kịch bản talk | Thái chính, mỗi người làm slide phần mình | slides.pdf v1 |
| 10 | Quay talk ≤ 8 phút, AI-LOG, SELF_ASSESSMENT | Cả nhóm | Link video, các file `.md` hoàn chỉnh |
| 11 | Tự red-team, sửa lỗi, chạy lại nếu code đổi | Cả nhóm | Fresh clone chạy ra số nằm trong spread |
| 12 | Nộp zip `<MSSV1>-<MSSV2>-<MSSV3>_<total>.zip` (có `.git`), đăng Facebook | Thái nộp, Linh đăng | Đã nộp |
| sau đó | Red team đội khác. Chuẩn bị live 10 phút nếu được chọn | Cả nhóm | Issue mở đúng hạn |

**Quy tắc:** sau khi freeze ở Ngày 6, mọi thay đổi code thí nghiệm đều bắt buộc chạy lại toàn bộ 5 seed. Không ghép kết quả của hai phiên bản code khác nhau.

---

## 5. Đối chiếu với rubric (Definition of Done)

| Tiêu chí | Điểm | Điều kiện đạt mức cao nhất | Chủ trì | Bằng chứng trong SELF_ASSESSMENT |
|---|---|---|---|---|
| 1. Câu hỏi + baseline | 15 | Câu hỏi nêu thay đổi và chỉ số có đơn vị. Baseline chỉ khác 1 điểm. Có bảng "held fixed" | Vũ | REPORT §Setup, `fault_schedule.json` giống nhau giữa hai policy |
| 2. Chạy lại được | 30 | Fresh clone + README + 1 lệnh. 5 run, median và spread. Mọi số có trong log | Linh | `results/`, README, kết quả tự red-team |
| 3. Phát hiện + khuyến nghị | 20 | Nêu mức thay đổi, cái giá (ms, báo động giả, lượt gọi), khi nào không nên dùng, giới hạn (rò rỉ dữ liệu, lag giả lập, lỗi tương quan) | Thái | REPORT §Findings/§Limits |
| 4. Talk | 15 | ≤ 8 phút. Mở bằng câu hỏi, có log chạy, headline kèm spread, kết bằng khuyến nghị. **Cả 3 người cùng nói** | Thái | Mốc thời gian trong video |
| 5. Nguồn | 10 | Mọi fact có nguồn chính thức + ngày đọc. Không có fact nào sai | Thái | `docs/sources.md`, REPORT §Sources |
| 6. AI-LOG | 10 | Ghi tool, phần dùng, các mục Changed/Rejected cụ thể, ít nhất 1 lỗi của assistant bị bắt | Cả nhóm | AI-LOG.md |

**Mục AI-LOG có sẵn từ giai đoạn chọn đề:**
- Assistant từng đưa ra ngày phát hành A2A v1.0 mâu thuẫn nhau (12/3 vs 9/4/2026).
- Assistant gọi "150 tổ chức ủng hộ" là "150 production deployments".
- Bản câu hỏi v2 (đối chiếu chéo) không áp dụng được cho task có tác dụng phụ, nên đã bị loại.

---

## 6. Rủi ro & phương án dự phòng

| Rủi ro | Dấu hiệu | Phương án |
|---|---|---|
| ADK khó điều khiển deterministic | Spike L1 thất bại | Orchestrator dùng client `a2a-sdk` thuần. Ghi rõ trong REPORT. Các agent vẫn thuộc 2 framework khác nhau |
| CrewAI/LangGraph lệch phiên bản giao thức (v0.3 vs v1.0) | Lỗi parse Agent Card hoặc lỗi trên wire | Pin version. Expose mọi agent qua cùng `a2a-sdk` v1.x. Nếu gặp vấn đề này, ghi lại như một phát hiện phụ |
| Bug SDK thật (task kẹt `working`) | Kết quả lạ ở F1/F2 | Không giấu. Ghi issue liên quan, coi đó là bằng chứng thực tế |
| Latency nhiễu | Spread lớn | Dùng cùng máy, tắt app nặng, warm-up, báo IQR. Nếu cần thì tăng lên 200 → 500 task/run |
| Chi phí LLM | — | Replay mặc định. Giới hạn chi phí cho live, ví dụ ≤ $2 |
| Red team chê "lỗi giả lập không giống thật" | — | Mỗi loại lỗi gắn với một nguồn thực tế (bảng 1.3). Phần limits nêu rõ những gì không đo |
| Trễ tiến độ | Chưa có run end-to-end ở cuối Ngày 5 | Cắt phần độ nhạy trước. Headline vẫn giữ |
