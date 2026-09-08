from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class StatementUploadResponse(BaseModel):
    statement_id: str
    filename: str
    status: str
    message: str

class StatementStatusResponse(BaseModel):
    statement_id: str
    status: str
    filename: str
    upload_time: datetime
    error_message: Optional[str] = None

class StatementContentResponse(BaseModel):
    statement_id: str
    filename: str
    extracted_text: str
