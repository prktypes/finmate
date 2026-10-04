# FinPilot Task Breakdown
> Multi-workstream development plan
> Created: 2026-10-04

## Workstream A: Backend - LLM Integration & Database
**Owner**: Backend Development
**Duration**: ~2-3 days
**Dependencies**: None (can start immediately)

### A1: LLM Service Layer (Phase 3)
- [ ] Add `ollama` to requirements.txt
- [ ] Create `backend/app/services/llm.py`
  - [ ] Ollama client initialization
  - [ ] Prompt templates for transaction extraction
  - [ ] Category classification logic
  - [ ] Merchant normalization function
  - [ ] Error handling and fallbacks
- [ ] Create `backend/app/schemas/transactions.py`
  - [ ] TransactionBase schema
  - [ ] TransactionCreate schema
  - [ ] TransactionResponse schema
  - [ ] InsightResponse schema
- [ ] Update `backend/app/api/statements.py`
  - [ ] POST /statements/{id}/analyze endpoint
  - [ ] GET /statements/{id}/transactions endpoint
  - [ ] GET /statements/{id}/insights endpoint
- [ ] Test LLM integration with sample statements

### A2: Database Setup (Phase 4)
- [ ] Update `docker-compose.yml` with PostgreSQL
- [ ] Update `requirements.txt` with SQLAlchemy, alembic, psycopg2-binary
- [ ] Create `backend/app/db/` directory structure
  - [ ] `session.py` - database session management
  - [ ] `base.py` - declarative base
- [ ] Create `backend/app/models/`
  - [ ] `statement.py` - Statement model
  - [ ] `transaction.py` - Transaction model
  - [ ] `category.py` - Category model
  - [ ] `merchant.py` - Merchant model
- [ ] Initialize Alembic
  - [ ] `alembic init alembic`
  - [ ] Configure alembic.ini
  - [ ] Create initial migration
- [ ] Create CRUD operations in `backend/app/db/crud/`
  - [ ] `statements.py`
  - [ ] `transactions.py`
- [ ] Migrate API endpoints from in-memory to database storage
- [ ] Add database connection to main.py

---

## Workstream B: Frontend - Dashboard & Analytics UI
**Owner**: Frontend Development
**Duration**: ~2-3 days
**Dependencies**: None (can start immediately)

### B1: Dashboard Core (Phase 2 Completion)
- [ ] Create `frontend/app/dashboard/page.tsx`
  - [ ] Layout structure
  - [ ] Navigation integration
  - [ ] Responsive design
- [ ] Create `frontend/app/components/dashboard/`
  - [ ] StatementList.tsx - list view with filtering
  - [ ] StatementCard.tsx - individual statement card
  - [ ] StatementDetail.tsx - expanded view
  - [ ] LoadingSkeleton.tsx - loading states
  - [ ] EmptyState.tsx - no data state
- [ ] Create `frontend/app/hooks/`
  - [ ] useStatements.ts - fetch statements list
  - [ ] useStatement.ts - fetch single statement
  - [ ] useUpload.ts - move upload logic here
  - [ ] usePolling.ts - generic polling hook
- [ ] Add error boundaries
- [ ] Test responsive behavior

### B2: Analytics Components (Phase 5 Prep)
- [ ] Install chart library: `npm install recharts`
- [ ] Create `frontend/app/components/charts/`
  - [ ] SpendingPieChart.tsx - category breakdown
  - [ ] SpendingLineChart.tsx - time series
  - [ ] MerchantBarChart.tsx - top merchants
  - [ ] ChartContainer.tsx - wrapper with theming
- [ ] Create `frontend/app/components/insights/`
  - [ ] InsightCard.tsx - individual insight display
  - [ ] InsightsList.tsx - multiple insights
  - [ ] AnomalyAlert.tsx - unusual transaction highlight
- [ ] Create `frontend/app/components/transactions/`
  - [ ] TransactionTable.tsx - sortable, filterable table
  - [ ] TransactionRow.tsx - individual row
  - [ ] CategoryBadge.tsx - category display
  - [ ] AmountDisplay.tsx - formatted currency
- [ ] Create `frontend/app/components/budget/`
  - [ ] BudgetOverview.tsx - budget vs actual
  - [ ] BudgetProgress.tsx - progress bars
  - [ ] BudgetForm.tsx - set/edit budgets
- [ ] Add TypeScript types in `frontend/app/types/`
  - [ ] transaction.ts
  - [ ] insight.ts
  - [ ] budget.ts

---

## Workstream C: Infrastructure & DevOps
**Owner**: Infrastructure
**Duration**: ~1-2 days
**Dependencies**: None (can start immediately)

### C1: Docker & Environment
- [ ] Enhance `docker-compose.yml`
  - [ ] Add PostgreSQL service with proper volumes
  - [ ] Add environment variables
  - [ ] Configure networking
  - [ ] Add health checks for all services
  - [ ] Add restart policies
