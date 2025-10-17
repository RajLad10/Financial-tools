export interface SIPCalculationResult {
  totalInvestment: number;
  expectedReturns: number;
  totalValue: number;
  monthlyData: Array<{
    month: number;
    investment: number;
    value: number;
  }>;
}

// --- FD Calculator ---
export function calculateFD(
  principal: number,
  annualRate: number,
  years: number,
  compoundingPerYear: number = 4 // default quarterly compounding common in India
): { maturityAmount: number; interestEarned: number } {
  const r = annualRate / 100;
  const n = compoundingPerYear;
  const t = years;
  const maturityAmount = principal * Math.pow(1 + r / n, n * t);
  const interestEarned = maturityAmount - principal;
  return { maturityAmount, interestEarned };
}

// --- RD Calculator (monthly deposit with monthly compounding simulation) ---
export function calculateRD(
  monthlyDeposit: number,
  annualRate: number,
  years: number
): { maturityAmount: number; totalDeposit: number; interestEarned: number } {
  const rMonthly = annualRate / (12 * 100);
  const months = Math.max(1, Math.round(years * 12));
  let value = 0;
  let totalDeposit = 0;
  for (let m = 1; m <= months; m++) {
    // deposit at end of month, then compound to maturity
    value = (value + monthlyDeposit) * (1 + rMonthly);
    totalDeposit += monthlyDeposit;
  }
  const maturityAmount = value;
  const interestEarned = maturityAmount - totalDeposit;
  return { maturityAmount, totalDeposit, interestEarned };
}

// --- Income Tax (India) FY 2024-25 approximation ---
export interface TaxBreakdown {
  taxableIncome: number;
  slabTax: number;
  healthEducationCess: number;
  totalTax: number;
  rebateApplied: boolean;
}

function slabTax(amount: number, slabs: Array<{ upTo: number | null; rate: number }>): number {
  let tax = 0;
  let prev = 0;
  for (const s of slabs) {
    const cap = s.upTo ?? Infinity;
    if (amount <= prev) break;
    const taxableHere = Math.max(0, Math.min(amount, cap) - prev);
    tax += taxableHere * s.rate;
    prev = cap;
    if (cap === Infinity) break;
  }
  return tax;
}

// New Regime slabs FY 2024-25 (0-3L 0%, 3-6L 5%, 6-9L 10%, 9-12L 15%, 12-15L 20%, >15L 30%)
const NEW_REGIME_SLABS = [
  { upTo: 300000, rate: 0 },
  { upTo: 600000, rate: 0.05 },
  { upTo: 900000, rate: 0.10 },
  { upTo: 1200000, rate: 0.15 },
  { upTo: 1500000, rate: 0.20 },
  { upTo: null, rate: 0.30 },
];

// Old Regime slabs FY 2024-25 (0-2.5L 0%, 2.5-5L 5%, 5-10L 20%, >10L 30%)
const OLD_REGIME_SLABS = [
  { upTo: 250000, rate: 0 },
  { upTo: 500000, rate: 0.05 },
  { upTo: 1000000, rate: 0.20 },
  { upTo: null, rate: 0.30 },
];

export function calculateIncomeTaxNewRegime(
  grossIncome: number,
  options?: { standardDeduction?: boolean; standardDeductionAmount?: number }
): TaxBreakdown {
  const stdDeduction = options?.standardDeduction ? (options?.standardDeductionAmount ?? 50000) : 0;
  const taxable = Math.max(0, grossIncome - stdDeduction);
  // Section 87A rebate: taxable <= 7,00,000 => tax rebate up to full tax
  let tax = slabTax(taxable, NEW_REGIME_SLABS);
  let rebateApplied = false;
  if (taxable <= 700000) {
    tax = 0;
    rebateApplied = true;
  }
  const cess = 0.04 * tax;
  return { taxableIncome: taxable, slabTax: tax, healthEducationCess: cess, totalTax: tax + cess, rebateApplied };
}

