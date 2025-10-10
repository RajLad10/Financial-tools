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