- [ ] Update `.env.example` with all variables
  - [ ] Database credentials
  - [ ] Ollama configuration
  - [ ] API keys (if needed)
  - [ ] Port configurations
- [ ] Create `backend/Dockerfile` (if missing)
  - [ ] Multi-stage build
  - [ ] Proper Python dependencies
  - [ ] Security best practices
- [ ] Create `frontend/Dockerfile`
  - [ ] Next.js optimized build
  - [ ] Production configuration
- [ ] Test full Docker setup

### C2: Testing Framework
- [ ] Backend testing setup
  - [ ] Add to requirements.txt: pytest, pytest-asyncio, httpx
  - [ ] Create `backend/tests/` structure
    - [ ] `conftest.py` - test configuration
    - [ ] `test_api/` - API endpoint tests
    - [ ] `test_services/` - service layer tests
    - [ ] `test_documents/` - PDF extraction tests
  - [ ] Write initial tests
  - [ ] Add pytest.ini configuration
- [ ] Frontend testing setup
  - [ ] Install: `npm install -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom`
  - [ ] Create `frontend/__tests__/` structure
  - [ ] Create jest.config.js
  - [ ] Write component tests
  - [ ] Add test scripts to package.json
- [ ] Integration tests
  - [ ] Create `tests/integration/` at root
  - [ ] Write end-to-end flow tests

### C3: CI/CD Pipeline
- [ ] Create `.github/workflows/ci.yml`
  - [ ] Backend linting (flake8, black)
  - [ ] Backend tests
  - [ ] Frontend linting (eslint)
  - [ ] Frontend tests
  - [ ] Build verification
  - [ ] Docker build test
- [ ] Create `.github/workflows/cd.yml` (deployment placeholder)
- [ ] Add pre-commit hooks
  - [ ] Create `.pre-commit-config.yaml`
  - [ ] Add hooks for linting and formatting
- [ ] Create `CONTRIBUTING.md`
  - [ ] Development setup instructions
  - [ ] Commit message conventions
  - [ ] Testing requirements
  - [ ] PR process

### C4: Security & Documentation
- [ ] Update `.gitignore`
  - [ ] Environment files
  - [ ] Database files
  - [ ] Cache directories
  - [ ] IDE files
- [ ] Create `SECURITY.md`
  - [ ] Security best practices
  - [ ] Vulnerability reporting
  - [ ] Data encryption approach
  - [ ] Authentication notes (for Phase 6)
- [ ] Create `docs/` directory
  - [ ] `API.md` - API documentation
  - [ ] `DEPLOYMENT.md` - deployment guide
  - [ ] `ARCHITECTURE.md` - system architecture
  - [ ] `TESTING.md` - testing guide
- [ ] Add inline documentation
  - [ ] Docstrings for Python functions
  - [ ] JSDoc for TypeScript functions

---

## Commit Strategy

### Commit Message Format
```
<type>(<scope>): <description>

[optional body]

Co-Authored-By: Claude Code <noreply@anthropic.com>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructuring
- `test`: Adding tests
- `docs`: Documentation
- `ci`: CI/CD changes
- `chore`: Maintenance

### Scopes
- `backend`: Backend changes
- `frontend`: Frontend changes
- `infra`: Infrastructure changes
- `db`: Database changes
- `api`: API changes
- `ui`: UI components

### Commit Frequency
- After completing each checkbox item
- After each logical unit of work
- Before switching between workstreams
- After successful tests

---

## Integration Points

### Backend → Frontend
- API endpoints must be documented
- TypeScript types should match API responses
- Error handling conventions shared

### Backend → Database
- Models must match schema designs
- CRUD operations should be transaction-safe
- Migration strategy documented

### Infrastructure → Both
- Docker networking configured correctly
- Environment variables documented
- Health checks implemented

---

## Success Criteria

### Phase 3 Complete
- ✅ LLM can extract transactions from statements
- ✅ Categories are classified correctly
- ✅ Merchants are normalized
- ✅ API endpoints return structured data
- ✅ Tests pass

### Phase 4 Complete
- ✅ Database migrations run successfully
- ✅ Data persists across restarts
- ✅ CRUD operations work
- ✅ API uses database instead of memory
- ✅ Tests pass

### Phase 2 Complete
- ✅ Dashboard displays statements
- ✅ UI is responsive
- ✅ Loading states work
- ✅ Empty states work
- ✅ Animations are smooth

### Infrastructure Complete
- ✅ Docker compose brings up full stack
- ✅ Tests run in CI
- ✅ Security best practices documented
- ✅ Development workflow documented

---

## Timeline

### Day 1
- Morning: A1 (LLM Service) + B1 (Dashboard Core)
- Afternoon: A2 (Database Models) + C1 (Docker)

### Day 2
- Morning: A2 (Database Migration) + B2 (Analytics Components)
- Afternoon: C2 (Testing) + Integration

### Day 3
- Morning: C3 (CI/CD) + C4 (Documentation)
- Afternoon: Testing, bug fixes, polish

---

*This breakdown enables parallel development with clear integration points and commit boundaries.*
