import type { Metadata } from 'next';
import { SIPCalculator } from '@/components/calculators/SIPCalculator';
import { TargetSIPCalculator } from '@/components/calculators/TargetSIPCalculator';
import { StepUpSIPCalculator } from '@/components/calculators/StepUpSIPCalculator';
import { SIPvsLumpsumCalculator } from '@/components/calculators/SIPvsLumpsumCalculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

export const metadata: Metadata = {
  title: 'SIP Calculator — Mutual Fund SIP Return Estimator',
  description:
    'Free online SIP calculator to estimate mutual fund returns. Visualize total investment, expected returns, and total value with charts and yearly breakdown.',
  alternates: { canonical: '/tools/sip' },
  keywords: [
    'SIP calculator',
    'mutual fund calculator',
    'sip return calculator',
    'investment calculator',
    'sip maturity calculator',
  ],
  openGraph: {
    title: 'SIP Calculator — Mutual Fund SIP Return Estimator',
    description:
      'Estimate SIP returns with clear charts and detailed numbers. Plan investments with confidence using FinCalc.',
    url: '/tools/sip',
  },
  twitter: {
    title: 'SIP Calculator — Mutual Fund SIP Return Estimator',
    description:
      'Estimate SIP returns with clear charts and detailed numbers. Plan investments with confidence using FinCalc.',
    card: 'summary_large_image',
  },
};

export default function SIPPage() {
  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            SIP Calculator
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Choose a SIP variant to plan investments effectively.
          </p>
        </div>
        <Tabs defaultValue="simple" className="max-w-5xl mx-auto w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="p-0 grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="simple">Simple</TabsTrigger>
              <TabsTrigger value="target">Target-based</TabsTrigger>
              <TabsTrigger value="stepup">Step-up</TabsTrigger>
              <TabsTrigger value="compare">SIP vs Lumpsum</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="simple">
            <div className="card-surface elevation-1 p-4 sm:p-6">
              <SIPCalculator />
            </div>
          </TabsContent>
          <TabsContent value="target">
            <div className="card-surface elevation-1 p-4 sm:p-6">
              <TargetSIPCalculator />
            </div>
          </TabsContent>
          <TabsContent value="stepup">
            <div className="card-surface elevation-1 p-4 sm:p-6">
              <StepUpSIPCalculator />
            </div>
          </TabsContent>
          <TabsContent value="compare">
            <div className="card-surface elevation-1 p-4 sm:p-6">
              <SIPvsLumpsumCalculator />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
