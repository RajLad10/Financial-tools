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
