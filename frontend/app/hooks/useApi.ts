/**
 * Custom React hooks for API interactions
 */

import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Statement {
  statement_id: string;
  filename: string;
  status: string;
  upload_time: string;
  error_message?: string;
}

interface Transaction {
  id: string;
  statement_id: string;
  date: string;
  description: string;
  amount: number;
  balance?: number;
  category?: string;
  normalized_merchant?: string;
}

interface Insights {
  statement_id: string;
  insights: string[];
  total_spent: number;
  total_income: number;
  top_categories: Record<string, number>;
  transaction_count: number;
}

/**
 * Hook to fetch statement status with polling
 */
export function useStatementStatus(statementId: string | null, shouldPoll = false) {
  const [data, setData] = useState<Statement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!statementId) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/statements/${statementId}/status`);
      if (!response.ok) throw new Error('Failed to fetch statement status');
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [statementId]);

  useEffect(() => {
    if (!statementId) return;

    fetchStatus();

    if (shouldPoll) {
      const interval = setInterval(fetchStatus, 2000);
      return () => clearInterval(interval);
    }
  }, [statementId, shouldPoll, fetchStatus]);

  return { data, loading, error, refetch: fetchStatus };
}

/**
 * Hook to fetch statement content
 */
export function useStatement(statementId: string | null) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!statementId) return;

    const fetchStatement = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/statements/${statementId}`);
        if (!response.ok) throw new Error('Failed to fetch statement');
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStatement();
  }, [statementId]);

  return { data, loading, error };
}

/**
 * Hook to analyze a statement
 */
export function useAnalyzeStatement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (statementId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/statements/${statementId}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          extract_transactions: true,
          classify_categories: true,
          normalize_merchants: true,
        }),
      });
      if (!response.ok) throw new Error('Failed to analyze statement');
      const result = await response.json();
      setError(null);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { analyze, loading, error };
}

/**
 * Hook to fetch transactions for a statement
 */
export function useTransactions(statementId: string | null) {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!statementId) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/statements/${statementId}/transactions`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [statementId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { data, loading, error, refetch: fetchTransactions };
}

/**
 * Hook to fetch insights for a statement
 */
export function useInsights(statementId: string | null) {
  const [data, setData] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!statementId) return;

    const fetchInsights = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/statements/${statementId}/insights`);
        if (!response.ok) throw new Error('Failed to fetch insights');
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [statementId]);

  return { data, loading, error };
}

/**
 * Hook to upload a statement
 */
export function useUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/statements/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload file');
      const result = await response.json();
      setError(null);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { upload, loading, error };
}
