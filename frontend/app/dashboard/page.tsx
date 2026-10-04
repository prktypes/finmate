'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import StatementList from '@/app/components/dashboard/StatementList';
import StatCard from '@/app/components/dashboard/StatCard';
import SpendingPieChart from '@/app/components/charts/SpendingPieChart';
import SpendingLineChart from '@/app/components/charts/SpendingLineChart';
import MerchantBarChart from '@/app/components/charts/MerchantBarChart';
import InsightsList from '@/app/components/insights/InsightsList';
import AnomalyAlert from '@/app/components/insights/AnomalyAlert';
import { formatCurrency, formatDate } from '@/lib/utils';
import { FileText, TrendingUp, Banknote, ArrowRight, ShieldCheck } from 'lucide-react';

export default function DashboardPage() {
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatement, setSelectedStatement] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [transactions, setTransactions] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch statements
      const stmtResponse = await fetch('http://localhost:8000/api/statements');
      if (!stmtResponse.ok) throw new Error('Failed to fetch statements');
      const stmtData = await stmtResponse.json();
      setStatements(stmtData.statements || []);

      // If we have statements, fetch data for the most recent one
      if (stmtData.statements?.length > 0) {
        const latestStatementId = stmtData.statements[0].statement_id;
        setSelectedStatement(latestStatementId);

        // Fetch analytics for the selected statement
        const analyticsResponse = await fetch(`http://localhost:8000/api/statements/${latestStatementId}/analytics`);
        if (analyticsResponse.ok) {
          const analyticsData = await analyticsResponse.json();
          setAnalytics(analyticsData);
        }

        // Fetch transactions for the selected statement
        const txnResponse = await fetch(`http://localhost:8000/api/statements/${latestStatementId}/transactions`);
        if (txnResponse.ok) {
          const txnData = await txnResponse.json();
          setTransactions(txnData.transactions || []);
        }

        // Fetch anomalies
        const anomalyResponse = await fetch(`http://localhost:8000/api/statements/${latestStatementId}/anomalies`);
        if (anomalyResponse.ok) {
          const anomalyData = await anomalyResponse.json();
          setAnomalies(anomalyData.anomalies || []);
        }

        // Fetch insights
        const insightsResponse = await fetch(`http://localhost:8000/api/statements/${latestStatementId}/insights`);
        if (insightsResponse.ok) {
          const insightsData = await insightsResponse.json();
          setInsights(insightsData.insights || []);
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      // Set some mock data for UI demonstration
      setStatements([]);
      setAnalytics(null);
      setTransactions([]);
      setAnomalies([]);
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatementSelect = async (statementId: string) => {
    setSelectedStatement(statementId);
    setLoading(true);

    try {
      // Fetch analytics
      const analyticsResponse = await fetch(`http://localhost:8000/api/statements/${statementId}/analytics`);
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
      }

      // Fetch transactions
      const txnResponse = await fetch(`http://localhost:8000/api/statements/${statementId}/transactions`);
      if (txnResponse.ok) {
        const txnData = await txnResponse.json();
        setTransactions(txnData.transactions || []);
      }

      // Fetch anomalies
      const anomalyResponse = await fetch(`http://localhost:8000/api/statements/${statementId}/anomalies`);
      if (anomalyResponse.ok) {
        const anomalyData = await anomalyResponse.json();
        setAnomalies(anomalyData.anomalies || []);
      }

      // Fetch insights
      const insightsResponse = await fetch(`http://localhost:8000/api/statements/${statementId}/insights`);
      if (insightsResponse.ok) {
        const insightsData = await insightsResponse.json();
        setInsights(insightsData.insights || []);
      }
    } catch (err) {
      console.error('Error loading statement details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && statements.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-black p-8">
        <div className="max-w-6xl mx-auto py-20 text-center">
          <h1 className="text-4xl font-bold text-center mb-8">
            Dashboard
          </h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-32 mx-auto mb-2 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-black p-8">
        <div className="max-w-6xl mx-auto py-20">
          <h1 className="text-4xl font-bold text-center mb-8">
            Dashboard
          </h1>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">
              {error}
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Retry
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Mock data for demonstration when no real data is available
  const mockAnalytics = {
    total_spent: 2450.75,
    total_received: 3200.00,
    net_flow: 749.25,
    transaction_count: 42,
    categories: {
      Food & Dining: 650.50,
      Transportation: 320.25,
      Shopping: 480.00,
      Entertainment: 290.75,
      Utilities: 180.25,
      Healthcare: 120.00,
      Income: 3200.00
    },
    top_merchants: [
      { merchant: 'Starbucks', amount: 125.50 },
      { merchant: 'Amazon', amount: 210.00 },
      { merchant: 'Shell', amount: 95.75 },
      { merchant: 'Netflix', amount: 15.99 },
      { merchant: 'Whole Foods', amount: 180.25 }
    ]
  };

  const mockTransactions = Array.from({ length: 10 }, (_, i) => ({
    id: `txn_${i}`,
    date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
    description: ['Starbucks Coffee', 'Amazon Purchase', 'Shell Gas', 'Netflix Subscription', 'Whole Foods Grocery', 'Salary Deposit', 'Uber Ride', 'Spotify', 'Electric Bill', 'Pharmacy'][i],
    amount: [5.50, 45.99, 45.75, 15.99, 85.25, 1600.00, 22.50, 9.99, 75.25, 12.50][i] * (i % 2 === 0 ? 1 : -1),
    category: ['Food & Dining', 'Shopping', 'Transportation', 'Entertainment', 'Food & Dining', 'Income', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare'][i],
    merchant: ['Starbucks', 'Amazon', 'Shell', 'Netflix', 'Whole Foods', 'Employer', 'Uber', 'Spotify', 'Power Co', 'CVS'][i],
    type: i % 2 === 0 ? 'debit' : 'credit'
  }));

  const mockAnomalies = [
    {
      id: 'anomaly_1',
      transaction_id: 'txn_5',
      description: 'Unusually large transaction',
      amount: 1600.00,
      date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
      reason: 'Salary deposit significantly higher than average',
      severity: 'low'
    }
  ];

  const mockInsights = [
    {
      id: 'insight_1',
      title: 'Spending Under Budget',
      description: 'You spent 15% less on dining out this month compared to last month.',
      type: 'success',
      impact: 'medium'
    },
    {
      id: 'insight_2',
      title: 'Subscription Creep Detected',
      description: 'You have 3 recurring subscriptions totaling $45.98/month that you haven\'t used in the last 30 days.',
      type: 'warning',
      impact: 'high'
    },
    {
      id: 'insight_3',
      title: 'Saving Opportunity',
      description: 'Switching to a different grocery store could save you ~$40/month on essentials.',
      type: 'info',
      impact: 'medium'
    }
  ];

  const analyticsData = analytics || (statements.length > 0 ? mockAnalytics : null);
  const transactionsData = transactions.length > 0 ? transactions : (statements.length > 0 ? mockTransactions : []);
  const anomaliesData = anomalies.length > 0 ? anomalies : (statements.length > 0 ? mockAnomalies : []);
  const insightsData = insights.length > 0 ? insights : (statements.length > 0 ? mockInsights : []);

  return (
    <div className="min-h-screen bg-white dark:bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white dark:text-white">
            Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/upload"
              className="px-4 py-2 bg-white dark:bg-black text-white dark:text-white border border-white/20 dark:border-white/20 rounded-lg hover:bg-white/10 dark:hover:bg-black/20 transition-all"
            >
              Upload New
            </Link>
            <button
              onClick={() => setSelectedStatement(null)}
              className="px-4 py-2 bg-transparent dark:bg-transparent text-white dark:text-white border border-white/20 dark:border-white/20 rounded-lg hover:bg-white/10 dark:hover:bg-black/20 transition-all"
            >
              All Statements
            </button>
          </div>
        </div>

        {/* Statements Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold mb-6 text-white dark:text-white">
            Recent Statements
          </h2>
          <StatementList onStatementSelect={handleStatementSelect} />
        </motion.div>

        {/* Selected Statement Details */}
        {selectedStatement && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white dark:text-white">
                  Statement Details
                </h2>
                <Link
                  href={`/statement/${selectedStatement}`}
                  className="px-4 py-2 bg-white/10 dark:bg-black/20 text-white dark:text-white border border-white/20 dark:border-white/20 rounded-lg hover:bg-white/20 dark:hover:bg-black/30 transition-all"
                >
                  Full Statement →
                </Link>
              </div>

              {/* Stats Cards */}
              {analyticsData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard
                    label="Total Spent"
                    value={formatCurrency(analyticsData.total_spent)}
                    trend="down"
                    icon={<Banknote className="w-5 h-5 text-red-400" strokeWidth={1.5} />}
                  />
                  <StatCard
                    label="Total Received"
                    value={formatCurrency(analyticsData.total_received)}
                    trend="up"
                    icon={<Banknote className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />}
                  />
                  <StatCard
                    label="Net Flow"
                    value={formatCurrency(analyticsData.total_received - analyticsData.total_spent)}
                    trend={analyticsData.total_received > analyticsData.total_spent ? 'up' : 'down'}
                    icon={<ArrowRight className="w-5 h-5" strokeWidth={1.5} />}
                  />
                  <StatCard
                    label="Transactions"
                    value={analyticsData.transaction_count}
                    icon={<FileText className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />}
                  />
                </div>
              )}

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-lg font-semibold mb-4 text-white dark:text-white">
                    Spending by Category
                  </h3>
                  <div className="h-[300px]">
                    {analyticsData && Object.keys(analyticsData.categories).length > 0 ? (
                      <SpendingPieChart
                        data={Object.entries(analyticsData.categories).map(([category, amount]) => ({
                          category,
                          amount,
                          percentage: (amount / analyticsData.total_spent) * 100
                        }))}
                      />
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-zinc-500">
                        No category data available
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-lg font-semibold mb-4 text-white dark:text-white">
                    Top Merchants
                  </h3>
                  <div className="h-[300px]">
                    {analyticsData && analyticsData.top_merchants.length > 0 ? (
                      <MerchantBarChart
                        data={analyticsData.top_merchants.map(item => ({
                          merchant: item.merchant,
                          amount: item.amount
                        }))}
                      />
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-zinc-500">
                        No merchant data available
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Time Series Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mb-8"
              >
                <h3 className="text-lg font-semibold mb-4 text-white dark:text-white">
                  Spending Trend (Last 30 Days)
                </h3>
                <div className="h-[300px]">
                  {/* In a real app, we'd have time series data */}
                  <div className="h-[300px] flex items-center justify-center text-zinc-500">
                    Time series data would be displayed here
                  </div>
                </div>
              </div>

              {/* Insights Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mb-8"
              >
                <h3 className="text-lg font-semibold mb-4 text-white dark:text-white">
                  Financial Insights
                </h3>
                <InsightsList insights={insightsData} />
              </motion.div>

              {/* Anomalies Section */}
              {anomaliesData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                  className="mb-8"
                >
                  <h3 className="text-lg font-semibold mb-4 text-white dark:text-white">
                    Unusual Activity Detected
                  </h3>
                  <div className="space-y-4">
                    {anomaliesData.map((anomaly) => (
                      <AnomalyAlert
                        key={anomaly.id}
                        anomaly={anomaly}
                        onDismiss={(id) => {
                          setAnomalies(prev => prev.filter(a => a.id !== id));
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Transactions Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <h3 className="text-lg font-semibold mb-4 text-white dark:text-white">
                  Recent Transactions
                </h3>
                <div className="border border-zinc-800 bg-zinc-950">
                  <TransactionTable
                    transactions={transactionsData.slice(0, 10)}
                  />
                </div>
              </motion.div>
            </motion.div>
          </>
        )}

        {/* No Statement Selected */}
        {!selectedStatement && statements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <h2 className="text-2xl font-semibold mb-6 text-white dark:text-white">
              Select a Statement to View Details
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto mb-8">
              Click on any statement above to view detailed analytics, insights, and transaction breakdown.
            </p>
            <div className="flex justify-center">
              <Link
                href="/upload"
                className="inline-flex items-center px-6 py-3 bg-white dark:bg-black text-white dark:text-black border border-white/20 dark:border-white/20 rounded-lg hover:bg-white/10 dark:hover:bg-black/20 transition-all"
              >
                Upload Your First Statement
                <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Empty State - No Statements */}
        {!selectedStatement && statements.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <h2 className="text-2xl font-semibold mb-6 text-white dark:text-white">
              No Statements Yet
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto mb-8">
              Upload your first bank statement to see it appear here with AI-powered insights and analytics.
            </p>
            <div className="flex justify-center">
              <Link
                href="/upload"
                className="inline-flex items-center px-6 py-3 bg-white dark:bg-black text-white dark:text-black border border-white/20 dark:border-white/20 rounded-lg hover:bg-white/10 dark:hover:bg-black/20 transition-all"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
