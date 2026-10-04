'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatementCard } from '@/app/components/dashboard/StatementCard';
import { StatCard } from '@/app/components/dashboard/StatCard';
import { SpendingPieChart } from '@/app/components/charts/SpendingPieChart';
import { MerchantBarChart } from '@/app/components/charts/MerchantBarChart';
import { TransactionTable } from '@/app/components/transactions/TransactionTable';
import { InsightsList } from '@/app/components/insights/InsightsList';
import { AnomalyAlert } from '@/app/components/insights/AnomalyAlert';
import { Banknote, TrendingUp, ArrowRight, ShieldCheck, Calendar, Banknote, FileText } from 'lucide-react';
import { useParams } from 'next/navigation';

interface Statement {
  statement_id: string;
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  upload_time: string;
  total_transactions?: number;
  total_amount?: number;
}

interface Analytics {
  total_spent: number;
  total_received: number;
  transaction_count: number;
  categories: Record<string, number>;
  top_merchants: Array<{ merchant: string; amount: number }>;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  merchant?: string;
  type: 'debit' | 'credit';
}

interface Anomaly {
  id: string;
  transaction_id: string;
  description: string;
  amount: number;
  date: string;
  reason: string;
  severity: 'high' | 'medium' | 'low';
}

interface Insight {
  id: string;
  title: string;
  description: string;
  type?: 'info' | 'success' | 'warning' | 'trend-up' | 'trend-down';
  impact?: 'high' | 'medium' | 'low';
}

