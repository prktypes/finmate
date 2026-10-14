"""
Analytics service for financial data analysis.

Provides spending analysis, trend detection, recurring transaction identification,
anomaly detection, and budget monitoring capabilities.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, date
from collections import defaultdict
import json


class SpendingAnalysis:
    """Analyze spending patterns from transaction data."""

    @staticmethod
    def calculate_category_totutions(transactions: List[Dict[str, Any]]) -> Dict[str, float]:
        """Calculate total spending by category."""
        totals = defaultdict(float)
        for txn in transactions:
            category = txn.get("category") or "Other"
            amount = abs(txn.get("amount", 0))
            totals[category] += amount
        return dict(totals)

    @staticmethod
    def calculate_monthly_averages(transactions: List[Dict[str, Any]]) -> Dict[str, float]:
        """Calculate average monthly spending."""
        if not transactions:
            return {}

        # Group by month
        monthly = defaultdict(list)
        for txn in transactions:
            try:
                tx_date = txn.get("transaction_date") or txn.get("date")
                if tx_date:
                    # Parse date string Y-MM-DD or Y-MM
                    date_part = str(tx_date)
                    year_month = date_part[:7]  # Y-MM
                    monthly[year_month].append(abs(txn.get("amount", 0)))
            except (ValueError, TypeError):
                continue

        # Calculate averages
        averages = {}
        for month, amounts in monthly.items():
            averages[month] = sum(amounts) / len(amounts)

        return averages

    @staticmethod
    def detect_recurring_transcriptions(transactions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Detect potentially recurring transactions."""
        # Group by description (normalized)
        description_groups = defaultdict(list)
        for txn in transactions:
            desc = txn.get("description") or ""
            # Normalize: lowercase, remove special chars
            normalized = re.sub(r'[^\w\s]', '', desc.lower()).strip()
            description_groups[normalized].append(txn)

        # Find groups with multiple transactions
        recurring = []
        for desc, txns in description_groups.items():
            if len(txns) >= 2:
                amounts = [abs(txn.get("amount", 0)) for txn in txns]
                recurring.append({
                    "description": desc,
                    "frequency": len(txns),
                    "amounts": amounts,
                    "average_amount": sum(amounts) / len(amounts),
                    "categories": list(set(txn.get("category") or "Other" for txn in txns)),
                })

        # Sort by frequency (most frequent first)
        recurring.sort(key=lambda x: x["frequency"], reverse=True)

        return recurring[:10]  # Top 10 recurring

    @staticmethod
    def detect_anomalies(transactions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Detect unusual spending patterns (anomalies)."""
        if not transactions:
            return []

        amounts = [txn.get("amount", 0) for txn in transactions]
        if not amounts:
            return []

        # Calculate mean and standard deviation
        import statistics
        try:
            mean_amount = statistics.mean(amounts)
            if len(amounts) > 1:
                stdev = statistics.stdev(amounts)
            else:
                stdev = 0
        except statistics.StatisticsError:
            return []

        anomalies = []
        for txn in transactions:
            amount = txn.get("amount", 0)
            # Flag transactions that are more than 2 std devs from mean
            if stdev > 0 and abs(amount - mean_amount) > 2 * abs(stdev):
                anomalies.append({
                    "transaction_id": txn.get("id"),
                    "description": txn.get("description"),
                    "amount": amount,
                    "expected_range": {
                        "lower": mean_amount - 2 * stdev,
                        "upper": mean_amount + 2 * stdev,
                    },
                    "anomaly_type": "large_transaction" if amount > 0 else "unusual_credit",
                })

        # Sort by deviation magnitude
        anomalies.sort(key=lambda x: abs(x["amount"] - mean_amount), reverse=True)

        return anomalies

    @staticmethod
    def calculate_net_flow(transactions: List[Dict[str, Any]]) -> Dict[str, float]:
        """Calculate total spent vs received and net flow."""
        total_spent = sum(abs(txn.get("amount", 0)) for txn in transactions if txn.get("amount", 0) < 0)
        total_received = sum(txn.get("amount", 0) for txn in transactions if txn.get("amount", 0) > 0)
        net_flow = total_received - total_spent

        return {
            "total_spent": round(total_spent, 2),
            "total_received": round(total_received, 2),
            "net_flow": round(net_flow, 2),
        }


class BudgetMonitor:
    """Monitor budget adherence and provide alerts."""

    @staticmethod
    def check_budget_limits(
        transactions: List[Dict[str, Any]],
        budget_limits: Dict[str, float]
    ) -> Dict[str, Any]:
        """Check transactions against budget limits."""
        category_spending = defaultdict(float)

        for txn in transactions:
            category = txn.get("category") or "Other"
            amount = abs(txn.get("amount", 0))
            category_spending[category] += amount

        alerts = []
        for category, limit in budget_limits.items():
            spent = category_spending.get(category, 0)
            if spent >= limit * 0.8:  # Alert at 80% of budget
                percentage = (spent / limit) * 100 if limit > 0 else 0
                alerts.append({
                    "category": category,
                    "budget": limit,
                    "spent": round(spent, 2),
                    "percentage": round(percentage, 1),
                    "status": "warning" if percentage >= 90 else "info",
                })

        return {
            "category_spending": dict(category_spending),
            "budget_limits": budget_limits,
            "alerts": alerts,
            "over_budget": any(
                category_spending.get(c, 0) > limit
                for c, limit in budget_limits.items()
            ),
        }


class FinancialInsightsGenerator:
    """Generate financial insights from transaction data."""

    @staticmethod
    def generate_insights(transactions: List[Dict[str, Any]]) -> List[str]:
        """Generate human-readable financial insights."""
        if not transactions:
            return ["No transactions to analyze."]

        insights = []

        # Calculate basic stats
        analysis = SpendingAnalysis()
        totals = analysis.calculate_category_totutions(transactions)
        net_flow = analysis.calculate_net_flow(transactions)
        recurring = SpendingAnalysis.detect_recurring_transcriptions(transactions)
        anomalies = SpendingAnalysis.detect_anomalies(transactions)
        budget_check = BudgetMonitor.check_budget_limits(transactions, {})

        # Spending pattern insights
        if totals:
            top_category = max(totals, key=totals.get)
            top_amount = totals[top_category]
            total_spent = sum(totals.values())
            insights.append(
                f"You spent ${top_amount:.2f} on {top_category}, your highest spending category."
            )

        # Income/spending balance
        if net_flow["net_flow"] >= 0:
            insights.append(
                f"You have a positive cash flow of ${net_flow['net_flow']:.2f} this period."
            )
        else:
            insights.append(
                f"You're spending ${abs(net_flow['net_flow']):.2f} more than you're receiving."
            )

        # Recurring transactions
        if recurring:
            desc = recurring[0]["description"]
            freq = recurring[0]["frequency"]
            avg_amount = recurring[0]["average_amount"]
            insights.append(
                f"You have {freq} recurring transaction(s) for {desc}, averaging ${avg_amount:.2f} each."
            )

        # Anomalies
        if anomalies:
            anomaly = anomalies[0]
            insights.append(
                f"Unusual transaction detected: ${abs(anomaly['amount']):.2f} - "
                f"{anomaly['anomaly_type']}"
            )

        # Budget warnings
        if budget_check.get("alerts"):
            alert = budget_check["alerts"][0]
            insights.append(
                f"You've spent ${alert['spent']:.2f} of ${alert['budget']:.2f} on {alert['category']} "
                f"({alert['percentage']}%)."
            )

        # Ensure we have at least 3 insights
        while len(insights) < 3:
            insights.append("Continue monitoring your spending patterns for more insights.")

        return insights[:5]  # Return max 5 insights</think>