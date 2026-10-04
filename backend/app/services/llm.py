"""
LLM Service for transaction extraction and analysis using Ollama.

This service handles all LLM interactions for:
- Transaction extraction from bank statement text
- Category classification
- Merchant normalization
- Financial insights generation
"""

import ollama
from typing import List, Dict, Any, Optional
import json
import logging

logger = logging.getLogger(__name__)


class LLMService:
    """Service for interacting with local LLM via Ollama."""

    def __init__(self, model: str = "llama3.2"):
        """
        Initialize LLM service.

        Args:
            model: Ollama model name (default: llama3.2)
        """
        self.model = model
        self.client = ollama.Client()

    def extract_transactions(self, statement_text: str) -> List[Dict[str, Any]]:
        """
        Extract structured transactions from bank statement text.

        Args:
            statement_text: Raw text extracted from bank statement PDF

        Returns:
            List of transaction dictionaries with date, description, amount, etc.
        """
        prompt = self._build_extraction_prompt(statement_text)

        try:
            response = self.client.generate(
                model=self.model,
                prompt=prompt,
                format="json"
            )

            # Parse the JSON response
            result = json.loads(response['response'])
            transactions = result.get('transactions', [])

            logger.info(f"Extracted {len(transactions)} transactions")
            return transactions

        except Exception as e:
            logger.error(f"Error extracting transactions: {e}")
            return []

    def classify_category(self, description: str, amount: float) -> str:
        """
        Classify a transaction into a spending category.

        Args:
            description: Transaction description/merchant name
            amount: Transaction amount

        Returns:
            Category name (e.g., "Groceries", "Entertainment", "Transport")
        """
        prompt = f"""Classify this transaction into one category.

Transaction: {description}
Amount: ${abs(amount):.2f}

Choose ONE category from:
- Groceries
- Dining & Restaurants
- Entertainment
- Transport
- Shopping
- Bills & Utilities
- Healthcare
- Travel
- Education
- Income
- Transfer
- Other

Return ONLY the category name, nothing else."""

        try:
            response = self.client.generate(
                model=self.model,
                prompt=prompt
            )

            category = response['response'].strip()
            logger.info(f"Classified '{description}' as '{category}'")
            return category

        except Exception as e:
            logger.error(f"Error classifying category: {e}")
            return "Other"

    def normalize_merchant(self, merchant_name: str) -> str:
        """
        Normalize merchant names to a canonical form.

        Examples:
        - "AMAZON.COM*123ABC" -> "Amazon"
        - "STARBUCKS #1234" -> "Starbucks"
        - "WAL-MART SUPER" -> "Walmart"

        Args:
            merchant_name: Raw merchant name from statement

        Returns:
            Normalized merchant name
        """
        prompt = f"""Normalize this merchant name to its clean, canonical form.

Raw merchant name: {merchant_name}

Rules:
- Remove transaction IDs, store numbers, and reference codes
- Fix common abbreviations (e.g., "WAL-MART" -> "Walmart")
- Use proper capitalization
- Keep it concise (1-3 words max)

Return ONLY the normalized merchant name, nothing else."""

        try:
            response = self.client.generate(
                model=self.model,
                prompt=prompt
            )

            normalized = response['response'].strip()
            logger.info(f"Normalized '{merchant_name}' to '{normalized}'")
            return normalized

        except Exception as e:
            logger.error(f"Error normalizing merchant: {e}")
            return merchant_name

    def generate_insights(self, transactions: List[Dict[str, Any]]) -> List[str]:
        """
        Generate financial insights from a list of transactions.

        Args:
            transactions: List of transaction dictionaries

        Returns:
            List of insight strings
        """
        if not transactions:
            return ["No transactions to analyze."]

        # Prepare transaction summary for LLM
        total_spent = sum(t.get('amount', 0) for t in transactions if t.get('amount', 0) < 0)
        total_income = sum(t.get('amount', 0) for t in transactions if t.get('amount', 0) > 0)

        # Get category breakdown
        categories = {}
        for t in transactions:
            cat = t.get('category', 'Other')
            categories[cat] = categories.get(cat, 0) + abs(t.get('amount', 0))

        prompt = f"""Analyze these financial transactions and provide 3-5 actionable insights.

Summary:
- Total spent: ${abs(total_spent):.2f}
- Total income: ${total_income:.2f}
- Number of transactions: {len(transactions)}

Spending by category:
{json.dumps(categories, indent=2)}

Provide insights about:
1. Spending patterns
2. Potential savings opportunities
3. Unusual or noteworthy transactions
4. Budget recommendations

Return a JSON array of insight strings."""

        try:
            response = self.client.generate(
                model=self.model,
                prompt=prompt,
                format="json"
            )

            result = json.loads(response['response'])
            insights = result.get('insights', [])

            logger.info(f"Generated {len(insights)} insights")
            return insights

        except Exception as e:
            logger.error(f"Error generating insights: {e}")
            return ["Unable to generate insights at this time."]

    def _build_extraction_prompt(self, statement_text: str) -> str:
        """
        Build the prompt for transaction extraction.

        Args:
            statement_text: Raw statement text

        Returns:
            Formatted prompt string
        """
        return f"""Extract all financial transactions from this bank statement text.

Bank Statement Text:
{statement_text}

Extract each transaction with:
- date: Transaction date (YYYY-MM-DD format)
- description: Transaction description/merchant
- amount: Amount (negative for debits, positive for credits)
- balance: Account balance after transaction (if available)

Return a JSON object with a "transactions" array:
{{
  "transactions": [
    {{
      "date": "2024-01-15",
      "description": "Amazon.com",
      "amount": -49.99,
      "balance": 1250.50
    }}
  ]
}}

Focus on actual transactions, ignore headers, footers, and summary information.
If no transactions found, return: {{"transactions": []}}"""


# Singleton instance
_llm_service: Optional[LLMService] = None


def get_llm_service(model: str = "llama3.2") -> LLMService:
    """
    Get or create the LLM service singleton.

    Args:
        model: Ollama model name

    Returns:
        LLMService instance
    """
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService(model=model)
    return _llm_service
