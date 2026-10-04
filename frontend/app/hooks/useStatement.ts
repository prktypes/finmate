'use client';

import { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  merchant?: string;
  type: 'debit' | 'credit';
}

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
  categories: Record<string, number>;
  top_merchants: Array<{ merchant: string; amount: number }>;
}

export function useStatement(statementId: string) {
  const [statement, setStatement] = useState<Statement | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (statementId) {
      fetchStatement();
    }
  }, [statementId]);

  const fetchStatement = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch statement details
      const stmtResponse = await fetch(`http://localhost:8000/api/statements/${statementId}`);
      if (!stmtResponse.ok) throw new Error('Failed to fetch statement');
      const stmtData = await stmtResponse.json();
      setStatement(stmtData);

      // Fetch transactions
      const txnResponse = await fetch(`http://localhost:8000/api/statements/${statementId}/transactions`);
      if (txnResponse.ok) {
        const txnData = await txnResponse.json();
        setTransactions(txnData.transactions || []);
      }

      // Fetch analytics
      const analyticsResponse = await fetch(`http://localhost:8000/api/statements/${statementId}/analytics`);
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
      }
    } catch (err) {
      console.error('Error fetching statement:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { statement, transactions, analytics, loading, error, refetch: fetchStatement };
}
