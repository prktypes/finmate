"""
Test configuration and fixtures for FinPilot backend tests.
"""

import pytest
import os
import sys
from typing import Generator

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.db.base import Base, engine


@pytest.fixture(scope="session")
def test_app():
    """Fixture to provide FastAPI test client."""
    return TestClient(app)


@pytest.fixture(scope="function")
def sample_pdf_path():
    """Fixture to provide path to a sample PDF for testing."""
    # Create a minimal test PDF file
    test_pdf = os.path.join(os.path.dirname(__file__), "sample_statement.pdf")

    # For now, return the path - actual PDF creation can be added later
    return test_pdf


@pytest.fixture(scope="function")
def sample_statement_text():
    """Fixture to provide sample bank statement text for testing."""
    return """
    Bank Statement
    Account: 1234567890
    Period: January 1, 2024 - January 31, 2024

    Date        Description                 Amount      Balance
    01/05/2024  Amazon.com                  -49.99      1250.50
    01/10/2024  Starbucks #1234            -5.50       1245.00
    01/15/2024  Salary Deposit             +3000.00    4245.00
    01/20/2024  Walmart Supercenter        -125.30     4119.70
    01/25/2024  Netflix Subscription       -15.99      4103.71
    """


@pytest.fixture(scope="function")
def sample_transactions():
    """Fixture to provide sample transaction data."""
    return [
        {
            "date": "2024-01-05",
            "description": "Amazon.com",
            "amount": -49.99,
            "balance": 1250.50
        },
        {
            "date": "2024-01-10",
            "description": "Starbucks #1234",
            "amount": -5.50,
            "balance": 1245.00
        },
        {
            "date": "2024-01-15",
            "description": "Salary Deposit",
            "amount": 3000.00,
            "balance": 4245.00
        },
        {
            "date": "2024-01-20",
            "description": "Walmart Supercenter",
            "amount": -125.30,
            "balance": 4119.70
        },
        {
            "date": "2024-01-25",
            "description": "Netflix Subscription",
            "amount": -15.99,
            "balance": 4103.71
        }
    ]


# Database test fixtures (for when database is available)
@pytest.fixture(scope="session")
def test_db():
    """Fixture to create test database tables."""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop all tables after tests
    Base.metadata.drop_all(bind=engine)
