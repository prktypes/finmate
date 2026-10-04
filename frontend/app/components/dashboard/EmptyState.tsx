'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FileText } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
}

export default function EmptyState({
  title,
  description,
  actionText = 'Get Started',
  actionLink = '/upload'
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto text-center py-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="inline-flex items-center justify-center w-20 h-20 border border-zinc-800 rounded-full mb-6 bg-zinc-950"
      >
        <FileText className="w-10 h-10 text-zinc-600" strokeWidth={1.5} />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-2xl font-semibold text-white mb-3"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-zinc-500 mb-8 leading-relaxed"
      >
        {description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Link
          href={actionLink}
          className="inline-flex items-center px-6 py-3 bg-white text-black font-medium hover:bg-zinc-200 transition-colors"
        >
          {actionText}
        </Link>
      </motion.div>
    </motion.div>
  );
}
