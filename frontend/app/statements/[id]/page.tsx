'use client';

import { motion } from 'framer-motion';
import { useStatementStatus, useStatement, useAnalyzeStatement, useTransactions, useInsights } from '@/hooks/useApi';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, Legend as BarLegend } from 'recharts';
import { CheckCircle, Loader2, AlertCircle, ArrowLeft, FileText, Brain, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';

type Statement = {
  statement_id: string;
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  upload_time: string;
  error_message?: string;
  extracted_text?: string;
  transactions?: Array<{
    id: string;
    date: string;
    description: string;
    amount: number;
    balance?: number;
    category?: string;
    normalized_merchant?: string;
  }>;
};

type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  balance?: number;
  category?: string;
  normalized_merchant?: string;
};

type Insights = {
  statement_id: string;
  insights: string[];
  total_spent: number;
  total_income: number;
  top_categories: Record<string, number>;
  transaction_count: number;
};

export default function StatementDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const statementId = params.id;

  const { data: statement, loading: statementLoading, error: statementError } = useStatement(statementId);
  const { data: statusData, loading: statusLoading, error: statusError, refetch: refetchStatus } = useStatementStatus(statementId, true);
  const { analyze, loading: analyzeLoading, error: analyzeError } = useAnalyzeStatement();
  const { data: transactions, loading: transactionsLoading, error: transactionsError } = useTransactions(statementId);
  const { data: insights, loading: insightsLoading, error: insightsError } = useInsights(statementId);

  // Use status from polling if available, otherwise from statement data
  const statementStatus = statusData?.status || statement?.status;
  const hasError = statementError || statusError || analyzeError || transactionsError || insightsError;

  const handleAnalyze = async () => {
    if (statementId) {
      try {
        await analyze(statementId);
        // Refetch data after analysis
        refetchStatus();
      } catch (err) {
        console.error('Analysis failed:', err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" strokeWidth={2} />;
      case 'processing':
      case 'pending':
        return <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" strokeWidth={2} />;
      default:
        return <Loader2 className="w-5 h-5" strokeWidth={2} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'processing':
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-muted';
    }
  };

  if (statementLoading || statusLoading || transactionsLoading || insightsLoading || analyzeLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
        >
          <div className="container mx-auto px-8 py-5 flex justify-between items-center">
            <Link href="/" className="text-2xl font-semibold tracking-tight">
              FinMate
            </Link>
            <div className="hidden md:flex gap-10">
              <Link href="/" className="text-sm font-medium hover:text-muted transition-colors">
                Home
              </Link>
              <Link href="/dashboard" className="text-sm font-medium hover:text-muted transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </motion.nav>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center py-20">
              <Loader2 className="w-16 h-16 mx-auto mb-6 animate-spin text-muted" strokeWidth={1.5} />
              <p className="text-muted text-xl">Loading statement details...</p>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
        >
          <div className="container mx-auto px-8 py-5 flex justify-between items-center">
            <Link href="/" className="text-2xl font-semibold tracking-tight">
              FinMate
            </Link>
            <div className="hidden md:flex gap-10">
              <Link href="/" className="text-sm font-medium hover:text-muted transition-colors">
                Home
              </Link>
              <Link href="/dashboard" className="text-sm font-medium hover:text-muted transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </motion.nav>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center py-20">
              <AlertCircle className="w-16 h-16 mx-auto mb-6 text-red-600" strokeWidth={1.5} />
              <h2 className="text-3xl font-bold mb-4">
                Error loading statement
              </h2>
              <p className="text-muted">
                {statementError || statusError || transactionsError || insightsError || analyzeError || 'Unknown error'}
              </p>
              <Link
                href="/dashboard"
                className="inline-block bg-foreground text-background px-8 py-4 font-medium hover:opacity-80 transition-opacity mt-6"
              >
                Back to Dashboard
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  if (!statement) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
        >
          <div className="container mx-auto px-8 py-5 flex justify-between items-center">
            <Link href="/" className="text-2xl font-semibold tracking-tight">
              FinMate
            </Link>
            <div className="hidden md:flex gap-10">
              <Link href="/" className="text-sm font-medium hover:text-muted transition-colors">
                Home
              </Link>
              <Link href="/dashboard" className="text-sm font-medium hover:text-muted transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </motion.nav>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center py-20">
              <AlertCircle className="w-16 h-16 mx-auto mb-6 text-red-600" strokeWidth={1.5} />
              <h2 className="text-3xl font-bold mb-4">Statement not found</h2>
              <p className="text-muted">The statement you're looking for doesn't exist or has been removed.</p>
              <Link
                href="/dashboard"
                className="inline-block bg-foreground text-background px-8 py-4 font-medium hover:opacity-80 transition-opacity mt-6"
              >
                Back to Dashboard
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="container mx-auto px-8 py-5 flex justify-between items-center">
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            FinMate
          </Link>
          <div className="hidden md:flex gap-10">
            <Link href="/" className="text-sm font-medium hover:text-muted transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-muted transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="mb-12">
            <FileText className="w-8 h-8 inline-block mb-4" strokeWidth={1.5} />
            <h1 className="text-5xl font-bold mb-4 tracking-tight">{statement.filename}</h1>
            <p className="text-muted text-lg">
              Uploaded: {new Date(statement.upload_time).toLocaleString()}
            </p>
          </div>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="border border-border p-10 mb-10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Status</h2>
              <span className={`inline-flex items-center gap-2 text-sm font-medium uppercase ${getStatusColor(statementStatus)}`}>
                {getStatusIcon(statementStatus)}
                {statementStatus.charAt(0).toUpperCase() + statementStatus.slice(1)}
              </span>
            </div>

            {statementStatus === 'processing' || statementStatus === 'pending' ? (
              <div>
                <div className="h-2 bg-border overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-full bg-foreground"
                  />
                </div>
                <p className="text-sm text-muted">
                  Processing your statement... This may take a few moments.
                </p>
              </div>
            ) : statementStatus === 'failed' ? (
              <div className="text-red-600">
                <p>Processing failed: {statement.error_message}</p>
              </div>
            ) : statementStatus === 'completed' && (!transactions || transactions.length === 0) ? (
              <div className="flex items-center mt-4">
                <button
                  onClick={handleAnalyze}
                  disabled={analyzeLoading}
                  className="bg-foreground text-background px-6 py-3 font-medium hover:opacity-80 transition-opacity flex items-center gap-2"
                >
                  {analyzeLoading ? (
                    <Loader2 className="w-4 h-4 mx-auto animate-spin text-background" strokeWidth={1.5} />
                  ) : (
                    <Brain className="w-4 h-4" strokeWidth={1.5} />
                  )}
                  <span className="whitespace-nowrap">
                    {analyzeLoading ? 'Analyzing...' : 'Analyze with AI'}
                  </span>
                </button>
              </div>
            ) : null}
          </motion.div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex border-b border-border">
              <button
                onClick={() => {
                  // TODO: Implement tab switching
                }}
                className={`px-6 py-3 text-sm font-medium ${
                  statementStatus === 'completed' && transactions && transactions.length > 0
                    ? 'text-foreground border-b-2 border-foreground'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => {
                  // TODO: Implement tab switching
                }}
                className={`px-6 py-3 text-sm font-medium ${
                  insights && insights.insights.length > 0
                    ? 'text-foreground border-b-2 border-foreground'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Insights
              </button>
            </div>
          </div>

          {/* Content Area */}
          {statementStatus === 'completed' && transactions && transactions.length > 0 ? (
            <>
              {/* Transactions Tab Content */}
              <div className="space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="border border-border p-6 rounded-lg"
                  >
                    <h3 className="text-sm font-medium text-muted mb-2">Total Spent</h3>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(Math.abs(insights?.total_spent || 0))}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="border border-border p-6 rounded-lg"
                  >
                    <h3 className="text-sm font-medium text-muted mb-2">Total Income</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(insights?.total_income || 0)}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="border border-border p-6 rounded-lg"
                  >
                    <h3 className="text-sm font-medium text-muted mb-2">Transaction Count</h3>
                    <p className="text-2xl font-bold text-muted">
                      {insights?.transaction_count || 0}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="border border-border p-6 rounded-lg"
                  >
                    <h3 className="text-sm font-medium text-muted mb-2">Categories</h3>
                    <p className="text-2xl font-bold text-muted">
                      {Object.keys(insights?.top_categories || {}).length}
                    </p>
                  </motion.div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Spending by Category Pie Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="border border-border p-6 rounded-lg"
                  >
                    <h3 className="text-xl font-semibold mb-4">Spending by Category</h3>
                    <div className="h-64 w-full">
                      {Object.keys(insights?.top_categories || {}).length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={Object.entries(insights?.top_categories || {}).map(([name, value]) => ({
                                name,
                                value: value as number,
                              }))}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              labelLine={false}
                              label={false}
                            >
                              {Object.entries(insights?.top_categories || {}).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`hsl(${(index * 30) % 360}, 70%, 50%)`} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `$${value}`} />
                            <Legend verticalAlign="top" height={36} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex h-64 items-center justify-center text-muted">
                          No category data available
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Spending Over Time Bar Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="border border-border p-6 rounded-lg"
                  >
                    <h3 className="text-xl font-semibold mb-4">Spending Over Time</h3>
                    <div className="h-64 w-full">
                      {transactions.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={transactions
                              .filter(t => t.amount < 0) // Only expenses
                              .map(t => ({
                                date: formatDate(t.date),
                                amount: Math.abs(t.amount),
                              }))}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={false} />
                            <YAxis tick={false} />
                            <Bar dataKey="amount" fill="#8884d8" radius={[6, 6, 0, 0]} />
                            <BarTooltip formatter={(value) => `$${value}`} />
                            <BarLegend verticalAlign="top" height={36} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex h-64 items-center justify-center text-muted">
                          No expense data available
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Transactions Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="border border-border p-6 rounded-lg"
                >
                  <h3 className="text-xl font-semibold mb-6">Transactions</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-background">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {transactions.map((txn) => (
                          <tr key={txn.id} className="hover:bg-background/50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                              {formatDate(txn.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                              <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: txn.category ? `hsl(${Math.abs(txn.category.charCodeAt(0) * 15) % 360}, 70%, 50%)` : '#6B7280' }}></div>
                                <span>{txn.description}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                              {txn.category || 'Other'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted text-right">
                              {txn.amount < 0 ? (
                                <span className="text-red-600">{formatCurrency(txn.amount)}</span>
                              ) : (
                                <span className="text-green-600">{formatCurrency(txn.amount)}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            </>
          ) : statementStatus === 'completed' && insights && insights.insights.length > 0 ? (
            {/* Insights Tab Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="border border-border p-6 rounded-lg"
            >
              <h3 className="text-xl font-semibold mb-6">Financial Insights</h3>
              <div className="space-y-4">
                {insights.insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-4 bg-background border border-border rounded-lg"
                  >
                    <p className="text-muted">{insight}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : statementStatus === 'completed' && (!transactions || transactions.length === 0) && (!insights || insights.insights.length === 0) ? (
            {/* No Data State */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="border border-border p-6 rounded-lg text-center py-12"
            >
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted" strokeWidth={1.5} />
              <h3 className="text-xl font-semibold mb-4">No transaction data available</h3>
              <p className="text-muted mb-6">
                The statement has been processed but no transactions were extracted or analyzed yet.
              </p>
              <button
                onClick={handleAnalyze}
                disabled={analyzeLoading}
                className="bg-foreground text-background px-6 py-4 font-medium hover:opacity-80 transition-opacity flex items-center gap-2"
              >
                {analyzeLoading ? (
                  <Loader2 className="w-4 h-4 mx-auto animate-spin text-background" strokeWidth={1.5} />
                ) : (
                  <Brain className="w-4 h-4" strokeWidth={1.5} />
                )}
                <span className="ml-2 whitespace-nowrap">
                  {analyzeLoading ? 'Analyzing...' : 'Analyze with AI'}
                </span>
              </button>
            </motion.div>
          ) : null}
        </motion.div>
      </main>
    </div>
  );
}
