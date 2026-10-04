'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  height?: number;
  className?: string;
}

export default function LoadingSkeleton({ height = 100, className }: LoadingSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'relative overflow-hidden border border-zinc-800 bg-zinc-950',
        className
      )}
      style={{ height: `${height}px` }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/50 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </motion.div>
  );
}
