'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Statement {
  statement_id: string;
  filename: string;
  status: string;
  upload_time: string;
}

export default function DashboardPage() {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatements();
  }, []);

  const fetchStatements = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call when list endpoint is available
      // For now, using mock data
      const mockStatements: Statement[] = [];
      setStatements(mockStatements);
    } catch (err) {
      setError('Failed to load statements');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-8">
            Dashboard
          </h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-gray-100 dark:bg-gray-900 rounded-lg animate-pulse"
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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-8">
            Dashboard
          </h1>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (statements.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-black p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-8">
            Dashboard
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
              No statements yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Upload your first bank statement to get started
            </p>
            <a
              href="/upload"
              className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Upload Statement
            </a>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-white">
            Dashboard
          </h1>
          <a
            href="/upload"
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Upload New
          </a>
        </div>

        <div className="space-y-4">
          {statements.map((statement, index) => (
            <motion.div
              key={statement.statement_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-black dark:text-white mb-1">
                    {statement.filename}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Uploaded{' '}
                    {new Date(statement.upload_time).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      statement.status === 'completed'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                        : statement.status === 'processing'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                        : statement.status === 'failed'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {statement.status}
                  </span>
                  <a
                    href={`/statement/${statement.statement_id}`}
                    className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                  >
                    View →
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
