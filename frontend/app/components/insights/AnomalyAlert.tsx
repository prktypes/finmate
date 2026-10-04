'use client';

import { motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useState } from 'react';

interface Anomaly {
  id: string;
  transaction_id: string;
  description: string;
  amount: number;
  date: string;
  reason: string;
  severity: 'high' | 'medium' | 'low';
}

interface AnomalyAlertProps {
  anomaly: Anomaly;
  onDismiss?: (id: string) => void;
}

const severityConfig = {
  high: {
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500',
    textColor: 'text-red-400',
    badgeColor: 'bg-red-500/20',
  },
  medium: {
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-400',
    badgeColor: 'bg-amber-500/20',
  },
  low: {
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-400',
    badgeColor: 'bg-blue-500/20',
  },
};

export default function AnomalyAlert({ anomaly, onDismiss }: AnomalyAlertProps) {
  const [dismissed, setDismissed] = useState(false);
  const config = severityConfig[anomaly.severity];

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) {
      setTimeout(() => onDismiss(anomaly.id), 300);
    }
  };

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className={`border-l-2 ${config.borderColor} ${config.bgColor} p-4 relative`}
    >
      {onDismiss && (
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" strokeWidth={2} />
        </button>
      )}

      <div className="flex items-start gap-3 pr-8">
        <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.textColor}`} strokeWidth={2} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-sm font-semibold text-white">Unusual Transaction Detected</h4>
            <span className={`px-2 py-0.5 text-xs font-medium uppercase ${config.badgeColor} ${config.textColor}`}>
              {anomaly.severity}
            </span>
          </div>

          <p className="text-sm text-zinc-300 mb-2">
            {anomaly.description} • {formatCurrency(anomaly.amount)}
          </p>

          <p className="text-xs text-zinc-500 mb-2">
            {formatDate(anomaly.date)}
          </p>

          <p className="text-sm text-zinc-400">
            {anomaly.reason}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
