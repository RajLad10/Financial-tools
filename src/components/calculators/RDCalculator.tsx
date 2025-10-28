'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { animate, useMotionValue } from 'framer-motion';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateRD } from '@/lib/calculations';

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
  monthlyDeposit: z.number().positive('Enter a valid amount'),
  annualRate: z.number().positive('Enter a valid rate'),
  years: z.number().positive('Enter a valid tenure'),
});

type FormT = z.infer<typeof schema>;

export function RDCalculator() {
  const { register, reset, control, formState: { errors } } = useForm<FormT>({
    resolver: zodResolver(schema),
    defaultValues: { monthlyDeposit: 5000, annualRate: 7.25, years: 5 },
  });

  const [res, setRes] = useState<{ maturityAmount: number; totalDeposit: number; interestEarned: number } | null>(null);

  const { monthlyDeposit, annualRate, years } = useWatch({ control });
  useEffect(() => {
    if (
      Number.isFinite(monthlyDeposit) &&
      Number.isFinite(annualRate) &&
      Number.isFinite(years)
    ) {
      try {
        const r = calculateRD(monthlyDeposit as number, annualRate as number, years as number);
        setRes(r);
      } catch {
        setRes(null);
      }
    } else {
      setRes(null);
    }
  }, [monthlyDeposit, annualRate, years]);

  return (
    <div className="space-y-6">
      <form className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Monthly Deposit (₹)" type="number" {...register('monthlyDeposit', { valueAsNumber: true })} error={errors.monthlyDeposit?.message} />
          <Input label="Annual Interest Rate (%)" type="number" step="0.01" {...register('annualRate', { valueAsNumber: true })} error={errors.annualRate?.message} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Tenure (Years)" type="number" {...register('years', { valueAsNumber: true })} error={errors.years?.message} />
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => reset()}>Reset</Button>
        </div>
      </form>

      {res && (
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="card-surface p-4">
            <h4 className="text-sm text-gray-600 dark:text-gray-300">Maturity Amount</h4>
            <div className="text-2xl font-semibold"><AnimatedNumber value={res.maturityAmount} /></div>
          </div>
          <div className="card-surface p-4">
            <h4 className="text-sm text-gray-600 dark:text-gray-300">Total Deposit</h4>
            <div className="text-2xl font-semibold"><AnimatedNumber value={res.totalDeposit} /></div>
          </div>
          <div className="card-surface p-4">
            <h4 className="text-sm text-gray-600 dark:text-gray-300">Interest Earned</h4>
            <div className="text-2xl font-semibold"><AnimatedNumber value={res.interestEarned} /></div>
          </div>
        </div>
      )}
    </div>
  );
}
