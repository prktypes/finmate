#!/usr/bin/env python3
"""
Test script for financial transaction extraction with phi3:mini model
"""

import sys
import os

# Add the backend directory to the path so we can import the LLM service
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.services.llm import LLMService

def test_financial_extraction():
    """Test financial transaction extraction with realistic bank statement"""
    print("Testing financial transaction extraction with phi3:mini model...")

    # Initialize the service with phi3:mini
    llm_service = LLMService(model="phi3:mini")

    # Test with a more realistic bank statement
    bank_statement = """
    CHASE BANK
    ACCOUNT SUMMARY
    Account Ending: 1234
    Statement Period: 01/01/2024 - 01/31/2024

    TRANSACTION DETAILS
    01/02/2024  AMAZON MARKETPLACE              $45.67       $1,254.33
    01/03/2024  STARBUCKS STORE #2456            $8.50       $1,245.83
    01/05/2024  PAYCHECK DEPOSIT                $2,500.00    $3,745.83
    01/07/2024  SHELL OIL                       $50.00       $3,695.83
    01/10/2024  WHOLE FOODS MARKET              $78.90       $3,616.93
    01/12/2024  NETFLIX.COM                     $15.99       $3,600.94
    01/15/2024  AT&T WIRELESS                   $85.00       $3,515.94
    01/18/2024  EXXONMOBIL                      $60.00       $3,455.94
    01/20/2024  WALMART SUPERCENTER             $120.50      $3,335.44
    01/22/2024  INTEREST PAID                   $2.35        $3,337.79
    01/25/2024  ELECTRIC COMPANY                $110.25      $3,227.54
    01/28/2024  TRANSFER TO SAVINGS             $500.00      $2,727.54
    """

    print("\n1. Testing transaction extraction from bank statement:")
    try:
        transactions = llm_service.extract_transactions(bank_statement)
        print(f"   Found {len(transactions)} transactions:")
        for i, tx in enumerate(transactions, 1):
            print(f"     {i}. Date: {tx.get('date')}, Description: {tx.get('description')}, Amount: {tx.get('amount')}")

        # Verify we got the expected number of transactions
        expected_count = 11  # We expect 11 transactions from the statement above
        if len(transactions) == expected_count:
            print(f"   ✓ Correctly extracted {expected_count} transactions")
        else:
            print(f"   ⚠ Expected {expected_count} transactions, got {len(transactions)}")

    except Exception as e:
        print(f"   Error extracting transactions: {e}")
        return False

    # Test category classification for a few transactions
    print("\n2. Testing category classification:")
    test_cases = [
        ("AMAZON MARKETPLACE", -45.67, "Shopping"),
        ("STARBUCKS STORE #2456", -8.50, "Dining & Restaurants"),
        ("PAYCHECK DEPOSIT", 2500.00, "Income"),
        ("SHELL OIL", -50.00, "Transport"),
        ("WHOLE FOODS MARKET", -78.90, "Groceries"),
        ("NETFLIX.COM", -15.99, "Entertainment"),
        ("AT&T WIRELESS", -85.00, "Bills & Utilities"),
        ("EXXONMOBIL", -60.00, "Transport"),
        ("WALMART SUPERCENTER", -120.50, "Shopping"),
        ("INTEREST PAID", 2.35, "Income"),
        ("ELECTRIC COMPANY", -110.25, "Bills & Utilities"),
    ]

    correct_classifications = 0
    for desc, amount, expected_category in test_cases:
        try:
            category = llm_service.classify_category(desc, amount)
            status = "✓" if category == expected_category else "⚠"
            print(f"     {status} {desc}: Expected '{expected_category}', Got '{category}'")
            if category == expected_category:
                correct_classifications += 1
        except Exception as e:
            print(f"     ✗ {desc}: Error - {e}")

    print(f"   Classification accuracy: {correct_classifications}/{len(test_cases)} ({correct_classifications/len(test_cases)*100:.1f}%)")

    # Test merchant normalization
    print("\n3. Testing merchant normalization:")
    normalization_tests = [
        ("AMAZON MARKETPLACE", "Amazon"),
        ("STARBUCKS STORE #2456", "Starbucks"),
        ("SHELL OIL", "Shell"),
        ("WHOLE FOODS MARKET", "Whole Foods"),
        ("NETFLIX.COM", "Netflix"),
        ("AT&T WIRELESS", "AT&T"),
        ("EXXONMOBIL", "ExxonMobil"),
        ("WALMART SUPERCENTER", "Walmart"),
        ("ELECTRIC COMPANY", "Electric Company"),
    ]

    correct_normalizations = 0
    for raw, expected in normalization_tests:
        try:
            normalized = llm_service.normalize_merchant(raw)
            status = "✓" if normalized == expected else "⚠"
            print(f"     {status} '{raw}' -> Expected: '{expected}', Got: '{normalized}'")
            if normalized == expected:
                correct_normalizations += 1
        except Exception as e:
            print(f"     ✗ '{raw}': Error - {e}")

    print(f"   Normalization accuracy: {correct_normalizations}/{len(normalization_tests)} ({correct_normalizations/len(normalization_tests)*100:.1f}%)")

    print("\n✓ Financial extraction test completed!")
    return True

if __name__ == "__main__":
    success = test_financial_extraction()
    sys.exit(0 if success else 1)