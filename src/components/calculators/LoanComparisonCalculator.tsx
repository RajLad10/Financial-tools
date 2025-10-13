'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import dynamic from 'next/dynamic';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem,
} from 'chart.js';
const Bar = dynamic(() => import('react-chartjs-2').then((m) => m.Bar), { ssr: false });
import { motion, animate, useMotionValue } from 'framer-motion';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateMonthlyEMI } from '@/lib/calculations';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const formatCurrency = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

function AnimatedNumber({ value, duration = 0.8 }: { value: number; duration?: number }) {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState<string>(formatCurrency(0));
  useEffect(() => {
    const controls = animate(count, value, { duration, ease: 'easeOut' });
    const unsub = count.on('change', (v) => setDisplay(formatCurrency(Number(v))));
    return () => { controls.stop(); unsub(); };
  }, [value, duration, count]);
  return <span>{display}</span>;
}

const schema = z.object({
  sameAmount: z.boolean(),
  amount1: z.number().positive('Enter a valid loan amount'),
  amount2: z.number().optional(),
  rate1: z.number().positive('Enter a valid interest rate'),
  years1: z.number().positive('Enter a valid tenure'),
  rate2: z.number().positive('Enter a valid interest rate'),
  years2: z.number().positive('Enter a valid tenure'),
});

type FormT = z.infer<typeof schema>;

export function LoanComparisonCalculator() {
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<FormT>({
    resolver: zodResolver(schema),
    defaultValues: {
      sameAmount: true,
      amount1: 1000000,
      amount2: 1000000,
      rate1: 8.5,
      years1: 20,
      rate2: 8.2,
      years2: 20,
    },
  });

  const [res, setRes] = useState<{ emi1: number; emi2: number; total1: number; total2: number; interest1: number; interest2: number } | null>(null);

  const onSubmit = (data: FormT) => {
    const amount2 = data.sameAmount ? data.amount1 : (data.amount2 ?? data.amount1);
    const emi1 = calculateMonthlyEMI(data.amount1, data.rate1, data.years1);
    const emi2 = calculateMonthlyEMI(amount2, data.rate2, data.years2);
    const n1 = Math.round(data.years1 * 12);
    const n2 = Math.round(data.years2 * 12);
    const total1 = emi1 * n1;
    const total2 = emi2 * n2;
    const interest1 = total1 - data.amount1;
    const interest2 = total2 - amount2;
    setRes({ emi1, emi2, total1, total2, interest1, interest2 });
  };

  const chartData = res ? {
    labels: ['EMI', 'Total Interest', 'Total Payment'],
    datasets: [
      { label: 'Loan 1', data: [res.emi1, res.interest1, res.total1], backgroundColor: 'rgba(59,130,246,0.6)' },
      { label: 'Loan 2', data: [res.emi2, res.interest2, res.total2], backgroundColor: 'rgba(16,185,129,0.6)' },
    ],
  } : null;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
              <input type="checkbox" {...register('sameAmount')} /> Same Loan Amount for both
            </label>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Loan Amount (Loan 1)" type="number" {...register('amount1', { valueAsNumber: true })} error={errors.amount1?.message} />
          {!watch('sameAmount') && (
            <Input label="Loan Amount (Loan 2)" type="number" {...register('amount2', { valueAsNumber: true })} />
          )}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Interest Rate (Loan 1) %" type="number" step="0.01" {...register('rate1', { valueAsNumber: true })} error={errors.rate1?.message} />
          <Input label="Tenure (Loan 1) Years" type="number" {...register('years1', { valueAsNumber: true })} error={errors.years1?.message} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Interest Rate (Loan  2) %" type="number" step="0.01" {...register('rate2', { valueAsNumber: true })} error={errors.rate2?.message} />
          <Input label="Tenure (Loan 2) Years" type="number" {...register('years2', { valueAsNumber: true })} error={errors.years2?.message} />
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>Compare</Button>
          <Button type="button" variant="secondary" onClick={() => reset()}>Reset</Button>
        </div>
      </form>

      {res && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card-surface p-4">
              <h4 className="text-sm text-gray-600 dark:text-gray-300">EMI (Loan 1)</h4>
              <div className="text-2xl font-semibold"><AnimatedNumber value={res.emi1} /></div>
            </div>
            <div className="card-surface p-4">
              <h4 className="text-sm text-gray-600 dark:text-gray-300">EMI (Loan 2)</h4>
              <div className="text-2xl font-semibold"><AnimatedNumber value={res.emi2} /></div>
            </div>
            <div className="card-surface p-4">
              <h4 className="text-sm text-gray-600 dark:text-gray-300">Total Interest (Loan 1)</h4>
              <div className="text-2xl font-semibold"><AnimatedNumber value={res.interest1} /></div>
            </div>
            <div className="card-surface p-4">
              <h4 className="text-sm text-gray-600 dark:text-gray-300">Total Interest (Loan 2)</h4>
              <div className="text-2xl font-semibold"><AnimatedNumber value={res.interest2} /></div>
            </div>
          </div>

          {chartData && (
            <div className="p-4 rounded-lg shadow border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.06]">
              <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { color: 'rgba(107,114,128,0.9)' } }, title: { display: true, text: 'Loan Comparison', color: 'rgba(75,85,99,1)', font: { weight: 600 } }, tooltip: { callbacks: { label: (ctx: TooltipItem<'bar'>) => `${ctx.dataset.label}: ₹${Number(ctx.parsed.y).toLocaleString('en-IN')}` } } }, scales: { x: { ticks: { color: 'rgba(107,114,128,0.9)' } }, y: { ticks: { color: 'rgba(107,114,128,0.9)', callback: (v: number | string) => `₹${Number(v).toLocaleString('en-IN')}` } } } }} />
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
