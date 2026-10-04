"""
Tests for the statements API endpoints.
"""

import pytest
import json
import os
import tempfile
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


class TestStatementsAPI:
    """Test suite for statements API endpoints."""

    def test_root_endpoint(self):
        """Test the root endpoint returns correct information."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["message"] == "FinMate API"
        assert "version" in data
        assert "environment" in data

    def test_health_endpoint(self):
        """Test the health endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    def test_upload_statement_no_file(self):
        """Test upload endpoint with no file provided."""
        response = client.post("/statements/upload")
        assert response.status_code == 422  # Unprocessable Entity

    def test_upload_statement_invalid_file_type(self):
        """Test upload endpoint with non-PDF file."""
        # Create a temporary text file
        with tempfile.NamedTemporaryFile(suffix=".txt", delete=False) as tmp:
            tmp.write(b"This is not a PDF file")
            tmp_path = tmp.name

        try:
            with open(tmp_path, "rb") as f:
                response = client.post(
                    "/statements/upload",
                    files={"file": ("test.txt", f, "text/plain")}
                )

            # Should reject non-PDF files
            assert response.status_code == 400
            data = response.json()
            assert "detail" in data
            assert "Only PDF files are supported" in data["detail"]
        finally:
            os.unlink(tmp_path)

    def test_get_nonexistent_statement(self):
        """Test getting a statement that doesn't exist."""
        response = client.get("/statements/00000000-0000-0000-0000-000000000000")
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
        assert "Statement not found" in data["detail"]

    def test_get_statement_status_nonexistent(self):
        """Test getting status of a statement that doesn't exist."""
        response = client.get("/statements/00000000-0000-0000-0000-000000000000/status")
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
        assert "Statement not found" in data["detail"]


class TestStatementsAPIWithMockData:
    """Test suite for statements API with mock data."""

    def setup_method(self):
        """Setup test data before each test."""
        # Clear the in-memory database
        from app.api.statements import statement_db
        statement_db.clear()

    def test_upload_and_get_statement_flow(self):
        """Test the complete flow of uploading and retrieving a statement."""
        # Create a mock PDF file
        pdf_content = b"%PDF-1.4\n%Test PDF content\n%%EOF"

        response = client.post(
            "/statements/upload",
            files={"file": ("test_statement.pdf", pdf_content, "application/pdf")}
        )

        assert response.status_code == 200
        data = response.json()
        assert "statement_id" in data
        assert data["filename"] == "test_statement.pdf"
        assert data["status"] == "pending"
        statement_id = data["statement_id"]

        # Check status endpoint
        response = client.get(f"/statements/{statement_id}/status")
        assert response.status_code == 200
        status_data = response.json()
        assert status_data["statement_id"] == statement_id
        assert status_data["filename"] == "test_statement.pdf"
        assert status_data["status"] == "pending"

        # Get statement (should be pending, not completed yet)
        response = client.get(f"/statements/{statement_id}")
        assert response.status_code == 200
        statement_data = response.json()
        assert statement_data["statement_id"] == statement_id
        assert statement_data["filename"] == "test_statement.pdf"
        assert statement_data["status"] == "pending"

    def test_analyze_statement_not_found(self):
        """Test analyzing a statement that doesn't exist."""
        response = client.post(
            "/statements/00000000-0000-0000-0000-000000000000/analyze",
            json={}
        )
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
        assert "Statement not found" in data["detail"]

    def test_get_transactions_not_analyzed(self):
        """Test getting transactions for a statement that hasn't been analyzed."""
        # First upload a statement
        pdf_content = b"%PDF-1.4\n%Test PDF content\n%%EOF"
        response = client.post(
            "/statements/upload",
            files={"file": ("test_statement.pdf", pdf_content, "application/pdf")}
        )
        assert response.status_code == 200
        data = response.json()
        statement_id = data["statement_id"]

        # Try to get transactions before analysis
        response = client.get(f"/statements/{statement_id}/transactions")
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
        assert "Statement has not been analyzed yet" in data["detail"]

    def test_get_insights_not_analyzed(self):
        """Test getting insights for a statement that hasn't been analyzed."""
        # First upload a statement
        pdf_content = b"%PDF-1.4\n%Test PDF content\n%%EOF"
        response = client.post(
            "/statements/upload",
            files={"file": ("test_statement.pdf", pdf_content, "application/pdf")}
        )
        assert response.status_code == 200
        data = response.json()
        statement_id = data["statement_id"]

        # Try to get insights before analysis
        response = client.get(f"/statements/{statement_id}/insights")
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
        assert "Statement has not been analyzed yet" in data["detail"]
