'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  type TooltipItem,
} from 'chart.js';
const Pie = dynamic(() => import('react-chartjs-2').then((m) => m.Pie), { ssr: false });
const Bar = dynamic(() => import('react-chartjs-2').then((m) => m.Bar), { ssr: false });
import { animate, motion, useMotionValue } from 'framer-motion';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateEMI, type EMICalculationResult } from '@/lib/calculations';
import { emiFormSchema, type EMIFormData } from '@/lib/validations';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Formatters and animated number (match SIP behavior)
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
    return () => {
      controls.stop();
      unsub();
    };
  }, [value, duration, count, format]);
  return <span>{display}</span>;
}

export function EMICalculator() {
  const [result, setResult] = useState<EMICalculationResult | null>(null);
  const [displayMode, setDisplayMode] = useState<'full'|'compact'>('full');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EMIFormData>({
    resolver: zodResolver(emiFormSchema),
    defaultValues: {
      loanAmount: 1000000,
      interestRate: 10,
      tenureInYears: 20,
    },
  });

  const onSubmit = (data: EMIFormData) => {
    const result = calculateEMI(
      data.loanAmount,
      data.interestRate,
      data.tenureInYears
    );
    setResult(result);
  };

  const pieChartData = result
    ? {
        labels: ['Principal Amount', 'Total Interest'],
        datasets: [
          {
            data: [result.emi * 12 * result.monthlyData.length - result.totalInterest, result.totalInterest],
            backgroundColor: ['rgba(59, 130, 246, 0.5)', 'rgba(239, 68, 68, 0.5)'],
            borderColor: ['rgb(59, 130, 246)', 'rgb(239, 68, 68)'],
            borderWidth: 1,
          },
        ],
      }
    : null;

  const yearlyData = result
    ? Array.from({ length: Math.ceil(result.monthlyData.length / 12) }, (_, yearIndex) => {
        const yearlyInterest = result.monthlyData
          .slice(yearIndex * 12, (yearIndex + 1) * 12)
          .reduce((sum, month) => sum + month.interest, 0);
        const yearlyPrincipal = result.monthlyData
          .slice(yearIndex * 12, (yearIndex + 1) * 12)
          .reduce((sum, month) => sum + month.principal, 0);
        return { yearlyInterest, yearlyPrincipal };
      })
    : null;

  const barChartData = yearlyData
    ? {
        labels: Array.from({ length: yearlyData.length }, (_, i) => `Year ${i + 1}`),
        datasets: [
          {
            label: 'Principal',
            data: yearlyData.map((year) => year.yearlyPrincipal),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1,
          },
          {
            label: 'Interest',
            data: yearlyData.map((year) => year.yearlyInterest),
            backgroundColor: 'rgba(239, 68, 68, 0.5)',
            borderColor: 'rgb(239, 68, 68)',
            borderWidth: 1,
          },
        ],
      }
    : null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        EMI Calculator
      </h1>

      <div className="space-y-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Loan Amount (₹)"
              type="number"
              {...register('loanAmount', { valueAsNumber: true })}
              error={errors.loanAmount?.message}
            />

            <Input
              label="Interest Rate (%)"
              type="number"
              step="0.1"
              {...register('interestRate', { valueAsNumber: true })}
              error={errors.interestRate?.message}
            />

            <Input
              label="Loan Tenure (Years)"
              type="number"
              {...register('tenureInYears', { valueAsNumber: true })}
              error={errors.tenureInYears?.message}
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
                    Monthly EMI
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap overflow-x-auto tabular-nums tracking-tight pr-1" title={formatCurrency(Math.round(result.emi))}>
                    <AnimatedNumber key={`emi-${displayMode}`} value={Math.round(result.emi)} format={displayMode==='full' ? formatCurrency : formatCompactCurrency} />
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-950/30 border border-transparent dark:border-white/10 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Total Interest
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap overflow-x-auto tabular-nums tracking-tight pr-1" title={formatCurrency(Math.round(result.totalInterest))}>
                    <AnimatedNumber key={`interest-${displayMode}`} value={Math.round(result.totalInterest)} format={displayMode==='full' ? formatCurrency : formatCompactCurrency} />
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/30 border border-transparent dark:border-white/10 p-4 rounded-lg sm:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Total Payment
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap overflow-x-auto tabular-nums tracking-tight pr-1" title={formatCurrency(Math.round(result.totalPayment))}>
                    <AnimatedNumber key={`total-${displayMode}`} value={Math.round(result.totalPayment)} format={displayMode==='full' ? formatCurrency : formatCompactCurrency} />
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {pieChartData && (
                  <div className="p-4 rounded-lg shadow border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.06] w-full">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-4">Payment Breakup</h3>
                    <Pie
                      data={pieChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              color: 'rgba(107,114,128,0.9)',
                              boxWidth: 12,
                              usePointStyle: true,
                            },
                          },
                          tooltip: {
                            callbacks: {
                              label: (ctx: TooltipItem<'pie'>) => `${ctx.label}: ₹${Number(ctx.parsed).toLocaleString('en-IN')}`,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                )}

                {barChartData && (
                  <div className="p-4 rounded-lg shadow border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.06] w-full h-80 sm:h-96">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-4">Yearly Payments</h3>
                    <Bar
                      data={barChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: { mode: 'index', intersect: false },
                        animation: { duration: 600, easing: 'easeOutQuart' },
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              color: 'rgba(107,114,128,0.9)',
                              boxWidth: 12,
                              usePointStyle: true,
                            },
                          },
                          tooltip: {
                            callbacks: {
                              label: (ctx: TooltipItem<'bar'>) => `${ctx.dataset.label}: ₹${Number(ctx.parsed.y).toLocaleString('en-IN')}`,
                            },
                          },
                        },
                        scales: {
                          x: {
                            stacked: true,
                            grid: { color: 'rgba(148,163,184,0.15)' },
                            ticks: { color: 'rgba(107,114,128,0.9)' },
                          },
                          y: {
                            stacked: true,
                            grid: { color: 'rgba(148,163,184,0.15)' },
                            ticks: {
                              color: 'rgba(107,114,128,0.9)',
                              callback: (value: number | string) => `₹${Number(value).toLocaleString('en-IN')}`,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
      </div>
    </div>
  );
}
