'use client';

import { motion } from 'framer-motion';
import InsightCard from './InsightCard';

interface Insight {
  id: string;
  title: string;
  description: string;
  type?: 'info' | 'success' | 'warning' | 'trend-up' | 'trend-down';
  impact?: 'high' | 'medium' | 'low';
}

interface InsightsListProps {
  insights: Insight[];
}

export default function InsightsList({ insights }: InsightsListProps) {
  if (!insights || insights.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-zinc-500">No insights available yet</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {insights.map((insight, index) => (
        <motion.div
          key={insight.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <InsightCard
            title={insight.title}
            description={insight.description}
            type={insight.type}
            impact={insight.impact}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
