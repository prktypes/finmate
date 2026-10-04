'use client';

import { motion } from 'framer-motion';
import { formatDate, formatCurrency } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  merchant?: string;
  type: 'debit' | 'credit';
}

interface TransactionTableProps {
  transactions: Transaction[];
  onRowClick?: (transaction: Transaction) => void;
  sortable: boolean;
}

export default function TransactionTable({
  transactions,
  onRowClick,
  sortable = true
}: TransactionTableProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-zinc-500">
        No transactions to display
      </div>
    );
  }

  const columns = [
    { key: 'date', label: 'Date', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'merchant', label: 'Merchant', sortable: false },
  ];

  // Sort transactions by date (newest first) by default
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="border border-zinc-800 bg-zinc-950">
        <table className="min-w-full divide-y divide-zinc-800">
          <thead className="bg-zinc-950">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider',
                    sortable && column.sortable ? 'cursor-pointer hover:text-zinc-100 transition-colors' : ''
                  )}
                >
                  {column.label}
                  {sortable && column.sortable && (
                    <ChevronDown className="ml-1 h-4 w-4 text-zinc-500" strokeWidth={1.5} />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {sortedTransactions.map((transaction, index) => (
              <motion.tr
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02, duration: 0.3 }}
                whileHover={{ bgColor: sortable ? 'zinc-900' : undefined }}
                className={cn(
                  sortable ? 'hover:bg-zinc-900 cursor-pointer' : '',
                  'transition-colors duration-200'
                )}
                onClick={() => onRowClick?.(transaction)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{formatDate(transaction.date)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-zinc-300">{transaction.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    transaction.type === 'debit'
                      ? 'text-red-400'
                      : 'text-emerald-400'
                  }`}>
                    {formatCurrency(transaction.amount)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: getCategoryColor(transaction.category) }}></div>
                    <span className="text-zinc-300">{transaction.category}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.merchant ? (
                    <div className="text-sm text-zinc-300">{transaction.merchant}</div>
                  ) : (
                    <div className="text-sm text-zinc-400 italic">Unknown</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function getCategoryColor(category: string): string {
  const colors = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
    '#06b6d4', '#f97316', '#6366f1', '#d946ef', '#14b8a6'
  ];

  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

import { cn } from '@/lib/utils';
