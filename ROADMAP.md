# FinMate Development Roadmap

> Last Updated: 2026-09-22  
> Status: Phase 2 - Frontend Development In Progress

---

## 🎯 Project Vision
Build an AI-powered financial analysis tool using Small Language Models (SLM) to extract, analyze, and provide insights from bank statements with a privacy-first, local-first architecture.

---

## Phase 1: Foundation ✅ COMPLETE

### Backend Setup ✅
- [x] Initialize FastAPI project structure
- [x] Set up virtual environment and dependencies
- [x] Configure Pydantic settings management
- [x] Create Docker Compose configuration

### PDF Processing ✅
- [x] Implement PDF upload endpoint (`/statements/upload`)
- [x] Integrate PyMuPDF (fitz) for text extraction
- [x] Add background task processing
- [x] Create status tracking endpoint (`/statements/{id}/status`)
- [x] Build content retrieval endpoint (`/statements/{id}`)

### Data Models ✅
- [x] Define Pydantic schemas for upload, status, and content responses
- [x] Implement in-memory storage (temporary solution)

**📚 What We Learned:**
- FastAPI background tasks for async processing
- PyMuPDF library for PDF text extraction
- Pydantic for request/response validation
- RESTful API design patterns
- File upload handling and storage management

---

## Phase 2: Frontend Development 🔄 IN PROGRESS

### Project Setup
- [x] Initialize Next.js 14 with App Router
- [x] Configure TypeScript and ESLint
- [x] Set up Tailwind CSS with custom black/white theme
- [x] Install and configure Framer Motion for animations
- [x] Set up project structure (components, hooks, utils)

### Core Pages & Layout
- [x] Create main layout with navigation
- [x] Build landing/home page
- [x] Design upload interface page
- [ ] Create dashboard page structure
- [x] Implement responsive navigation

### Upload Interface
- [x] Build drag-and-drop file upload component
- [x] Add file validation (PDF only, size limits)
- [x] Create upload progress indicator
- [x] Implement status polling after upload
- [x] Add error handling and user feedback

### Dashboard Components
- [ ] Build statement list view
- [x] Create statement detail view
- [x] Design extracted text display component
- [x] Add loading states and skeletons
- [x] Implement empty states

### Animations & Polish
- [x] Add scroll-triggered animations
- [x] Implement smooth page transitions
- [x] Create micro-interactions (hover, focus states)
- [x] Add fade-in animations for components
- [x] Optimize animation performance

### API Integration
- [x] Create API client utility
- [x] Implement upload mutation
- [x] Add status polling logic
- [x] Handle error states and retries
- [x] Type API responses

**📚 What We're Learning:**
- Next.js 14 App Router and React Server Components
- Framer Motion for production-grade animations
- TypeScript for type-safe React development
- Tailwind CSS custom theming
- File upload UX patterns
- API integration with React hooks
- Performance optimization for animations

---

## Phase 3: LLM Integration with Ollama 📦 TODO

### Ollama Setup
- [ ] Install Ollama locally
- [ ] Pull recommended model (Llama 3.2 3B or Phi-3 Mini)
- [ ] Test model inference locally
- [ ] Document model selection reasoning

### Backend LLM Integration
- [ ] Add `ollama` Python client dependency
- [ ] Create LLM service layer (`app/services/llm.py`)
- [ ] Implement prompt templates for financial analysis
- [ ] Build transaction parsing endpoint
- [ ] Add category extraction logic
- [ ] Create merchant normalization function

### Transaction Intelligence
- [ ] Parse extracted text into transaction objects
- [ ] Categorize transactions using LLM
- [ ] Normalize merchant names
- [ ] Extract dates, amounts, and descriptions
- [ ] Validate extracted data with Pydantic

### New Endpoints
- [ ] `POST /statements/{id}/analyze` - Trigger LLM analysis
- [ ] `GET /statements/{id}/transactions` - Get parsed transactions
- [ ] `GET /statements/{id}/insights` - Get spending insights

### Frontend Integration
- [ ] Display parsed transactions in table
- [ ] Show category breakdown
- [ ] Visualize merchant distribution
- [ ] Add re-categorization UI
- [ ] Show LLM confidence scores

**📚 What We'll Learn:**
- Ollama local LLM deployment
- Prompt engineering for financial data
- Structured output from LLMs
- LLM response validation
- Error handling for AI systems
- Building AI-powered features

---

## Phase 4: Database Integration 📊 TODO

### PostgreSQL Setup
- [ ] Add PostgreSQL to Docker Compose
- [ ] Install SQLAlchemy and psycopg2
- [ ] Set up Alembic for migrations
- [ ] Create initial migration

### Database Schema
- [ ] Design `statements` table
- [ ] Design `transactions` table
- [ ] Design `categories` table
- [ ] Design `merchants` table
- [ ] Add proper indexes and constraints

### SQLAlchemy Models
- [ ] Create Statement model
- [ ] Create Transaction model
- [ ] Create Category model
- [ ] Create Merchant model
- [ ] Define relationships

### Database Layer
- [ ] Implement CRUD operations for statements
- [ ] Implement CRUD operations for transactions
- [ ] Add query utilities for analytics
- [ ] Implement time-series queries
- [ ] Add data aggregation functions

