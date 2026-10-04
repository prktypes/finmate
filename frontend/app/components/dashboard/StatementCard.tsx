'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FileText, ArrowRight, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Statement {
  statement_id: string;
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  upload_time: string;
  total_transactions?: number;
  total_amount?: number;
}

interface StatementCardProps {
  statement: Statement;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-zinc-500',
    bgColor: 'bg-zinc-500/10',
    label: 'Pending',
  },
  processing: {
    icon: Loader2,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    label: 'Processing',
  },
  completed: {
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    label: 'Completed',
  },
  failed: {
    icon: AlertCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    label: 'Failed',
  },
};

export default function StatementCard({ statement }: StatementCardProps) {
  const config = statusConfig[statement.status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={`/statements/${statement.statement_id}`}
        className="block border border-zinc-800 bg-black hover:border-zinc-700 transition-all duration-300 group"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="mt-1 flex-shrink-0">
                <FileText className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-white mb-1 truncate group-hover:text-zinc-100 transition-colors">
                  {statement.filename}
                </h3>
                <p className="text-sm text-zinc-500">
                  Uploaded {formatDate(statement.upload_time)}
                </p>
                {statement.total_transactions !== undefined && (
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <span className="text-zinc-400">
                      {statement.total_transactions} transactions
                    </span>
                    {statement.total_amount !== undefined && (
                      <span className="text-zinc-400">
                        Total: ${statement.total_amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <div className={`flex items-center gap-2 px-3 py-1.5 ${config.bgColor} rounded-full`}>
                <StatusIcon
                  className={`w-4 h-4 ${config.color} ${statement.status === 'processing' ? 'animate-spin' : ''}`}
                  strokeWidth={2}
                />
                <span className={`text-sm font-medium ${config.color}`}>
                  {config.label}
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
