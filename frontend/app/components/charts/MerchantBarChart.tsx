'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface MerchantData {
  merchant: string;
  amount: number;
}

interface MerchantBarChartProps {
  data: MerchantData[];
}

export default function MerchantBarChart({ data }: MerchantBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-zinc-500">
        No merchant data available
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            type="number"
            stroke="#71717a"
            tick={{ fill: '#71717a' }}
            tickLine={{ stroke: '#27272a' }}
            tickFormatter={(value) => `$${value}`}
          />
          <YAxis
            type="category"
            dataKey="merchant"
            stroke="#71717a"
            tick={{ fill: '#71717a' }}
            tickLine={{ stroke: '#27272a' }}
            width={120}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '0',
              color: '#fff',
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Total']}
            labelStyle={{ color: '#71717a' }}
          />
          <Bar dataKey="amount" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