export default function StatementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [statement, setStatement] = useState<Statement | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadStatementData();
    }
  }, [id]);

  const loadStatementData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch statement details
      const stmtResponse = await fetch(`http://localhost:8000/api/statements/${id}`);
      if (!stmtResponse.ok) throw new Error('Failed to fetch statement');
      const stmtData = await stmtResponse.json();
      setStatement(stmtData);

      // Fetch analytics
      const analyticsResponse = await fetch(`http://localhost:8000/api/statements/${id}/analytics`);
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
      }

      // Fetch transactions
      const txnResponse = await fetch(`http://localhost:8000/api/statements/${id}/transactions`);
      if (txnResponse.ok) {
        const txnData = await txnResponse.json();
        setTransactions(txnData.transactions || []);
      }

      // Fetch anomalies
      const anomalyResponse = await fetch(`http://localhost:8000/api/statements/${id}/anomalies`);
      if (anomalyResponse.ok) {
        const anomalyData = await anomalyResponse.json();
        setAnomalies(anomalyData.anomalies || []);
      }

      // Fetch insights
      const insightsResponse = await fetch(`http://localhost:8000/api/statements/${id}/insights`);
      if (insightsResponse.ok) {
        const insightsData = await insightsResponse.json();
        setInsights(insightsData.insights || []);
      }
    } catch (err) {
      console.error('Error loading statement detail:', err);
      setError(err instanceof Error ? err.message : 'Failed to load statement details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black p-8">
        <div className="max-w-4xl mx-auto py-20">
          <h1 className="text-3xl font-bold text-center mb-8">Loading Statement...</h1>
          <div className="flex justify-center space-x-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-4 w-4 bg-zinc-500 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-black p-8">
        <div className="max-w-4xl mx-auto py-20">
          <h1 className="text-3xl font-bold text-center mb-8">Error Loading Statement</h1>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!statement) {
    return (
      <div className="min-h-screen bg-white dark:bg-black p-8">
        <div className="max-w-4xl mx-auto py-20 text-center">
          <h1 className="text-3xl font-bold text-center mb-8">Statement Not Found</h1>
          <p className="text-zinc-500">The statement you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors mt-6"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Mock data for demonstration
  const mockAnalytics: Analytics = {
    total_spent: 2450.75,
    total_received: 3200.00,
    transaction_count: 42,
    categories: {
      'Food & Dining': 650.50,
      'Transportation': 320.25,
      'Shopping': 480.00,
      'Entertainment': 290.75,
      'Utilities': 180.25,
      'Healthcare': 120.00,
      'Income': 3200.00
    },
    top_merchants: [
      { merchant: 'Starbucks', amount: 125.50 },
      { merchant: 'Amazon', amount: 210.00 },
      { merchant: 'Shell', amount: 95.75 },
      { merchant: 'Netflix', amount: 15.99 },
      { merchant: 'Whole Foods', amount: 180.25 }
    ]
  };

  const mockTransactions: Transaction[] = Array.from({ length: 15 }, (_, i) => ({
    id: `txn_${i}`,
    date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
    description: [
      'Starbucks Coffee', 'Amazon Purchase', 'Shell Gas', 'Netflix Subscription',
      'Whole Foods Grocery', 'Salary Deposit', 'Uber Ride', 'Spotify',
      'Electric Bill', 'Pharmacy', 'McDonalds', 'Target', 'Gas Station',
      'Hulu', 'Best Buy'
    ][i % 15],
    amount: [
      5.50, 45.99, 45.75, 15.99, 85.25, 1600.00, 22.50, 9.99,
      75.25, 12.50, 12.75, 68.50, 50.00, 12.99, 199.99
    ][i % 15] * (i % 3 === 0 ? 1 : -1),
    category: [
      'Food & Dining', 'Shopping', 'Transportation', 'Entertainment',
      'Food & Dining', 'Income', 'Transportation', 'Entertainment',
      'Utilities', 'Healthcare', 'Food & Dining', 'Shopping',
      'Transportation', 'Entertainment', 'Shopping'
    ][i % 15],
    merchant: [
      'Starbucks', 'Amazon', 'Shell', 'Netflix', 'Whole Foods',
      'Employer', 'Uber', 'Spotify', 'Power Co', 'CVS',
      'McDonalds', 'Target', 'Gas Station', 'Hulu', 'Best Buy'
    ][i % 15],
    type: i % 3 === 0 ? 'credit' : 'debit'
  }));

  const mockAnomalies: Anomaly[] = [
    {
      id: 'anomaly_1',
      transaction_id: 'txn_5',
      description: 'Unusually large transaction',
      amount: 1600.00,
      date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
      reason: 'Salary deposit significantly higher than average',
      severity: 'low'
    },
    {
      id: 'anomaly_2',
      transaction_id: 'txn_14',
      description: 'Unusual merchant category',
      amount: 199.99,
      date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
      reason: 'Electronics purchase outside normal spending pattern',
      severity: 'medium'
    }
  ];

  const mockInsights: Insight[] = [
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
    },
    {
      id: 'insight_4',
      title: 'Income Stability',
      description: 'Your income has been consistent for the past 3 months.',
      type: 'success',
      impact: 'high'
    }
  ];

  const analyticsData = analytics || mockAnalytics;
  const transactionsData = transactions.length > 0 ? transactions : mockTransactions;
  const anomaliesData = anomalies.length > 0 ? anomalies : mockAnomalies;
  const insightsData = insights.length > 0 ? insights : mockInsights;

  return (
    <div className="min-h-screen bg-white dark:bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white dark:text-white">
              Statement Details
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                statement.status === 'completed'
                  ? 'bg-green-500/20 text-green-400'
                  : statement.status === 'processing'
                  ? 'bg-blue-500/20 text-blue-400'
                  : statement.status === 'failed'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-zinc-500/20 text-zinc-400'
              }`}
            >
              {statement.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Statement Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <StatementCard statement={statement} />
        </motion.div>

        {/* Analytics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold mb-6 text-white dark:text-white">
            Financial Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              label="Total Income"
              value={formatCurrency(analyticsData.total_received)}
              trend="up"
              icon={<Banknote className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />}
            />
            <StatCard
              label="Total Expenses"
              value={formatCurrency(analyticsData.total_spent)}
              trend="down"
              icon={<Banknote className="w-5 h-5 text-red-400" strokeWidth={1.5} />}
            />
            <StatCard
              label="Net Position"
              value={formatCurrency(analyticsData.total_received - analyticsData.total_spent)}
              trend={analyticsData.total_received > analyticsData.total_spent ? 'up' : 'down'}
              icon={<ArrowRight className="w-5 h-5" strokeWidth={1.5} />}
            />
            <StatCard
              label="Transaction Count"
              value={analyticsData.transaction_count}
              icon={<FileText className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-white dark:text-white">
                Spending by Category
              </h3>
              <div className="h-[300px]">
                {Object.keys(analyticsData.categories).length > 0 ? (
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
                {analyticsData.top_merchants.length > 0 ? (
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
        </motion.div>

        {/* Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold mb-6 text-white dark:text-white">
            Financial Insights
          </h2>
          <InsightsList insights={insightsData} />
        </motion.div>

        {/* Anomalies Section */}
        {anomaliesData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mb-10"
          >
            <h2 className="text-2xl font-semibold mb-6 text-white dark:text-white">
              Unusual Activity Detected
            </h2>
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

        {/* Transactions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-white dark:text-white">
            Transaction History
          </h2>
          <div className="border border-zinc-800 bg-zinc-950">
            <TransactionTable
              transactions={transactionsData}
            />
          </div>
        </motion.div>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-12 pt-8 border-t border-zinc-800"
        >
          <div className="flex justify-center space-x-4">
            <Link
              href="/upload"
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Upload New Statement
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-transparent dark:bg-transparent text-white dark:text-white border border-white/20 dark:border-white/20 rounded-lg hover:bg-white/10 dark:hover:bg-black/20 transition-colors"
            >
              Back to All Statements
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
