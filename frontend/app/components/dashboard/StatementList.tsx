'use client';

import { motion } from 'framer-motion';
import StatementCard from './StatementCard';
import EmptyState from './EmptyState';
import LoadingSkeleton from './LoadingSkeleton';
import { useStatements } from '@/hooks/useStatements';
import { formatDate } from '@/lib/utils';

export default function StatementList() {
  const { statements, loading, error } = useStatements();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Your Financial Statements
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <LoadingSkeleton key={i} height={80} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Error Loading Statements
        </h2>
        <p className="text-center text-muted max-w-xl mx-auto">
          {error}
        </p>
      </div>
    );
  }

  if (statements.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-16 text-center">
        <EmptyState
          title="No Statements Yet"
          description="Upload your first bank statement to see it appear here with AI-powered insights and analytics."
          actionText="Upload Statement"
          actionLink="/upload"
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h2 className="text-3xl font-bold mb-8">
        Your Financial Statements
      </h2>
      <div className="space-y-6">
        {statements.map((statement) => (
          <StatementCard
            key={statement.statement_id}
            statement={statement}
          />
        ))}
      </div>
    </div>
  );
}