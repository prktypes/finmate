'use client';

import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface AmountDisplayProps {
  amount: number;
  type?: 'debit' | 'credit';
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AmountDisplay({
  amount,
  type,
  showIcon = false,
  size = 'md',
  className
}: AmountDisplayProps) {
  const isDebit = type === 'debit' || amount < 0;
  const displayAmount = Math.abs(amount);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium tabular-nums',
        isDebit ? 'text-red-400' : 'text-emerald-400',
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        isDebit ? (
          <ArrowDownRight className={cn(iconSizes[size], 'text-red-400')} strokeWidth={2} />
        ) : (
          <ArrowUpRight className={cn(iconSizes[size], 'text-emerald-400')} strokeWidth={2} />
        )
      )}
      {isDebit && '−'}
      {!isDebit && '+'}
      {formatCurrency(displayAmount)}
    </span>
  );
}
