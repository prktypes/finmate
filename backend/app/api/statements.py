from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from typing import Dict, List
import shutil
import os
import uuid
from datetime import datetime

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

router = APIRouter(prefix="/statements", tags=["statements"])

# In-memory storage for phase 1 before PostgreSQL
statement_db: Dict[str, dict] = {}

def process_statement(statement_id: str, filepath: str):
    try:
        statement_db[statement_id]["status"] = "processing"
        text = extract_text_from_pdf(filepath)
        statement_db[statement_id]["extracted_text"] = text
        statement_db[statement_id]["status"] = "completed"
    except Exception as e:
        statement_db[statement_id]["status"] = "failed"
        statement_db[statement_id]["error_message"] = str(e)

@router.post("/upload", response_model=StatementUploadResponse)
async def upload_statement(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
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
        
    # Initialize record
    statement_db[statement_id] = {
        "statement_id": statement_id,
        "filename": file.filename,
        "filepath": filepath,
        "status": "pending",
        "upload_time": datetime.utcnow(),
        "extracted_text": "",
        "error_message": None
    }
    
    # Process extraction in background
    background_tasks.add_task(process_statement, statement_id, filepath)
    
    return StatementUploadResponse(
        statement_id=statement_id,
        filename=file.filename,
        status="pending",
        message="Upload successful, processing started."
    )

@router.get("/{statement_id}/status", response_model=StatementStatusResponse)
async def get_statement_status(statement_id: str):
    if statement_id not in statement_db:
        raise HTTPException(status_code=404, detail="Statement not found.")
        
    record = statement_db[statement_id]
    return StatementStatusResponse(
        statement_id=record["statement_id"],
        status=record["status"],
        filename=record["filename"],
        upload_time=record["upload_time"],
        error_message=record["error_message"]
    )

@router.get("/{statement_id}", response_model=StatementContentResponse)
async def get_statement(statement_id: str):
    if statement_id not in statement_db:
        raise HTTPException(status_code=404, detail="Statement not found.")

    record = statement_db[statement_id]
    if record["status"] != "completed":
        raise HTTPException(status_code=400, detail=f"Statement processing is not complete. Current status: {record['status']}")

    return StatementContentResponse(
        statement_id=record["statement_id"],
        filename=record["filename"],
        extracted_text=record["extracted_text"]
    )


@router.post("/{statement_id}/analyze", response_model=AnalyzeResponse)
async def analyze_statement(
    statement_id: str,
    background_tasks: BackgroundTasks,
    options: AnalyzeRequest = AnalyzeRequest()
):
    """
    Analyze a statement using LLM to extract transactions, classify categories, etc.
    """
    if statement_id not in statement_db:
        raise HTTPException(status_code=404, detail="Statement not found.")

    record = statement_db[statement_id]
    if record["status"] != "completed":
        raise HTTPException(
            status_code=400,
            detail=f"Statement must be processed before analysis. Current status: {record['status']}"
        )

    # Get LLM service
    llm = get_llm_service()

    # Extract transactions
    extracted_text = record["extracted_text"]
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

    # Store transactions in the record
    record["transactions"] = processed_transactions
    record["analysis_complete"] = True

    return AnalyzeResponse(
        statement_id=statement_id,
        status="completed",
        transactions_found=len(processed_transactions),
        message=f"Successfully extracted and analyzed {len(processed_transactions)} transactions."
    )


@router.get("/{statement_id}/transactions", response_model=List[TransactionResponse])
async def get_transactions(statement_id: str):
    """
    Get all transactions for a statement.
    """
    if statement_id not in statement_db:
        raise HTTPException(status_code=404, detail="Statement not found.")

    record = statement_db[statement_id]
    if not record.get("analysis_complete"):
        raise HTTPException(
            status_code=400,
            detail="Statement has not been analyzed yet. Call /analyze endpoint first."
        )

    transactions = record.get("transactions", [])
    return transactions


@router.get("/{statement_id}/insights", response_model=InsightResponse)
async def get_insights(statement_id: str):
    """
    Generate financial insights for a statement's transactions.
    """
    if statement_id not in statement_db:
        raise HTTPException(status_code=404, detail="Statement not found.")

    record = statement_db[statement_id]
    if not record.get("analysis_complete"):
        raise HTTPException(
            status_code=400,
            detail="Statement has not been analyzed yet. Call /analyze endpoint first."
        )

    transactions = record.get("transactions", [])
    if not transactions:
        raise HTTPException(
            status_code=404,
            detail="No transactions found in this statement."
        )

    # Calculate statistics
    total_spent = sum(t.get("amount", 0) for t in transactions if t.get("amount", 0) < 0)
    total_income = sum(t.get("amount", 0) for t in transactions if t.get("amount", 0) > 0)

    # Get top categories
    categories = {}
    for t in transactions:
        cat = t.get("category", "Other")
        amount = abs(t.get("amount", 0))
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
