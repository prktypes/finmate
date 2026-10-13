# FinMate Project Plan

*Last Updated: 2026-10-13*

## Project Overview

FinMate is an AI-powered financial analysis tool that transforms raw bank statements into structured financial data, analyzes spending behavior, detects anomalies and recurring expenses, and generates personalized financial plans using local LLMs (Ollama).

**Core Design Principle**: "LLMs handle reasoning and interpretation. Deterministic systems handle financial truth."

**Architecture**: 
- Frontend: Next.js 14 with App Router, Tailwind CSS, Framer Motion
- Backend: FastAPI, SQLAlchemy, PostgreSQL, Ollama for LLM
- Database: PostgreSQL
- LLM: Local Ollama with phi3:mini model
- Key Features: PDF upload, transaction extraction, category classification, merchant normalization, spending insights, visualizations

## Current Status

### ✅ Phase 1: Foundation - COMPLETE
- FastAPI project structure initialized
- Virtual environment and dependencies configured
- Pydantic settings management
- Docker Compose configuration
- PDF upload endpoint (`/statements/upload`)
- PyMuPDF (fitz) text extraction
- Background task processing
- Status tracking endpoint (`/statements/{id}/status`)
- Content retrieval endpoint (`/statements/{id}`)
- Pydantic schemas for upload, status, and content responses

### ✅ Phase 2: Frontend Development - COMPLETE
- Next.js 14 with App Router
- TypeScript and ESLint configured
- Tailwind CSS with custom theme
- Framer Motion for animations
- Project structure (components, hooks, utils)
- Main layout with navigation
- Landing/home page
- Upload interface page
- Dashboard page structure
- Drag-and-drop file upload component
- File validation (PDF only, size limits)
- Upload progress indicator
- Status polling after upload
- Statement list view
- Statement detail view
- Extracted text display component
- Loading skeletons and empty states
- Scroll-triggered animations
- Smooth page transitions
- Micro-interactions
- API client utility
- Upload mutation
- Status polling logic
- Error state handling
- Type API responses

### ✅ Phase 3: LLM Integration - SUBSTANTIALLY COMPLETE
- Ollama Python client dependency added
- LLM service layer (`app/services/llm.py`) created
- Prompt templates for financial analysis
- Transaction parsing endpoint (`POST /statements/{id}/analyze`)
- Category extraction logic
- Merchant normalization function
- Transaction parsing from extracted text
- Transaction listing endpoint (`GET /statements/{id}/transactions`)
- Insights generation endpoint (`GET /statements/{id}/insights`)
- LLM service with transaction extraction, category classification, merchant normalization, insights generation

### 🔄 Phase 4: Database Integration - IN PROGRESS

#### Completed This Session ✅
- [x] PostgreSQL service configured in docker-compose.yml (verified existing config with service health checks, volumes, restart policies)
- [x] `app/db/base.py` exists with create_engine, sessionmaker, declarative Base, and get_db() dependency
- [x] SQLAlchemy models exist in app/models/__init__.py: Statement, Category, Merchant, Transaction with full relationships (relationships defined, FK constraints, cascade options)
- [x] `alembic/env.py` configured to import from app.models and app.db.base, sets sqlalchemy.url from settings.database_url
- [x] Database URL in config.py: `postgresql://finmate_user:finmate_password@localhost:5432/finmate`
- [x] requirements.txt includes: fastapi, uvicorn[standard], pydantic, pydantic-settings, pymupdf, python-multipart, ollama, sqlalchemy, alembic, psycopg2-binary, pytest, pytest-asyncio, httpx
- [x] Statement model updated with `analysis_complete` Boolean field (default False)
- [x] main.py updated: `Base.metadata.create_all(bind=engine)` added on startup, `app.models` imported for model registration
- [x] api/statements.py updated to use database dependency injection (`Depends(get_db)`)
- [x] API endpoints refactored:
    - Upload: saves Statement record to DB, background task for text extraction
    - Status: queries Statement from DB
    - Content: queries extracted_text from DB
    - Analyze: extracts transactions via LLM, saves Transaction records to DB, marks statement.analysis_complete = True
    - Transactions: queries Transaction records from DB filtered by statement_id
    - Insights: queries Transaction records from DB, generates LLM insights

