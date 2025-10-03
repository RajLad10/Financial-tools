'use client';

import { useState } from 'react';
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
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';

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

export function EMICalculator() {
  const [result, setResult] = useState<EMICalculationResult | null>(null);

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

      <div className="grid md:grid-cols-2 gap-8">
        <div>
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
                    Monthly EMI
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ₹{Math.round(result.emi).toLocaleString()}
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-950/30 border border-transparent dark:border-white/10 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Total Interest
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ₹{Math.round(result.totalInterest).toLocaleString()}
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/30 border border-transparent dark:border-white/10 p-4 rounded-lg col-span-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Total Payment
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ₹{Math.round(result.totalPayment).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {pieChartData && (
                  <div className="p-4 rounded-lg shadow border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.06]">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">
                      Payment Breakup
                    </h3>
                    <Pie data={pieChartData} />
                  </div>
                )}

                {barChartData && (
                  <div className="p-4 rounded-lg shadow border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.06]">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-4">
                      Yearly Payments
                    </h3>
                    <Bar
                      data={barChartData}
                      options={{
                        responsive: true,
                        scales: {
                          x: {
                            stacked: true,
                          },
                          y: {
                            stacked: true,
                            ticks: {
                              callback: (value) => `₹${Number(value).toLocaleString()}`,
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
    </div>
  );
}
