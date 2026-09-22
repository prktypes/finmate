# FinPilot

> Privacy-first agentic personal finance intelligence powered by local LLMs.

FinPilot transforms raw bank statements into structured financial data, analyzes spending behavior, detects anomalies and recurring expenses, and uses goal-driven AI agents to generate personalized financial plans.

The core design principle is simple:

**LLMs handle reasoning and interpretation. Deterministic systems handle financial truth.**

---

## Architecture

```text
                    ┌─────────────────────┐
                    │    Bank Statement   │
                    │       PDF / OCR     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Document Processing │
                    │  PDF Parser + OCR    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Transaction Engine  │
                    │ Extraction +         │
                    │ Validation           │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Merchant & Category │
                    │ Normalization       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    PostgreSQL       │
                    │ Financial Source    │
                    │      of Truth       │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┼─────────────┐
                 ▼             ▼             ▼
          ┌────────────┐ ┌────────────┐ ┌────────────┐
          │ Analytics  │ │ Anomalies  │ │ Forecasting│
          └─────┬──────┘ └─────┬──────┘ └─────┬──────┘
                │              │              │
                └──────────────┼──────────────┘
                               ▼
                    ┌─────────────────────┐
                    │  LangGraph Agents   │
                    │                     │
                    │ Analyst             │
                    │ Budget              │
                    │ Savings             │
                    │ Anomaly             │
                    │ Forecast            │
                    │ Financial Coach     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Recommendations /   │
                    │ Alerts / Simulations │
                    └─────────────────────┘
