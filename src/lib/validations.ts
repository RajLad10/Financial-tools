import { z } from 'zod';

export const sipFormSchema = z.object({
  monthlyInvestment: z
    .number()
    .min(500, 'Monthly investment must be at least ₹500')
    .max(10000000, 'Monthly investment cannot exceed ₹1 Crore'),
  years: z
    .number()
    .min(1, 'Investment period must be at least 1 year')
    .max(30, 'Investment period cannot exceed 30 years'),
  expectedReturn: z
    .number()
    .min(1, 'Expected return must be at least 1%')
    .max(30, 'Expected return cannot exceed 30%'),
});

export const emiFormSchema = z.object({
  loanAmount: z
    .number()
    .min(10000, 'Loan amount must be at least ₹10,000')
    .max(100000000, 'Loan amount cannot exceed ₹10 Crore'),
  interestRate: z
    .number()
    .min(1, 'Interest rate must be at least 1%')
    .max(30, 'Interest rate cannot exceed 30%'),
  tenureInYears: z
    .number()
    .min(1, 'Loan tenure must be at least 1 year')
    .max(30, 'Loan tenure cannot exceed 30 years'),
});

export type SIPFormData = z.infer<typeof sipFormSchema>;
export type EMIFormData = z.infer<typeof emiFormSchema>;
