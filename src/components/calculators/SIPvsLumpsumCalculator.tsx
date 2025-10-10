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
import { animate, motion, useMotionValue } from 'framer-motion';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateSIPvsLumpsum, type SIPvsLumpsumResult } from '@/lib/calculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

const compareSchema = z.object({
  monthlyInvestment: z.number().positive('Enter a valid monthly investment'),
  years: z.number().positive('Years must be > 0'),
  expectedReturn: z.number().positive('Return must be > 0'),
  lumpsumAmount: z.number().optional(),
});

type CompareForm = z.infer<typeof compareSchema>;

export function SIPvsLumpsumCalculator() {
  const [result, setResult] = useState<SIPvsLumpsumResult | null>(null);
  const [displayMode, setDisplayMode] = useState<'full' | 'compact'>('full');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CompareForm>({
    resolver: zodResolver(compareSchema),
    defaultValues: { monthlyInvestment: 5000, years: 10, expectedReturn: 12, lumpsumAmount: undefined },
  });

  const onSubmit = (data: CompareForm) => {
    const normalizedLumpsum = Number.isFinite(data.lumpsumAmount as number)
      ? (data.lumpsumAmount as number)
      : undefined;
    const res = calculateSIPvsLumpsum(
      data.monthlyInvestment,
      data.years,
      data.expectedReturn,
      normalizedLumpsum
    );
    setResult(res);
  };

  const chartData = result ? {
    labels: result.sip.monthlyData.map(d => `Year ${Math.ceil(d.month/12)}`),
    datasets: [
      {
        label: 'SIP Value',
        data: result.sip.monthlyData.map(d => d.value),
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2.5,
        pointRadius: 0,
        tension: 0.35,
      },
      {
        label: 'Lumpsum Value',
        data: result.lumpsum.monthlyData.map(d => d.value),
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.35,
      },
    ],
  } : null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">SIP vs Lumpsum</h2>
      <div className="space-y-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input label="Monthly Investment (₹)" type="number" {...register('monthlyInvestment', { valueAsNumber: true })} error={errors.monthlyInvestment?.message} />
          <Input label="Time Period (Years)" type="number" {...register('years', { valueAsNumber: true })} error={errors.years?.message} />
          <Input label="Expected Return (%)" type="number" step="0.1" {...register('expectedReturn', { valueAsNumber: true })} error={errors.expectedReturn?.message} />
          <Input label="Lumpsum (optional) (₹)" type="number" {...register('lumpsumAmount', { valueAsNumber: true })} />
          <Button type="submit" disabled={isSubmitting}>Compare</Button>
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
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">SIP Total Value</h3>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100"><AnimatedNumber key={`sipv-${displayMode}`} value={result.sip.totalValue} format={displayMode==='full' ? formatCurrency : formatCompactCurrency} /></p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/30 border border-transparent dark:border-white/10 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Lumpsum Total Value</h3>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100"><AnimatedNumber key={`lumv-${displayMode}`} value={result.lumpsum.totalValue} format={displayMode==='full' ? formatCurrency : formatCompactCurrency} /></p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/30 border border-transparent dark:border-white/10 p-4 rounded-lg sm:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Initial Lumpsum Compared</h3>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100"><AnimatedNumber key={`luminit-${displayMode}`} value={result.lumpsum.initialAmount} format={displayMode==='full' ? formatCurrency : formatCompactCurrency} /></p>
              </div>
            </div>

            {chartData && (
              <div className="p-4 rounded-lg shadow border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.06] w-full h-80 sm:h-96">
                <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, animation: { duration: 600, easing: 'easeOutQuart' }, plugins: { legend: { position: 'bottom', labels: { color: 'rgba(107,114,128,0.9)', boxWidth: 12, usePointStyle: true } }, title: { display: true, text: 'SIP vs Lumpsum Growth', color: 'rgba(75,85,99,1)', font: { weight: 600 } }, tooltip: { callbacks: { label: (ctx: TooltipItem<'line'>) => `${ctx.dataset.label}: ₹${Number(ctx.parsed.y).toLocaleString('en-IN')}` } } }, scales: { x: { grid: { color: 'rgba(148,163,184,0.15)' }, ticks: { color: 'rgba(107,114,128,0.9)' } }, y: { beginAtZero: true, grid: { color: 'rgba(148,163,184,0.15)' }, ticks: { color: 'rgba(107,114,128,0.9)', callback: (v: number | string) => `₹${Number(v).toLocaleString('en-IN')}` } } } }} />
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
