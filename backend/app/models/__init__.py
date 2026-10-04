"""
SQLAlchemy models for financial data storage.
"""

from sqlalchemy import Column, String, DateTime, Date, Float, Text, ForeignKey, Integer, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
import uuid


class Statement(Base):
    """Statement model representing a bank statement."""
    __tablename__ = "statements"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    filename = Column(String, nullable=False)
    upload_time = Column(DateTime(timezone=True), server_default=func.now())
    processing_status = Column(String, default="pending")  # pending, processing, completed, failed
    extracted_text = Column(Text, nullable=True)
    error_message = Column(Text, nullable=True)

    # Relationships
    transactions = relationship("Transaction", back_populates="statement", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Statement(id={self.id}, filename='{self.filename}')>"


class Category(Base):
    """Category model for transaction categorization."""
    __tablename__ = "categories"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, nullable=False)  # e.g., "Groceries", "Transport"
    description = Column(Text, nullable=True)
    color = Column(String, default="#6B7280")  # Default gray color
    is_active = Column(Boolean, default=True)

    # Relationships
    transactions = relationship("Transaction", back_populates="category")

    def __repr__(self):
        return f"<Category(id={self.id}, name='{self.name}')>"


class Merchant(Base):
    """Merchant model for normalized merchant names."""
    __tablename__ = "merchants"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, nullable=False)  # Normalized name (e.g., "Amazon")
    raw_name_variants = Column(Text, nullable=True)  # JSON array of variants seen
    category_id = Column(String, ForeignKey("categories.id"), nullable=True)

    # Relationships
    category = relationship("Category")
    transactions = relationship("Transaction", back_populates="merchant")

    def __repr__(self):
        return f"<Merchant(id={self.id}, name='{self.name}')>"


class Transaction(Base):
    """Transaction model representing a financial transaction."""
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    statement_id = Column(String, ForeignKey("statements.id"), nullable=False)
    transaction_date = Column(Date, nullable=False)
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)  # Negative for debits, positive for credits
    balance_after = Column(Float, nullable=True)

    # Normalized fields
    normalized_merchant = Column(String, nullable=True)
    category_id = Column(String, ForeignKey("categories.id"), nullable=True)
    merchant_id = Column(String, ForeignKey("merchants.id"), nullable=True)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    statement = relationship("Statement", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")
    merchant = relationship("Merchant", back_populates="transactions")

    def __repr__(self):
        return f"<Transaction(id={self.id}, date={self.transaction_date}, amount={self.amount})>"
