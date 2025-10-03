'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateSIP, type SIPCalculationResult } from '@/lib/calculations';
import { sipFormSchema, type SIPFormData } from '@/lib/validations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function SIPCalculator() {
  const [result, setResult] = useState<SIPCalculationResult | null>(null);

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
        borderColor: 'rgb(75, 85, 99)',
        backgroundColor: 'rgba(75, 85, 99, 0.5)',
      },
      {
        label: 'Expected Value',
        data: result.monthlyData.map((data) => data.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  } : null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        SIP Calculator
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
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
        </div>

        <div>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-transparent dark:border-white/10 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Total Investment
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ₹{result.totalInvestment.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 border border-transparent dark:border-white/10 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Expected Returns
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ₹{result.expectedReturns.toLocaleString()}
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/30 border border-transparent dark:border-white/10 p-4 rounded-lg col-span-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Total Value
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ₹{result.totalValue.toLocaleString()}
                  </p>
                </div>
              </div>

              {chartData && (
                <div className="p-4 rounded-lg shadow border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.06]">
                  <Line
                    data={chartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'bottom' as const,
                        },
                        title: {
                          display: true,
                          text: 'Investment Growth Over Time',
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: (value) => `₹${Number(value).toLocaleString()}`,
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
    </div>
  );
}
