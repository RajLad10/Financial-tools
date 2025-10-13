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
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem,
} from 'chart.js';
const Line = dynamic(() => import('react-chartjs-2').then((m) => m.Line), { ssr: false });
import { motion, animate, useMotionValue } from 'framer-motion';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { simulatePrepayment, type PrepaymentResult } from '@/lib/calculations';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
  principalAmount: z.number().positive('Enter a valid loan amount'),
  interestRate: z.number().positive('Enter a valid interest rate'),
  tenureYears: z.number().positive('Enter a valid tenure'),
  prepaymentAmount: z.number().positive('Enter a valid prepayment amount'),
  prepaymentMonth: z.number().min(1, 'Month must be >= 1'),
  mode: z.enum(['reduce_tenure', 'reduce_emi']),
});

type FormT = z.infer<typeof schema>;

export function PrepaymentCalculator() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormT>({
    resolver: zodResolver(schema),
    defaultValues: {
      principalAmount: 2000000,
      interestRate: 8.5,
      tenureYears: 20,
      prepaymentAmount: 200000,
      prepaymentMonth: 24,
      mode: 'reduce_tenure',
    },
  });

  const [res, setRes] = useState<PrepaymentResult | null>(null);

  const onSubmit = (data: FormT) => {
    const r = simulatePrepayment({
      principalAmount: data.principalAmount,
      interestRate: data.interestRate,
      tenureInYears: data.tenureYears,
      prepaymentAmount: data.prepaymentAmount,
      prepaymentMonth: data.prepaymentMonth,
      mode: data.mode,
    });
    setRes(r);
  };

  const chartData = res ? {
    labels: res.before.map((d) => `M${d.month}`),
    datasets: [
      {
        label: 'Remaining (Before)',
        data: res.before.map((d) => d.remaining),
        borderColor: 'rgb(107,114,128)',
        tension: 0.35,
        pointRadius: 0,
      },
      {
        label: 'Remaining (After)',
        data: res.after.map((d) => d.remaining),
        borderColor: 'rgb(59,130,246)',
        tension: 0.35,
        pointRadius: 0,
      },
    ],
  } : null;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Loan Amount (₹)" type="number" {...register('principalAmount', { valueAsNumber: true })} error={errors.principalAmount?.message} />
          <Input label="Interest Rate (%)" type="number" step="0.01" {...register('interestRate', { valueAsNumber: true })} error={errors.interestRate?.message} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Tenure (Years)" type="number" {...register('tenureYears', { valueAsNumber: true })} error={errors.tenureYears?.message} />
          <Input label="Prepayment Amount (₹)" type="number" {...register('prepaymentAmount', { valueAsNumber: true })} error={errors.prepaymentAmount?.message} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Prepayment Month" type="number" {...register('prepaymentMonth', { valueAsNumber: true })} error={errors.prepaymentMonth?.message} />
          <div>
            <label className="text-sm block text-gray-700 dark:text-gray-200 mb-2">Mode</label>
            <div className="flex gap-4 text-sm">
              <label className="inline-flex items-center gap-2"><input type="radio" value="reduce_tenure" {...register('mode')} /> Reduce Tenure</label>
              <label className="inline-flex items-center gap-2"><input type="radio" value="reduce_emi" {...register('mode')} /> Reduce EMI</label>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>Recalculate</Button>
          <Button type="button" variant="secondary" onClick={() => reset()}>Reset</Button>
        </div>
      </form>

      {res && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card-surface p-4">
              <h4 className="text-sm text-gray-600 dark:text-gray-300">Original EMI</h4>
              <div className="text-2xl font-semibold"><AnimatedNumber value={res.originalEmi} /></div>
            </div>
            {'newEmi' in res && res.newEmi !== undefined ? (
              <div className="card-surface p-4">
                <h4 className="text-sm text-gray-600 dark:text-gray-300">New EMI</h4>
                <div className="text-2xl font-semibold"><AnimatedNumber value={res.newEmi!} /></div>
              </div>
            ) : (
              <div className="card-surface p-4">
                <h4 className="text-sm text-gray-600 dark:text-gray-300">New Tenure (months)</h4>
                <div className="text-2xl font-semibold">{res.newTenureMonths}</div>
              </div>
            )}
            <div className="card-surface p-4">
              <h4 className="text-sm text-gray-600 dark:text-gray-300">Total Interest Saved</h4>
              <div className="text-2xl font-semibold"><AnimatedNumber value={res.totalInterestSaved} /></div>
            </div>
            <div className="card-surface p-4">
              <h4 className="text-sm text-gray-600 dark:text-gray-300">New Total Payment</h4>
              <div className="text-2xl font-semibold"><AnimatedNumber value={res.newTotalPayment} /></div>
            </div>
          </div>

          {chartData && (
            <div className="p-4 rounded-lg shadow border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.06] w-full h-80 sm:h-96">
              <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, animation: { duration: 600, easing: 'easeOutQuart' }, plugins: { legend: { position: 'bottom', labels: { color: 'rgba(107,114,128,0.9)', boxWidth: 12, usePointStyle: true } }, title: { display: true, text: 'Remaining Balance (Before vs After)', color: 'rgba(75,85,99,1)', font: { weight: 600 } }, tooltip: { callbacks: { label: (ctx: TooltipItem<'line'>) => `₹${Number(ctx.parsed.y).toLocaleString('en-IN')}` } } }, scales: { x: { grid: { color: 'rgba(148,163,184,0.15)' }, ticks: { color: 'rgba(107,114,128,0.9)' } }, y: { beginAtZero: true, grid: { color: 'rgba(148,163,184,0.15)' }, ticks: { color: 'rgba(107,114,128,0.9)', callback: (v: number | string) => `₹${Number(v).toLocaleString('en-IN')}` } } } }} />
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
