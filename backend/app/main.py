from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.statements import router as statements_router
from app.core.config import settings

app = FastAPI(
    title="FinMate API",
    description="AI-powered bank statement analysis and financial insights",
    version="1.0.0",
)

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(statements_router)

@app.get("/")
def read_root():
    return {
        "message": "FinMate API",
        "version": "1.0.0",
        "environment": settings.environment,
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
