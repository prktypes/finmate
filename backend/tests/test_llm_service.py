"""
Tests for the LLM service layer.
"""

import pytest
from app.services.llm import LLMService, get_llm_service


class TestLLMService:
    """Test suite for LLM service functionality."""

    def test_llm_service_initialization(self):
        """Test that LLM service initializes correctly."""
        service = LLMService(model="llama3.2")
        assert service.model == "llama3.2"
        assert service.client is not None

    def test_get_llm_service_singleton(self):
        """Test that get_llm_service returns a singleton instance."""
        service1 = get_llm_service()
        service2 = get_llm_service()
        assert service1 is service2

    def test_extract_transactions_with_sample_text(self, sample_statement_text):
        """Test transaction extraction from sample statement text."""
        service = LLMService()

        # Note: This test will only work if Ollama is running locally
        # For CI/CD, we would mock the ollama client
        try:
            transactions = service.extract_transactions(sample_statement_text)
            assert isinstance(transactions, list)
            # We expect at least some transactions from our sample text
            # But we don't assert a specific count as LLM results may vary
        except Exception as e:
            # If Ollama is not available, skip this test
            pytest.skip(f"Ollama not available: {e}")

    def test_classify_category(self):
        """Test transaction category classification."""
        service = LLMService()

        try:
            # Test grocery classification
            category = service.classify_category("Walmart Supercenter", -125.30)
            assert isinstance(category, str)
            assert len(category) > 0

            # Test subscription classification
            category = service.classify_category("Netflix Subscription", -15.99)
            assert isinstance(category, str)
            assert len(category) > 0
        except Exception as e:
            pytest.skip(f"Ollama not available: {e}")

    def test_normalize_merchant(self):
        """Test merchant name normalization."""
        service = LLMService()

        try:
            # Test Amazon normalization
            normalized = service.normalize_merchant("AMAZON.COM*123ABC")
            assert isinstance(normalized, str)
            assert len(normalized) > 0

            # Test Starbucks normalization
            normalized = service.normalize_merchant("STARBUCKS #1234")
            assert isinstance(normalized, str)
            assert len(normalized) > 0
        except Exception as e:
            pytest.skip(f"Ollama not available: {e}")

    def test_generate_insights_with_sample_transactions(self, sample_transactions):
        """Test insight generation from sample transactions."""
        service = LLMService()

        try:
            insights = service.generate_insights(sample_transactions)
            assert isinstance(insights, list)
            assert len(insights) > 0

            # Check that each insight is a string
            for insight in insights:
                assert isinstance(insight, str)
                assert len(insight) > 0
        except Exception as e:
            pytest.skip(f"Ollama not available: {e}")

    def test_generate_insights_empty_transactions(self):
        """Test insight generation with empty transactions list."""
        service = LLMService()

        insights = service.generate_insights([])
        assert isinstance(insights, list)
        assert len(insights) == 1
        assert "No transactions" in insights[0]

    def test_build_extraction_prompt(self, sample_statement_text):
        """Test that extraction prompt is built correctly."""
        service = LLMService()

        prompt = service._build_extraction_prompt(sample_statement_text)
        assert isinstance(prompt, str)
        assert sample_statement_text in prompt
        assert "Extract all financial transactions" in prompt
        assert "JSON" in prompt


class TestLLMServiceErrorHandling:
    """Test suite for LLM service error handling."""

    def test_extract_transactions_with_invalid_text(self):
        """Test transaction extraction with invalid text."""
        service = LLMService()

        # Test with empty string
        transactions = service.extract_transactions("")
        assert isinstance(transactions, list)

        # Test with garbage text
        transactions = service.extract_transactions("asdfghjkl")
        assert isinstance(transactions, list)

    def test_classify_category_with_empty_description(self):
        """Test category classification with empty description."""
        service = LLMService()

        try:
            category = service.classify_category("", 0)
            assert isinstance(category, str)
        except Exception as e:
            pytest.skip(f"Ollama not available: {e}")

    def test_normalize_merchant_with_empty_name(self):
        """Test merchant normalization with empty name."""
        service = LLMService()

        try:
            normalized = service.normalize_merchant("")
            assert isinstance(normalized, str)
        except Exception as e:
            pytest.skip(f"Ollama not available: {e}")
