'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { animate, useMotionValue } from 'framer-motion';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateIncomeTaxNewRegime } from '@/lib/calculations';

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
  grossIncome: z.number().min(0, 'Enter a valid income'),
  applyStandardDeduction: z.boolean(),
  standardDeductionAmount: z.number().min(0).max(50000),
});

type FormT = z.infer<typeof schema>;

export function IncomeTaxNewCalculator() {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<FormT>({
    resolver: zodResolver(schema),
    defaultValues: { grossIncome: 1200000, applyStandardDeduction: true, standardDeductionAmount: 50000 },
  });

  const [res, setRes] = useState<ReturnType<typeof calculateIncomeTaxNewRegime> | null>(null);

  const onSubmit = (data: FormT) => {
    const r = calculateIncomeTaxNewRegime(
      data.grossIncome,
      { standardDeduction: data.applyStandardDeduction, standardDeductionAmount: data.standardDeductionAmount }
    );
    setRes(r);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Gross Income (₹)" type="number" {...register('grossIncome', { valueAsNumber: true })} error={errors.grossIncome?.message} />
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
              <input type="checkbox" {...register('applyStandardDeduction')} /> Apply Standard Deduction
            </label>
            {watch('applyStandardDeduction') && (
              <div className="mt-2">
                <Input label="Standard Deduction (₹)" type="number" {...register('standardDeductionAmount', { valueAsNumber: true })} error={errors.standardDeductionAmount?.message} />
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>Calculate</Button>
          <Button type="button" variant="secondary" onClick={() => reset()}>Reset</Button>
        </div>
      </form>

      {res && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-surface p-4">
            <h4 className="text-sm text-gray-600 dark:text-gray-300">Taxable Income</h4>
            <div className="text-2xl font-semibold"><AnimatedNumber value={res.taxableIncome} /></div>
          </div>
          <div className="card-surface p-4">
            <h4 className="text-sm text-gray-600 dark:text-gray-300">Slab Tax</h4>
            <div className="text-2xl font-semibold"><AnimatedNumber value={res.slabTax} /></div>
          </div>
          <div className="card-surface p-4">
            <h4 className="text-sm text-gray-600 dark:text-gray-300">Health & Education Cess (4%)</h4>
            <div className="text-2xl font-semibold"><AnimatedNumber value={res.healthEducationCess} /></div>
          </div>
          <div className="card-surface p-4">
            <h4 className="text-sm text-gray-600 dark:text-gray-300">Total Tax</h4>
            <div className="text-2xl font-semibold"><AnimatedNumber value={res.totalTax} /></div>
          </div>
        </div>
      )}
    </div>
  );
}
