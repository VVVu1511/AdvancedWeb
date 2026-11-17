
# Team Task Division — Web Development Seminar

## 1. Project Overview

**Project:** Web Development Study  
**Team size:** 3 members  
**Objective:** Investigate a new web development topic, formulate a research question, and answer it through a reproducible experiment.

The study must include:
- A baseline implementation and one improvement/change.
- A measurable research question.
- One command to reproduce the experiment.
- At least 5 experimental runs.
- A short research report (maximum 3 pages).
- Presentation slides and a recorded talk (maximum 8 minutes).

---

## 2. Task Allocation

### Member 1 — Research & Experiment Design Lead

**Main responsibility:** Research the topic and design a valid experiment.

Tasks:
- [ ] Research the selected web development topic.
- [ ] Define the research question and hypothesis.
- [ ] Review relevant documentation and existing approaches.
- [ ] Define the baseline and proposed change.
- [ ] Identify independent and dependent variables.
- [ ] Define the measurement methodology.
- [ ] Specify experimental conditions and control variables.
- [ ] Analyze and interpret experimental results.
- [ ] Write the following sections of `REPORT.md`:
  - Introduction
  - Research Question
  - Background / Related Work
  - Methodology

**Deliverables:**
- Research question and hypothesis.
- Experiment design and methodology.
- Research background.
- First part of `REPORT.md`.

### Member 2 — Implementation & Benchmarking Lead

**Main responsibility:** Implement the baseline, improvement, and reproducible measurement.

Tasks:
- [ ] Initialize and maintain the public GitHub repository.
- [ ] Set up the project structure and dependencies.
- [ ] Implement the baseline version.
- [ ] Implement the proposed improvement/change.
- [ ] Ensure both implementations are comparable.
- [ ] Create the benchmark / measurement script.
- [ ] Provide one command to reproduce the experiment.
- [ ] Run at least 5 experiments for each configuration.
- [ ] Save raw measurement data.
- [ ] Document the execution environment and dependencies.
- [ ] Write `README.md` with setup and execution instructions.
- [ ] Provide implementation details for `REPORT.md`.

**Deliverables:**
- Baseline implementation.
- Improved implementation.
- Reproducible benchmark script.
- Raw experimental data.
- `README.md`.

### Member 3 — Data Analysis & Presentation Lead

**Main responsibility:** Visualize results and prepare the final presentation.

Tasks:
- [ ] Review experimental data and verify its consistency.
- [ ] Calculate appropriate statistics (mean, median, standard deviation, etc.).
- [ ] Compare baseline and improved implementations.
- [ ] Create tables and charts to communicate findings.
- [ ] Write the following sections of `REPORT.md`:
  - Results
  - Discussion
  - Limitations
  - Conclusion
- [ ] Prepare `slides.pdf`.
- [ ] Write the presentation outline and script.
- [ ] Coordinate recording the talk (maximum 8 minutes).
- [ ] Create `TALK.md` with the recording link.
- [ ] Prepare the Facebook post for class voting.

**Deliverables:**
- Statistical analysis and visualizations.
- Final sections of `REPORT.md`.
- `slides.pdf`.
- Recorded presentation.
- `TALK.md`.

---

## 3. Shared Responsibilities

All team members are responsible for:

- [ ] Agreeing on the topic and research question.
- [ ] Reviewing the experiment design before implementation.
- [ ] Ensuring the experiment is fair and reproducible.
- [ ] Reviewing the results and avoiding unsupported conclusions.
- [ ] Reviewing the final report and presentation.
- [ ] Contributing to `AI-LOG.md`.
- [ ] Contributing to `SELF_ASSESSMENT_REPORT.md`.
- [ ] Reviewing and testing the repository before submission.
- [ ] Participating in the assigned red-team review.

Each member should review at least one important contribution made by another member.

---

## 4. Timeline & Milestones

| Date | Milestone | Expected Result |
|---|---|---|
| Nov 17–18 | Topic and research question | Topic finalized |
| Nov 19–20 | Research and experiment design | Methodology approved |
| Nov 21–22 | Baseline and improvement | Both implementations working |
| Nov 23–24 | Benchmarking | At least 5 runs per configuration |
| Nov 25–26 | Data analysis and report | Draft report completed |
| Nov 27 | Slides and presentation | Slides and recorded talk ready |
| Nov 28 | Final review | Repository verified |
| Nov 29, 22:00 | Submission deadline | ZIP submitted and Facebook post published |
| Nov 30–Dec 2 | Red-team review | At least one issue opened by Dec 2, 22:00 |

---

## 5. Repository Structure

```text
web-development-study/
├── src/
│   ├── baseline/
│   └── improved/
├── benchmark/
│   ├── run.*
│   └── results/
├── docs/
│   └── methodology.md
├── README.md
├── REPORT.md
├── slides.pdf
├── TALK.md
├── AI-LOG.md
├── SELF_ASSESSMENT_REPORT.md
└── TASK_DIVISION.md
```

The actual source code structure may be adjusted based on the selected topic.

---

## 6. Collaboration Rules

1. Each member should work on a separate feature branch.
2. Use Pull Requests when merging changes into `seminar`.
3. Communicate progress and blockers regularly.
4. Do not overwrite another member's work without discussion.
5. Keep experimental data and configurations in the repository.
6. Every reported measurement must be traceable to a reproducible run.
7. All required written deliverables must be in English.

---

## 7. Definition of Done

The project is considered complete when:

- [ ] The research question is clearly stated and answered.
- [ ] Baseline and improved versions are implemented.
- [ ] The measurement can be reproduced with one command.
- [ ] At least 5 runs are completed for each configuration.
- [ ] Raw results and experimental conditions are available.
- [ ] `README.md` explains how to reproduce the study.
- [ ] `REPORT.md` is no longer than 3 pages.
- [ ] `slides.pdf` is ready.
- [ ] The recorded talk is no longer than 8 minutes.
- [ ] `TALK.md` contains the recording link.
- [ ] `AI-LOG.md` is completed.
- [ ] `SELF_ASSESSMENT_REPORT.md` is completed.
- [ ] The public GitHub repository is ready for submission.

**Note:** Task ownership does not mean working in isolation. All members should understand the research question, methodology, results, and conclusions well enough to explain the entire study during the presentation.
