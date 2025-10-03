'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
  type ScriptableContext,
  type TooltipItem,
} from 'chart.js';
const Line = dynamic(() => import('react-chartjs-2').then((m) => m.Line), { ssr: false });
const Pie = dynamic(() => import('react-chartjs-2').then((m) => m.Pie), { ssr: false });
import { animate, motion, useMotionValue } from 'framer-motion';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateSIP, type SIPCalculationResult } from '@/lib/calculations';
import { sipFormSchema, type SIPFormData } from '@/lib/validations';

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

// Format helpers
const formatCurrency = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const formatCompactCurrency = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(Math.round(n));

// Animated number component for counting up values
function AnimatedNumber({
  value,
  duration = 0.8,
  format = formatCurrency,
}: {
  value: number;
  duration?: number;
  format?: (n: number) => string;
}) {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState<string>(format(0));

  useEffect(() => {
    const controls = animate(count, value, { duration, ease: 'easeOut' });
    const unsubscribe = count.on('change', (v) => {
      setDisplay(format(Number(v)));
    });
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, duration, count, format]);

  return <span>{display}</span>;
}

export function SIPCalculator() {
  const [result, setResult] = useState<SIPCalculationResult | null>(null);
  const [displayMode, setDisplayMode] = useState<'full' | 'compact'>('full');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SIPFormData>({
    resolver: zodResolver(sipFormSchema),
    defaultValues: {
      monthlyInvestment: 5000,
      years: 10,
      expectedReturn: 12,
    },
  });

  const onSubmit = (data: SIPFormData) => {
    const result = calculateSIP(
      data.monthlyInvestment,
      data.years,
      data.expectedReturn
    );
    setResult(result);
  };

  const chartData = result ? {
    labels: result.monthlyData.map((data) => `Year ${Math.ceil(data.month / 12)}`),
    datasets: [
      {
        label: 'Investment',
        data: result.monthlyData.map((data) => data.investment),
        borderColor: 'rgb(107, 114, 128)', // gray-500
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.35,
        fill: true,
        backgroundColor: (ctx: ScriptableContext<'line'>) => {
          const chart = ctx.chart;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return 'rgba(107,114,128,0.15)';
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(107,114,128,0.25)');
          gradient.addColorStop(1, 'rgba(107,114,128,0.05)');
          return gradient;
        },
      },
      {
        label: 'Expected Value',
        data: result.monthlyData.map((data) => data.value),
        borderColor: 'rgb(59, 130, 246)', // blue-500
        borderWidth: 2.5,
        pointRadius: 0,
        tension: 0.35,
        fill: true,
        backgroundColor: (ctx: ScriptableContext<'line'>) => {
          const chart = ctx.chart;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return 'rgba(59,130,246,0.15)';
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(59,130,246,0.35)');
          gradient.addColorStop(1, 'rgba(59,130,246,0.05)');
          return gradient;
        },
      },
    ],
  } : null;

  const pieData = result ? {
    labels: ['Total Investment', 'Expected Returns'],
    datasets: [
      {
        data: [result.totalInvestment, result.expectedReturns],
        backgroundColor: ['rgba(59,130,246,0.5)', 'rgba(16,185,129,0.5)'],
        borderColor: ['rgb(59,130,246)', 'rgb(16,185,129)'],
        borderWidth: 1,
      },
    ],
  } : null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        SIP Calculator
      </h1>

      <div className="space-y-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Monthly Investment (₹)"
              type="number"
              {...register('monthlyInvestment', { valueAsNumber: true })}
              error={errors.monthlyInvestment?.message}
            />

            <Input
              label="Time Period (Years)"
              type="number"
              {...register('years', { valueAsNumber: true })}
              error={errors.years?.message}
            />

            <Input
              label="Expected Return (%)"
              type="number"
              step="0.1"
              {...register('expectedReturn', { valueAsNumber: true })}
              error={errors.expectedReturn?.message}
            />

            <Button type="submit" disabled={isSubmitting}>
              Calculate
            </Button>
        </form>

        {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-end">
                <div className="inline-flex rounded-md border border-gray-200 dark:border-white/10 overflow-hidden">
                  <button type="button" aria-pressed={displayMode==='full'} onClick={() => setDisplayMode('full')} className={`px-3 py-1 text-sm ${displayMode==='full' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-600 dark:text-gray-300'}`}>Full</button>
                  <button type="button" aria-pressed={displayMode==='compact'} onClick={() => setDisplayMode('compact')} className={`px-3 py-1 text-sm ${displayMode==='compact' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-600 dark:text-gray-300'}`}>Compact</button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-transparent dark:border-white/10 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Total Investment
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap overflow-x-auto tabular-nums tracking-tight pr-1" title={formatCurrency(result.totalInvestment)}>
                    <AnimatedNumber
                      key={`ti-${displayMode}`}
                      value={result.totalInvestment}
                      format={displayMode==='full' ? formatCurrency : formatCompactCurrency}
                    />
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 border border-transparent dark:border-white/10 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Expected Returns
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap overflow-x-auto tabular-nums tracking-tight pr-1" title={formatCurrency(result.expectedReturns)}>
                    <AnimatedNumber
                      key={`er-${displayMode}`}
                      value={result.expectedReturns}
                      format={displayMode==='full' ? formatCurrency : formatCompactCurrency}
                    />
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/30 border border-transparent dark:border-white/10 p-4 rounded-lg sm:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Total Value
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap overflow-x-auto tabular-nums tracking-tight pr-1" title={formatCurrency(result.totalValue)}>
                    <AnimatedNumber
                      key={`tv-${displayMode}`}
                      value={result.totalValue}
                      format={displayMode==='full' ? formatCurrency : formatCompactCurrency}
                    />
                  </p>
                </div>
              </div>

              {pieData && (
                <div className="p-4 rounded-lg shadow border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.06] w-full">
                  <Pie
                    data={pieData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: { color: 'rgba(107,114,128,0.9)', boxWidth: 12, usePointStyle: true },
                        },
                        tooltip: {
                          callbacks: {
                            label: (ctx: TooltipItem<'pie'>) => `${ctx.label}: ₹${Number(ctx.parsed).toLocaleString('en-IN')}`,
                          },
                        },
                        title: { display: true, text: 'Investment vs Returns', color: 'rgba(75,85,99,1)', font: { weight: 600 } },
                      },
                    }}
                  />
                </div>
              )}

              {chartData && (
                <div className="p-4 rounded-lg shadow border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.06] w-full h-80 sm:h-96">
                  <Line
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      interaction: { mode: 'index' as const, intersect: false },
                      animation: { duration: 600, easing: 'easeOutQuart' },
                      plugins: {
                        legend: {
                          position: 'bottom' as const,
                          labels: {
                            color: 'rgba(107,114,128,0.9)',
                            boxWidth: 12,
                            usePointStyle: true,
                          },
                        },
                        title: {
                          display: true,
                          text: 'Investment Growth Over Time',
                          color: 'rgba(75,85,99,1)',
                          font: { weight: 600 },
                        },
                        tooltip: {
                          callbacks: {
                            label: (ctx: TooltipItem<'line'>) => `${ctx.dataset.label}: ₹${Number(ctx.parsed.y).toLocaleString()}`,
                          },
                        },
                      },
                      scales: {
                        x: {
                          grid: { color: 'rgba(148,163,184,0.15)' },
                          ticks: { color: 'rgba(107,114,128,0.9)' },
                        },
                        y: {
                          beginAtZero: true,
                          grid: { color: 'rgba(148,163,184,0.15)' },
                          ticks: {
                            color: 'rgba(107,114,128,0.9)',
                            callback: (value: number | string) => `₹${Number(value).toLocaleString()}`,
                          },
                        },
                      },
                    }}
                  />
                </div>
              )}
            </motion.div>
          )}
      </div>
    </div>
  );
}
