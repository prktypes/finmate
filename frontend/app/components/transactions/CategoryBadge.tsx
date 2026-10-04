'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  food: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  transport: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  entertainment: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  shopping: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' },
  utilities: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
  healthcare: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  education: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  income: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  default: { bg: 'bg-zinc-500/10', text: 'text-zinc-400', border: 'border-zinc-500/20' },
};

export default function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const normalizedCategory = category.toLowerCase();
  const colors = categoryColors[normalizedCategory] || categoryColors.default;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'inline-flex items-center px-3 py-1 text-xs font-medium border',
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
    >
      {category}
    </motion.span>
  );
}
