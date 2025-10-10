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
  ArcElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem,
  type ScriptableContext,
} from 'chart.js';
const Line = dynamic(() => import('react-chartjs-2').then((m) => m.Line), { ssr: false });
const Pie = dynamic(() => import('react-chartjs-2').then((m) => m.Pie), { ssr: false });
import { animate, motion, useMotionValue } from 'framer-motion';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateTargetSIP, type TargetSIPResult } from '@/lib/calculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const formatCurrency = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const formatCompactCurrency = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(Math.round(n));

function AnimatedNumber({ value, duration = 0.8, format = formatCurrency }: { value: number; duration?: number; format?: (n:number)=>string }) {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState<string>(format(0));
  useEffect(() => {
    const controls = animate(count, value, { duration, ease: 'easeOut' });
    const unsub = count.on('change', (v) => setDisplay(format(Number(v))));
    return () => { controls.stop(); unsub(); };
  }, [value, duration, count, format]);
  return <span>{display}</span>;
}

const targetSchema = z.object({
  targetAmount: z.number().positive('Enter a valid target amount'),
  years: z.number().positive('Years must be > 0'),
  expectedReturn: z.number().positive('Return must be > 0'),
});

type TargetForm = z.infer<typeof targetSchema>;

export function TargetSIPCalculator() {
  const [result, setResult] = useState<TargetSIPResult | null>(null);
  const [displayMode, setDisplayMode] = useState<'full' | 'compact'>('full');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TargetForm>({
    resolver: zodResolver(targetSchema),
    defaultValues: { targetAmount: 1000000, years: 10, expectedReturn: 12 },
  });

  const onSubmit = (data: TargetForm) => {
    const res = calculateTargetSIP({
      targetAmount: data.targetAmount,
      years: data.years,
      expectedReturn: data.expectedReturn,
    });
    setResult(res);
  };

  const lineData = result ? {
    labels: result.monthlyData.map(d => `Year ${Math.ceil(d.month/12)}`),
    datasets: [
      {
        label: 'Investment',
        data: result.monthlyData.map(d => d.investment),
        borderColor: 'rgb(107,114,128)',
        pointRadius: 0,
        tension: 0.35,
        fill: true,
        backgroundColor: (ctx: ScriptableContext<'line'>) => {
          const chart = ctx.chart; const { ctx: c, chartArea } = chart; if (!chartArea) return 'rgba(107,114,128,0.15)';
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0,'rgba(107,114,128,0.25)'); g.addColorStop(1,'rgba(107,114,128,0.05)'); return g;
        },
      },
      {
        label: 'Expected Value',
        data: result.monthlyData.map(d => d.value),
        borderColor: 'rgb(59,130,246)',
        pointRadius: 0,
        tension: 0.35,
        fill: true,
        backgroundColor: (ctx: ScriptableContext<'line'>) => {
          const chart = ctx.chart; const { ctx: c, chartArea } = chart; if (!chartArea) return 'rgba(59,130,246,0.15)';
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0,'rgba(59,130,246,0.35)'); g.addColorStop(1,'rgba(59,130,246,0.05)'); return g;
        },
      },
    ],
  } : null;

  const pieData = result ? {
    labels: ['Total Investment', 'Expected Returns'],
    datasets: [{
      data: [result.totalInvestment, result.expectedReturns],
      backgroundColor: ['rgba(59,130,246,0.5)', 'rgba(16,185,129,0.5)'],
      borderColor: ['rgb(59,130,246)', 'rgb(16,185,129)'],
      borderWidth: 1,
    }],
  } : null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Target-based SIP</h2>
      <div className="space-y-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input label="Target Amount (₹)" type="number" {...register('targetAmount', { valueAsNumber: true })} error={errors.targetAmount?.message} />
          <Input label="Time Period (Years)" type="number" {...register('years', { valueAsNumber: true })} error={errors.years?.message} />
          <Input label="Expected Return (%)" type="number" step="0.1" {...register('expectedReturn', { valueAsNumber: true })} error={errors.expectedReturn?.message} />
          <Button type="submit" disabled={isSubmitting}>Calculate</Button>
        </form>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-end">
              <div className="inline-flex rounded-md border border-gray-200 dark:border-white/10 overflow-hidden">
                <button type="button" aria-pressed={displayMode==='full'} onClick={() => setDisplayMode('full')} className={`px-3 py-1 text-sm ${displayMode==='full' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-600 dark:text-gray-300'}`}>Full</button>
                <button type="button" aria-pressed={displayMode==='compact'} onClick={() => setDisplayMode('compact')} className={`px-3 py-1 text-sm ${displayMode==='compact' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-600 dark:text-gray-300'}`}>Compact</button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-transparent dark:border-white/10 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Required Monthly SIP</h3>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100"><AnimatedNumber key={`req-${displayMode}`} value={result.requiredMonthlyInvestment} format={displayMode==='full' ? formatCurrency : formatCompactCurrency} /></p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/30 border border-transparent dark:border-white/10 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Expected Returns</h3>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100"><AnimatedNumber key={`ret-${displayMode}`} value={result.expectedReturns} format={displayMode==='full' ? formatCurrency : formatCompactCurrency} /></p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/30 border border-transparent dark:border-white/10 p-4 rounded-lg sm:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Total Value</h3>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100"><AnimatedNumber key={`val-${displayMode}`} value={result.totalValue} format={displayMode==='full' ? formatCurrency : formatCompactCurrency} /></p>
              </div>
            </div>

            {pieData && (
              <div className="p-4 rounded-lg shadow border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.06] w-full">
                <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { color: 'rgba(107,114,128,0.9)', boxWidth: 12, usePointStyle: true } }, tooltip: { callbacks: { label: (ctx: TooltipItem<'pie'>) => `${ctx.label}: ₹${Number(ctx.parsed).toLocaleString('en-IN')}` } }, title: { display: true, text: 'Investment vs Returns', color: 'rgba(75,85,99,1)', font: { weight: 600 } } } }} />
              </div>
            )}

            {lineData && (
              <div className="p-4 rounded-lg shadow border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.06] w-full h-80 sm:h-96">
                <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, animation: { duration: 600, easing: 'easeOutQuart' }, plugins: { legend: { position: 'bottom', labels: { color: 'rgba(107,114,128,0.9)', boxWidth: 12, usePointStyle: true } }, title: { display: true, text: 'Progress to Target', color: 'rgba(75,85,99,1)', font: { weight: 600 } }, tooltip: { callbacks: { label: (ctx: TooltipItem<'line'>) => `${ctx.dataset.label}: ₹${Number(ctx.parsed.y).toLocaleString('en-IN')}` } } }, scales: { x: { grid: { color: 'rgba(148,163,184,0.15)' }, ticks: { color: 'rgba(107,114,128,0.9)' } }, y: { beginAtZero: true, grid: { color: 'rgba(148,163,184,0.15)' }, ticks: { color: 'rgba(107,114,128,0.9)', callback: (v: number | string) => `₹${Number(v).toLocaleString('en-IN')}` } } } }} />
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