export function calculateIncomeTaxOldRegime(
  grossIncome: number,
  deductions?: { standardDeduction?: number; section80C?: number; section80D?: number; otherDeductions?: number }
): TaxBreakdown {
  const std = deductions?.standardDeduction ?? 50000;
  const d80c = Math.min(deductions?.section80C ?? 0, 150000);
  const d80d = deductions?.section80D ?? 0;
  const other = deductions?.otherDeductions ?? 0;
  const taxable = Math.max(0, grossIncome - std - d80c - d80d - other);
  // Section 87A rebate: taxable <= 5,00,000 => tax rebate up to full tax
  let tax = slabTax(taxable, OLD_REGIME_SLABS);
  let rebateApplied = false;
  if (taxable <= 500000) {
    tax = 0;
    rebateApplied = true;
  }
  const cess = 0.04 * tax;
  return { taxableIncome: taxable, slabTax: tax, healthEducationCess: cess, totalTax: tax + cess, rebateApplied };
}

// --- EMI advanced helpers ---
export function calculateMonthlyEMI(
  principalAmount: number,
  interestRate: number,
  tenureInYears: number
): number {
  const r = interestRate / (12 * 100);
  const n = Math.max(1, Math.round(tenureInYears * 12));
  return (
    (principalAmount * r * Math.pow(1 + r, n)) /
    (Math.pow(1 + r, n) - 1)
  );
}

export interface PrepaymentInput {
  principalAmount: number;
  interestRate: number; // annual %
  tenureInYears: number;
  prepaymentAmount: number;
  prepaymentMonth: number; // 1-indexed
  mode: 'reduce_tenure' | 'reduce_emi';
}

export interface PrepaymentResult {
  originalEmi: number;
  newEmi?: number;
  newTenureMonths?: number;
  totalInterestSaved: number;
  newTotalPayment: number;
  before: Array<{ month: number; remaining: number }>;
  after: Array<{ month: number; remaining: number }>;
}

export function simulatePrepayment(input: PrepaymentInput): PrepaymentResult {
  const { principalAmount, interestRate, tenureInYears, prepaymentAmount, prepaymentMonth, mode } = input;
  const r = interestRate / (12 * 100);
  const n = Math.max(1, Math.round(tenureInYears * 12));

  // Build baseline amortization up to full term
  const baseEmi = calculateMonthlyEMI(principalAmount, interestRate, tenureInYears);
  let remaining = principalAmount;
  const before: Array<{ month: number; remaining: number }> = [];
  for (let m = 1; m <= n; m++) {
    const interest = remaining * r;
    const principal = baseEmi - interest;
    remaining = Math.max(0, remaining - principal);
    before.push({ month: m, remaining });
  }
  const baseTotalPayment = baseEmi * n;
  const baseTotalInterest = baseTotalPayment - principalAmount;

  // After-prepayment path
  let rem = principalAmount;
  const after: Array<{ month: number; remaining: number }> = [];

  // First iterate up to prepayment month with baseEmi
  for (let m = 1; m <= Math.min(prepaymentMonth - 1, n); m++) {
    const interest = rem * r;
    const principal = baseEmi - interest;
    rem = Math.max(0, rem - principal);
    after.push({ month: m, remaining: rem });
  }

  // Apply prepayment lump sum at prepaymentMonth
  if (prepaymentMonth >= 1 && prepaymentMonth <= n) {
    rem = Math.max(0, rem - prepaymentAmount);
    after.push({ month: prepaymentMonth, remaining: rem });
  }

  // Continue based on mode
  if (mode === 'reduce_tenure') {
    // keep EMI same, find when remaining hits 0
    let m = Math.max(1, prepaymentMonth);
    while (rem > 0 && m < 6000) { // safe guard
      const interest = rem * r;
      const principal = Math.min(rem, baseEmi - interest);
      rem = Math.max(0, rem - principal);
      m++;
      after.push({ month: m, remaining: rem });
    }
    const newTenureMonths = after[after.length - 1]?.month ?? n;
    // Payments: EMIs paid until prepayment-1, prepayment amount, then EMIs until closure
    const emisBefore = Math.max(0, prepaymentMonth - 1);
    const emisAfter = Math.max(0, newTenureMonths - (prepaymentMonth - 1));
    const newTotalPayment = emisBefore * baseEmi + prepaymentAmount + emisAfter * baseEmi;
    const newTotalInterest = newTotalPayment - principalAmount;
    const totalInterestSaved = baseTotalInterest - newTotalInterest;
    return {
      originalEmi: baseEmi,
      newTenureMonths,
      totalInterestSaved,
      newTotalPayment,
      before,
      after,
    };
  } else {
    // reduce EMI, keep tenure same; compute new EMI for remaining term
    const monthsLeft = Math.max(0, n - (prepaymentMonth - 1));
    const newEmi = monthsLeft > 0
      ? (rem * r * Math.pow(1 + r, monthsLeft)) / (Math.pow(1 + r, monthsLeft) - 1)
      : 0;

    let m = Math.max(1, prepaymentMonth) + 1;
    while (rem > 0 && m <= n) {
      const interest = rem * r;
      const principal = Math.min(rem, newEmi - interest);
      rem = Math.max(0, rem - principal);
      after.push({ month: m, remaining: rem });
      m++;
    }
    const newTotalPayment = (prepaymentMonth - 1) * baseEmi + prepaymentAmount + newEmi * (n - (prepaymentMonth - 1));
    const newTotalInterest = newTotalPayment - principalAmount;
    const totalInterestSaved = baseTotalInterest - newTotalInterest;
    return {
      originalEmi: baseEmi,
      newEmi,
      totalInterestSaved,
      newTotalPayment,
      before,
      after,
    };
  }
}

