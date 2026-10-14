from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Depends
from typing import Dict, List, Optional
import shutil
import os
import uuid
from datetime import datetime

from sqlalchemy.orm import Session

from app.schemas.statements import StatementUploadResponse, StatementStatusResponse, StatementContentResponse
from app.schemas.transactions import (
    TransactionResponse,
    AnalyzeRequest,
    AnalyzeResponse,
    InsightResponse
)
from app.core.config import settings
from app.documents.extraction import extract_text_from_pdf
from app.services.llm import get_llm_service
from app.db.session import get_db
from app.models import Statement, Transaction

router = APIRouter(prefix="/statements", tags=["statements"])


def get_statement_or_404(statement_id: str, db: Session) -> Statement:
    """Get statement from database or raise 404."""
    statement = db.query(Statement).filter(Statement.id == statement_id).first()
    if not statement:
        raise HTTPException(status_code=404, detail="Statement not found.")
    return statement


def process_statement(statement_id: str, filepath: str, db: Session):
    """Process statement in background: extract text from PDF."""
    try:
        # Query the statement to update status
        statement = db.query(Statement).filter(Statement.id == statement_id).first()
        if not statement:
            return
        
        statement.status = "processing"
        db.commit()
        
        text = extract_text_from_pdf(filepath)
        statement.extracted_text = text
        statement.status = "completed"
        db.commit()
    except Exception as e:
        # Statement might already be deleted, skip error handling
        try:
            statement = db.query(Statement).filter(Statement.id == statement_id).first()
            if statement:
                statement.status = "failed"
                statement.error_message = str(e)
                db.commit()
        except Exception:
            pass


@router.post("/upload", response_model=StatementUploadResponse)
async def upload_statement(background_tasks: BackgroundTasks, file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    # Ensure upload directory exists
    os.makedirs(settings.upload_dir, exist_ok=True)
    
    statement_id = str(uuid.uuid4())
    filepath = os.path.join(settings.upload_dir, f"{statement_id}_{file.filename}")
    
    # Save file temporarily
    try:
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Initialize record in database
    try:
        statement = Statement(
            id=statement_id,
            filename=file.filename,
            filepath=filepath,
            status="pending",
        )
        db.add(statement)
        db.commit()
        db.refresh(statement)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to initialize statement: {str(e)}")
    
    # Process extraction in background
    background_tasks.add_task(process_statement, statement_id, filepath, db)
    
    return StatementUploadResponse(
        statement_id=statement.id,
        filename=statement.filename,
        status=statement.status,
        message="Upload successful, processing started."
    )


@router.get("/{statement_id}/status", response_model=StatementStatusResponse)
async def get_statement_status(statement_id: str, db: Session = Depends(get_db)):
    statement = get_statement_or_404(statement_id, db)
    return StatementStatusResponse(
        statement_id=statement.id,
        status=statement.status,
        filename=statement.filename,
        upload_time=statement.upload_time,
        error_message=statement.error_message
    )


@router.get("/{statement_id}", response_model=StatementContentResponse)
async def get_statement(statement_id: str, db: Session = Depends(get_db)):
    statement = get_statement_or_404(statement_id, db)
    if statement.status != "completed":
        raise HTTPException(
            status_code=400,
            detail=f"Statement processing is not complete. Current status: {statement.status}"
        )
    
    return StatementContentResponse(
        statement_id=statement.id,
        filename=statement.filename,
        extracted_text=statement.extracted_text
    )


@router.post("/{statement_id}/analyze", response_model=AnalyzeResponse)
async def analyze_statement(
    statement_id: str,
    background_tasks: BackgroundTasks,
    options: AnalyzeRequest = AnalyzeRequest(),
    db: Session = Depends(get_db)
):
    """
    Analyze a statement using LLM to extract transactions, classify categories, etc.
    """
    statement = get_statement_or_404(statement_id, db)
    if statement.status != "completed":
        raise HTTPException(
            status_code=400,
            detail=f"Statement must be processed before analysis. Current status: {statement.status}"
        )

    # Get LLM service
    llm = get_llm_service()

    # Extract transactions
    extracted_text = statement.extracted_text
    transactions = llm.extract_transactions(extracted_text)

    # Process each transaction
    processed_transactions = []
    for txn in transactions:
        # Add ID
        txn_id = str(uuid.uuid4())
        txn["id"] = txn_id
        txn["statement_id"] = statement_id

        # Classify category if requested
        if options.classify_categories:
            category = llm.classify_category(
                txn.get("description", ""),
                txn.get("amount", 0)
            )
            txn["category"] = category

        # Normalize merchant if requested
        if options.normalize_merchants:
            normalized = llm.normalize_merchant(txn.get("description", ""))
            txn["normalized_merchant"] = normalized

        processed_transactions.append(txn)

    # Store transactions in the database
    try:
        for txn in processed_transactions:
            db_txn = Transaction(
                id=txn["id"],
                statement_id=statement_id,
                transaction_date=datetime.strptime(txn["date"], "%Y-%m-%d").date() if "date" in txn else datetime.utcnow().date(),
                description=txn.get("description", ""),
                amount=txn.get("amount", 0),
                normalized_merchant=txn.get("normalized_merchant"),
                category=txn.get("category"),
            )
            db.add(db_txn)
        
        # Mark statement as analyzed
        statement.analysis_complete = True
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save transactions: {str(e)}")

    return AnalyzeResponse(
        statement_id=statement_id,
        status="completed",
        transactions_found=len(processed_transactions),
        message=f"Successfully extracted and analyzed {len(processed_transactions)} transactions."
    )


@router.get("/{statement_id}/transactions", response_model=List[TransactionResponse])
async def get_transactions(statement_id: str, db: Session = Depends(get_db)):
    """
    Get all transactions for a statement.
    """
    statement = get_statement_or_404(statement_id, db)
    
    if not statement.analysis_complete:
        raise HTTPException(
            status_code=400,
            detail="Statement has not been analyzed yet. Call /analyze endpoint first."
        )
    
    transactions = db.query(Transaction).filter(Transaction.statement_id == statement_id).all()
    return transactions


@router.get("/{statement_id}/insights", response_model=InsightResponse)
async def get_insights(statement_id: str, db: Session = Depends(get_db)):
    """
    Generate financial insights for a statement's transactions.
    """
    statement = get_statement_or_404(statement_id, db)
    
    if not statement.analysis_complete:
        raise HTTPException(
            status_code=400,
            detail="Statement has not been analyzed yet. Call /analyze endpoint first."
        )
    
    transactions = db.query(Transaction).filter(Transaction.statement_id == statement_id).all()
    if not transactions:
        raise HTTPException(
            status_code=404,
            detail="No transactions found in this statement."
        )

    # Calculate statistics
    total_spent = sum(t.amount for t in transactions if t.amount < 0)
    total_income = sum(t.amount for t in transactions if t.amount > 0)

    # Get top categories
    categories = {}
    for t in transactions:
        cat = t.category or "Other"
        amount = abs(t.amount)
        categories[cat] = categories.get(cat, 0) + amount

    # Sort and get top 5
    top_categories = dict(sorted(categories.items(), key=lambda x: x[1], reverse=True)[:5])

    # Generate insights using LLM
    llm = get_llm_service()
    insights = llm.generate_insights(transactions)

    return InsightResponse(
        statement_id=statement_id,
        insights=insights,
        total_spent=abs(total_spent),
        total_income=total_income,
        top_categories=top_categories,
        transaction_count=len(transactions)
    )