#### In-Progress This Session 🔄
- [ ] Run `alembic upgrade head` to create database tables (requires PostgreSQL running)
- [ ] Verify all tables created: statements, categories, merchants, transactions
- [ ] Test full upload → process → analyze → retrieve flow with PostgreSQL
- [ ] Verify data persistence across application restarts

#### Next Steps
- [ ] Start PostgreSQL (via Docker: `docker compose up -d postgres`)
- [ ] Run `alembic upgrade head` to create tables: statements, categories, merchants, transactions
- [ ] Full integration test: upload → analyze → retrieve statements and transactions
- [ ] Verify dashboard displays real data from database
- [ ] Remove any remaining in-memory references (statement_db dict)

#### Note
Docker not currently available in this environment. Code changes made are database-ready. When Docker is started:
1. `docker compose up -d postgres`
2. `alembic upgrade head` (creates tables: statements, categories, merchants, transactions)
3. Full stack test with real data persistence

### ⏳ Phase 5: Advanced Analytics - TODO
- Spending analysis utilities (category totals, recurring transactions, spending trends)
- Data visualization components (Recharts: Pie chart, Line chart, Merchant Bar Chart)
- Budget features (setting, tracking, alerts, recommendations)
- Natural language query interface (LLM-powered query parsing and execution)

### ⏳ Phase 6: Privacy & Security - TODO
- JWT authentication middleware
- User registration/login endpoints
- Data deletion endpoint (GDPR compliance)
- Export functionality (JSON/CSV export)
- Rate limiting per endpoint/IP
- Testing framework (pytest backend, Jest frontend, integration tests)

### ⏳ Phase 7: Polish & Deployment - TODO
- Global error boundary (Next.js error.js)
- Retry mechanisms for API calls
- User-friendly error messages
- Logging and monitoring (console + optional Sentry)
- Database query optimization (indexes on foreign keys, frequently filtered fields)
- Pagination for statement lists and transaction tables
- Bundle size optimization (next-bundle-analyzer)
- Complete README with setup instructions
- API documentation (OpenAPI/Swagger UI)
- Inline code comments (docstrings for Python, JSDoc for TypeScript)
- User guide for features
- Docker deployment configuration
- Production environment variables
- Database backups strategy
- Production metrics monitoring (logs, response times)

## Core Logic

**Data Flow**:
1. User uploads bank statement PDF → `/statements/upload`
2. Background process extracts text using PyMuPDF → saves Statement record in DB
3. User triggers LLM analysis → `/statements/{id}/analyze`
4. LLM extracts transactions, classifies categories, normalizes merchants
5. Transaction records saved to DB, statement.analysis_complete = True
6. Dashboard displays transactions, charts, insights, anomalies from DB
7. User can query insights, view transaction history, get budget analysis from DB

**Key Components**:
- `backend/app/api/statements.py` - Main API endpoints (refactored for DB)
- `backend/app/services/llm.py` - LLM service for transaction extraction/analysis
- `backend/app/schemas/` - Pydantic schemas for requests/responses
- `frontend/app/` - Next.js pages and components
- `frontend/app/hooks/` - Custom React hooks for API interactions

**Storage**:
- Current: In-memory dictionary (`statement_db`) - data lost on restart
- Target: PostgreSQL via SQLAlchemy ORM with Alembic migrations

**Relationships**:
- Statement → Transaction (one-to-many, cascade delete)
- Statement → Category (many-to-many via transactions)
- Statement → Merchant (many-to-many via transactions)
- Transaction → Category (many-to-one)
- Transaction → Merchant (many-to-one)

## Development Commands

### Backend
```bash
cd backend
source venv/Scripts/activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Docker (full stack)
```bash
docker-compose up --build
```