'use client';

import { motion } from 'framer-motion';
import { LightbulbIcon, TrendingUp, TrendingDown, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  title: string;
  description: string;
  type?: 'info' | 'success' | 'warning' | 'trend-up' | 'trend-down';
  impact?: 'high' | 'medium' | 'low';
}

const typeConfig = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    iconColor: 'text-blue-400',
  },
  success: {
    icon: LightbulbIcon,
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    iconColor: 'text-amber-400',
  },
  'trend-up': {
    icon: TrendingUp,
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  'trend-down': {
    icon: TrendingDown,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    iconColor: 'text-red-400',
  },
};

export default function InsightCard({
  title,
  description,
  type = 'info',
  impact = 'medium'
}: InsightCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'border p-5 transition-all duration-300',
        config.bgColor,
        config.borderColor,
        'hover:border-opacity-40'
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn('flex-shrink-0 mt-0.5', config.iconColor)}>
          <Icon className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white mb-1.5">{title}</h4>
          <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
          {impact && impact !== 'low' && (
            <div className="mt-3">
              <span className={cn(
                'inline-block px-2 py-0.5 text-xs font-medium uppercase tracking-wide',
                impact === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
              )}>
                {impact} impact
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
