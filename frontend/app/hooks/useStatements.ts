'use client';

import { useState, useEffect } from 'react';

interface Statement {
  statement_id: string;
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  upload_time: string;
  total_transactions?: number;
  total_amount?: number;
}

export function useStatements() {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatements();
  }, []);

  const fetchStatements = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8000/api/statements');

      if (!response.ok) {
        throw new Error('Failed to fetch statements');
      }

      const data = await response.json();
      setStatements(data.statements || []);
    } catch (err) {
      console.error('Error fetching statements:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStatements([]);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchStatements();
  };

  return { statements, loading, error, refetch };
}