### Migration from In-Memory
- [ ] Update API endpoints to use database
- [ ] Remove in-memory storage
- [ ] Add database session management
- [ ] Implement connection pooling

**📚 What We'll Learn:**
- PostgreSQL schema design for financial data
- SQLAlchemy ORM patterns
- Database migrations with Alembic
- Connection pooling and session management
- Writing efficient SQL queries
- Database indexing strategies

---

## Phase 5: Advanced Analytics 📈 TODO

### Spending Analysis
- [ ] Calculate category totals
- [ ] Identify spending trends over time
- [ ] Detect recurring transactions
- [ ] Find unusual spending patterns
- [ ] Calculate monthly averages

### Insights Generation
- [ ] Use LLM to generate natural language insights
- [ ] Identify potential savings opportunities
- [ ] Detect duplicate subscriptions
- [ ] Flag large or unusual transactions
- [ ] Generate monthly summaries

### Data Visualization
- [ ] Install chart library (Chart.js or Recharts)
- [ ] Create spending by category pie chart
- [ ] Build spending over time line chart
- [ ] Design merchant comparison bar chart
- [ ] Add interactive tooltips and legends

### Budget Features
- [ ] Create budget setting UI
- [ ] Implement budget tracking
- [ ] Add budget alerts
- [ ] Show budget vs actual comparison
- [ ] Generate budget recommendations

### Natural Language Queries
- [ ] Design query input interface
- [ ] Implement LLM-powered query parsing
- [ ] Execute queries against database
- [ ] Format responses naturally
- [ ] Handle edge cases and errors

**📚 What We'll Learn:**
- Financial data analysis techniques
- Chart.js/Recharts for data visualization
- Building recommendation systems
- Natural language to SQL/query conversion
- Time-series data analysis
- Budget tracking algorithms

---

## Phase 6: Privacy & Security 🔒 TODO

### Security Hardening
- [ ] Add authentication (JWT or OAuth)
- [ ] Implement user registration/login
- [ ] Add file encryption at rest
- [ ] Secure sensitive data in database
- [ ] Add rate limiting

### Privacy Features
- [ ] Implement data deletion endpoint
- [ ] Add export functionality (GDPR)
- [ ] Create privacy policy
- [ ] Add data retention policies
- [ ] Implement local-only mode

### Testing
- [ ] Write unit tests for backend
- [ ] Add integration tests for API
- [ ] Create frontend component tests
- [ ] Add E2E tests with Playwright
- [ ] Set up CI/CD pipeline

**📚 What We'll Learn:**
- Authentication and authorization patterns
- Data encryption techniques
- GDPR compliance basics
- Testing strategies for full-stack apps
- CI/CD setup with GitHub Actions
- Security best practices

---

## Phase 7: Polish & Deployment ✨ TODO

### Error Handling
- [ ] Add global error boundary
- [ ] Implement retry mechanisms
- [ ] Create user-friendly error messages
- [ ] Add logging and monitoring
- [ ] Set up error tracking (Sentry)

### Performance Optimization
- [ ] Optimize database queries
- [ ] Add pagination for large datasets
- [ ] Implement lazy loading
- [ ] Optimize bundle size
- [ ] Add caching strategies

### Documentation
- [ ] Write README with setup instructions
- [ ] Create API documentation
- [ ] Add inline code comments
- [ ] Write user guide
- [ ] Document deployment process

### Deployment
- [ ] Set up production environment
- [ ] Configure domain and SSL
- [ ] Deploy with Docker
- [ ] Set up database backups
- [ ] Monitor production metrics

**📚 What We'll Learn:**
- Production deployment strategies
- Performance profiling and optimization
- Error tracking and monitoring
- Writing technical documentation
- DevOps fundamentals

---

## 🎓 Learning Objectives Summary

**Full-Stack Development**
- Modern React patterns with Next.js 14
- RESTful API design with FastAPI
- TypeScript for type safety
- Responsive UI design

**AI/ML Integration**
- Local LLM deployment with Ollama
- Prompt engineering for structured data
- AI-powered data extraction
- Building intelligent features

**Data Engineering**
- PDF processing and text extraction
- Database schema design
- Time-series data analysis
- Data visualization

**Software Engineering**
- Testing strategies
- CI/CD pipelines
- Security best practices
- Performance optimization

---

## 📝 Notes & Decisions

### Technology Choices
- **Backend**: FastAPI (fast, modern, great documentation)
- **Frontend**: Next.js 14 (React Server Components, App Router)
- **Database**: PostgreSQL (reliable, great for financial data)
- **LLM**: Ollama with Llama 3.2 3B (local, fast, good quality)
- **Animations**: Framer Motion (production-ready, performant)
- **Styling**: Tailwind CSS (rapid development, consistent design)

### Design Decisions
- **Local-first**: All data processing happens locally for privacy
- **Minimalist UI**: Black and white theme, clean and professional
- **Smooth animations**: Enhance UX without feeling over-designed
- **Responsive**: Works on desktop, tablet, and mobile

---

## 🚀 Quick Start Commands

```bash
# Backend
cd backend
source venv/Scripts/activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (once set up)
cd frontend
npm install
npm run dev

# Docker (full stack)
docker-compose up --build
```

---

*This roadmap is a living document. Update as we progress and learn.*