export function calculateAffordableLoan(
  affordableEmi: number,
  interestRate: number,
  tenureInYears: number
): { eligibleLoan: number; totalPayment: number; totalInterest: number } {
  const r = interestRate / (12 * 100);
  const n = Math.max(1, Math.round(tenureInYears * 12));
  // Invert EMI formula: P = E * ((1+r)^n - 1) / (r * (1+r)^n)
  const numerator = Math.pow(1 + r, n) - 1;
  const denominator = r * Math.pow(1 + r, n);
  const eligibleLoan = (affordableEmi * numerator) / denominator;
  const totalPayment = affordableEmi * n;
  const totalInterest = totalPayment - eligibleLoan;
  return { eligibleLoan, totalPayment, totalInterest };
}
export function calculateSIP(
  monthlyInvestment: number,
  years: number,
  expectedReturn: number
): SIPCalculationResult {
  const monthlyRate = expectedReturn / (12 * 100);
  const totalMonths = years * 12;
  let totalInvestment = 0;
  let totalValue = 0;
  const monthlyData = [];

  for (let month = 1; month <= totalMonths; month++) {
    totalInvestment += monthlyInvestment;
    totalValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate) * (1 + monthlyRate);
    
    monthlyData.push({
      month,
      investment: totalInvestment,
      value: totalValue
    });
  }

  return {
    totalInvestment,
    expectedReturns: totalValue - totalInvestment,
    totalValue,
    monthlyData
  };
}

export interface EMICalculationResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  monthlyData: Array<{
    month: number;
    emi: number;
    principal: number;
    interest: number;
    remainingLoan: number;
  }>;
}

