#!/usr/bin/env python3
"""
Test script to verify LLM service with phi3:mini model
"""

import sys
import os

# Add the current directory to the path so we can import the LLM service
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.services.llm import LLMService

def test_llm_service():
    """Test the LLM service with phi3:mini model"""
    print("Testing LLM service with phi3:mini model...")

    # Initialize the service with phi3:mini
    llm_service = LLMService(model="phi3:mini")

    # Test classification
    print("\n1. Testing category classification:")
    test_desc = "AMAZON MARKETPLACE"
    test_amount = -25.99
    category = llm_service.classify_category(test_desc, test_amount)
    print(f"   Description: {test_desc}")
    print(f"   Amount: {test_amount}")
    print(f"   Category: {category}")

    # Test merchant normalization
    print("\n2. Testing merchant normalization:")
    test_merchant = "AMAZON.COM*AB12CD34EF"
    normalized = llm_service.normalize_merchant(test_merchant)
    print(f"   Raw merchant: {test_merchant}")
    print(f"   Normalized: {normalized}")

    # Test transaction extraction with sample statement text
    print("\n3. Testing transaction extraction:")
    sample_statement = """
    BANK STATEMENT
    Account: XXXX1234
    Period: Jan 1-31, 2024

    Date       Description                        Amount     Balance
    2024-01-15 AMAZON.COM*AB12CD                  -25.99     1,474.01
    2024-01-16 PAYCHECK DEPOSIT                   +1,200.00  2,674.01
    2024-01-18 STARBUCKS STORE #1234              -5.75      2,668.26
    2024-01-20 GROCERY STORE                      -42.50     2,625.76
    """

    try:
        transactions = llm_service.extract_transactions(sample_statement)
        print(f"   Found {len(transactions)} transactions:")
        for i, tx in enumerate(transactions, 1):
            print(f"     {i}. Date: {tx.get('date')}, Description: {tx.get('description')}, Amount: {tx.get('amount')}")
    except Exception as e:
        print(f"   Error extracting transactions: {e}")

    print("\n✓ LLM service test completed successfully!")

if __name__ == "__main__":
    test_llm_service()