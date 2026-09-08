from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from typing import Dict
import shutil
import os
import uuid
from datetime import datetime

from app.schemas.statements import StatementUploadResponse, StatementStatusResponse, StatementContentResponse
from app.core.config import settings
from app.documents.extraction import extract_text_from_pdf

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
