"""
Pydantic schemas for transaction-related API endpoints.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date as date_type


class TransactionBase(BaseModel):
    """Base transaction schema."""
    date: date_type = Field(..., description="Transaction date")
    description: str = Field(..., description="Transaction description/merchant")
    amount: float = Field(..., description="Transaction amount (negative for debits)")
    balance: Optional[float] = Field(None, description="Account balance after transaction")
    category: Optional[str] = Field(None, description="Transaction category")
    normalized_merchant: Optional[str] = Field(None, description="Normalized merchant name")


class TransactionCreate(TransactionBase):
    """Schema for creating a new transaction."""
    statement_id: str = Field(..., description="ID of the parent statement")


class TransactionResponse(TransactionBase):
    """Schema for transaction API responses."""
    id: str = Field(..., description="Unique transaction ID")
    statement_id: str = Field(..., description="ID of the parent statement")

    class Config:
        from_attributes = True


class AnalyzeRequest(BaseModel):
    """Request schema for statement analysis."""
    extract_transactions: bool = Field(True, description="Extract transactions from statement")
    classify_categories: bool = Field(True, description="Classify transaction categories")
    normalize_merchants: bool = Field(True, description="Normalize merchant names")


class AnalyzeResponse(BaseModel):
    """Response schema for statement analysis."""
    statement_id: str = Field(..., description="ID of the analyzed statement")
    status: str = Field(..., description="Analysis status")
    transactions_found: int = Field(..., description="Number of transactions extracted")
    message: Optional[str] = Field(None, description="Additional message")


class InsightResponse(BaseModel):
    """Schema for financial insights."""
    statement_id: str = Field(..., description="ID of the analyzed statement")
    insights: List[str] = Field(..., description="List of financial insights")
    total_spent: float = Field(..., description="Total amount spent")
    total_income: float = Field(..., description="Total income")
    top_categories: dict = Field(..., description="Spending by top categories")
    transaction_count: int = Field(..., description="Total number of transactions")
