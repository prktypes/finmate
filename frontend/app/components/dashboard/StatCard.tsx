'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down';
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, change, trend, icon }: StatCardProps) {
  const displayValue = typeof value === 'number' ? formatCurrency(value) : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2 }}
      className="border border-zinc-800 bg-zinc-950 p-6 hover:border-zinc-700 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm text-zinc-500 uppercase tracking-wide">{label}</p>
        {icon && <div className="text-zinc-600">{icon}</div>}
      </div>

      <div className="flex items-end justify-between">
        <h3 className="text-3xl font-bold text-white">{displayValue}</h3>

        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend === 'up' ? 'text-emerald-500' : 'text-red-500'
          }`}>
            {trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
            ) : (
              <ArrowDownRight className="w-4 h-4" strokeWidth={2} />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
