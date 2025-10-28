'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, animate, useMotionValue } from 'framer-motion';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { calculateAffordableLoan } from '@/lib/calculations';

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
  affordableEmi: z.number().positive('Enter a valid affordable EMI'),
  interestRate: z.number().positive('Enter a valid interest rate'),
  tenureYears: z.number().positive('Enter a valid tenure'),
});

type FormT = z.infer<typeof schema>;

export function LoanAffordabilityCalculator() {
  const { register, reset, control, formState: { errors } } = useForm<FormT>({
    resolver: zodResolver(schema),
    defaultValues: {
      affordableEmi: 25000,
      interestRate: 8.5,
      tenureYears: 20,
    },
  });

  const [res, setRes] = useState<{ eligibleLoan: number; totalPayment: number; totalInterest: number } | null>(null);

  const { affordableEmi, interestRate, tenureYears } = useWatch({ control });
  useEffect(() => {
    if (Number.isFinite(affordableEmi) && Number.isFinite(interestRate) && Number.isFinite(tenureYears)) {
      try {
        const r = calculateAffordableLoan(affordableEmi as number, interestRate as number, tenureYears as number);
        setRes(r);
      } catch {
        setRes(null);
      }
    } else {
      setRes(null);
    }
  }, [affordableEmi, interestRate, tenureYears]);

  return (
    <div className="space-y-6">
      <form className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Affordable Monthly EMI (₹)" type="number" {...register('affordableEmi', { valueAsNumber: true })} error={errors.affordableEmi?.message} />
          <Input label="Interest Rate (%)" type="number" step="0.01" {...register('interestRate', { valueAsNumber: true })} error={errors.interestRate?.message} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Tenure (Years)" type="number" {...register('tenureYears', { valueAsNumber: true })} error={errors.tenureYears?.message} />
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => reset()}>Reset</Button>
        </div>
      </form>

      {res && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid sm:grid-cols-3 gap-4">
          <div className="card-surface p-4">
            <h4 className="text-sm text-gray-600 dark:text-gray-300">Eligible Loan Amount</h4>
            <div className="text-2xl font-semibold"><AnimatedNumber value={res.eligibleLoan} /></div>
          </div>
          <div className="card-surface p-4">
            <h4 className="text-sm text-gray-600 dark:text-gray-300">Total Interest</h4>
            <div className="text-2xl font-semibold"><AnimatedNumber value={res.totalInterest} /></div>
          </div>
          <div className="card-surface p-4">
            <h4 className="text-sm text-gray-600 dark:text-gray-300">Total Payment</h4>
            <div className="text-2xl font-semibold"><AnimatedNumber value={res.totalPayment} /></div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