export function calculateEMI(
  principalAmount: number,
  interestRate: number,
  tenureInYears: number
): EMICalculationResult {
  const monthlyRate = interestRate / (12 * 100);
  const totalMonths = tenureInYears * 12;
  const monthlyEMI =
    (principalAmount *
      monthlyRate *
      Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  let remainingLoan = principalAmount;
  const monthlyData = [];
  let totalInterest = 0;

  for (let month = 1; month <= totalMonths; month++) {
    const monthlyInterest = remainingLoan * monthlyRate;
    const monthlyPrincipal = monthlyEMI - monthlyInterest;
    
    totalInterest += monthlyInterest;
    remainingLoan -= monthlyPrincipal;

    monthlyData.push({
      month,
      emi: monthlyEMI,
      principal: monthlyPrincipal,
      interest: monthlyInterest,
      remainingLoan: Math.max(0, remainingLoan)
    });
  }

  return {
    emi: monthlyEMI,
    totalInterest,
    totalPayment: monthlyEMI * totalMonths,
    monthlyData
  };
}

// --- Advanced SIP Variants ---

// Target-based SIP: required monthly SIP to reach a goal corpus with same convention
export interface TargetSIPInput {
  targetAmount: number; // desired corpus at end
  years: number;
  expectedReturn: number; // annual %
}

export interface TargetSIPResult extends SIPCalculationResult {
  requiredMonthlyInvestment: number;
}

export function calculateTargetSIP(input: TargetSIPInput): TargetSIPResult {
  const { targetAmount, years, expectedReturn } = input;
  const monthlyRate = expectedReturn / (12 * 100);
  const totalMonths = Math.max(1, Math.round(years * 12));

  // FV (end-of-period) = P * [((1+r)^n - 1)/r] * (1 + r)
  const factor = ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
  const requiredMonthlyInvestment = targetAmount / factor;

  const base = calculateSIP(requiredMonthlyInvestment, years, expectedReturn);
  return { ...base, requiredMonthlyInvestment };
}

// Step-up SIP: monthly contribution increases annually by stepUpPercent
export interface StepUpSIPResult extends SIPCalculationResult {
  stepUpPercent: number; // annual percent increment
}

export function calculateStepUpSIP(
  monthlyInvestment: number,
  years: number,
  expectedReturn: number,
  stepUpPercent: number
): StepUpSIPResult {
  const monthlyRate = expectedReturn / (12 * 100);
  const totalMonths = Math.max(1, Math.round(years * 12));
  const annualGrowth = stepUpPercent / 100;

  let totalInvestment = 0;
  let totalValue = 0;
  const monthlyData: SIPCalculationResult['monthlyData'] = [];

  for (let month = 1; month <= totalMonths; month++) {
    const yearIndex = Math.floor((month - 1) / 12);
    const currentMonthly = monthlyInvestment * Math.pow(1 + annualGrowth, yearIndex);
    totalInvestment += currentMonthly;

    // Compounding with end-of-month contribution (align with calculateSIP)
    totalValue = totalValue * (1 + monthlyRate) + currentMonthly * (1 + monthlyRate);

    monthlyData.push({ month, investment: totalInvestment, value: totalValue });
  }

  return {
    totalInvestment,
    expectedReturns: totalValue - totalInvestment,
    totalValue,
    monthlyData,
    stepUpPercent,
  };
}

// SIP vs Lumpsum comparison
export interface SIPvsLumpsumResult {
  sip: SIPCalculationResult;
  lumpsum: {
    initialAmount: number;
    totalValue: number;
    monthlyData: Array<{ month: number; value: number }>;
  };
}

export function calculateSIPvsLumpsum(
  monthlyInvestment: number,
  years: number,
  expectedReturn: number,
  lumpsumAmount?: number
): SIPvsLumpsumResult {
  const sip = calculateSIP(monthlyInvestment, years, expectedReturn);
  const monthlyRate = expectedReturn / (12 * 100);
  const totalMonths = Math.max(1, Math.round(years * 12));

  const initialAmount =
    typeof lumpsumAmount === 'number' && lumpsumAmount > 0
      ? lumpsumAmount
      : monthlyInvestment * totalMonths; // match total SIP outlay if not provided

  let v = initialAmount;
  const monthlyData: Array<{ month: number; value: number }> = [];
  for (let month = 1; month <= totalMonths; month++) {
    v = v * (1 + monthlyRate);
    monthlyData.push({ month, value: v });
  }

  return {
    sip,
    lumpsum: {
      initialAmount,
      totalValue: v,
      monthlyData,
    },
  };
}
