import type { Metadata } from 'next';
import { EMICalculator } from '@/components/calculators/EMICalculator';
import { LoanComparisonCalculator } from '@/components/calculators/LoanComparisonCalculator';
import { PrepaymentCalculator } from '@/components/calculators/PrepaymentCalculator';
import { LoanAffordabilityCalculator } from '@/components/calculators/LoanAffordabilityCalculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

export const metadata: Metadata = {
  title: 'EMI Calculator — Loan EMI, Interest & Total Payment',
  description:
    'Free loan EMI calculator that shows monthly EMI, total interest, and total payment. Visualize yearly principal vs interest with stacked charts.',
  alternates: { canonical: '/tools/emi' },
  keywords: [
    'EMI calculator',
    'loan calculator',
    'home loan EMI',
    'car loan EMI',
    'personal loan EMI',
  ],
  openGraph: {
    title: 'EMI Calculator — Loan EMI, Interest & Total Payment',
    description:
      'Compute monthly EMI and visualize yearly breakup. Plan loans with clarity using FinCalc.',
    url: '/tools/emi',
  },
  twitter: {
    title: 'EMI Calculator — Loan EMI, Interest & Total Payment',
    description:
      'Compute monthly EMI and visualize yearly breakup. Plan loans with clarity using FinCalc.',
    card: 'summary_large_image',
  },
};

export default function EMIPage() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://financial-tools-blush.vercel.app').replace(/\/$/, '');
  const faq = [
    {
      q: 'What is an EMI?',
      a: 'EMI is the fixed monthly payment for a loan, covering both principal and interest.',
    },
    {
      q: 'How is EMI calculated?',
      a: 'We compute EMI using the standard amortization formula with monthly compounding based on your rate and tenure.',
    },
    {
      q: 'Can I use this EMI calculator for different loans?',
      a: 'Yes. It works for home, car, personal and other loans with fixed interest rates.',
    },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Tools',
        item: `${base}/tools`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'EMI Calculator',
        item: `${base}/tools/emi`,
      },
    ],
  };

  const appJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'FinCalc EMI Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: `${base}/tools/emi`,
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
  };

  return (
    <div className="py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            EMI Calculator
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Calculate your monthly EMI with yearly breakup and charts.
          </p>
        </div>

        {/* EMI calculators */}
        <div className="flex justify-center mb-6">
          <Tabs defaultValue="standard" className="max-w-5xl mx-auto w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="p-0 grid w-full max-w-2xl grid-cols-4">
                <TabsTrigger value="standard">Standard EMI</TabsTrigger>
                <TabsTrigger value="compare">Loan Comparison</TabsTrigger>
                <TabsTrigger value="prepay">Prepayment</TabsTrigger>
                <TabsTrigger value="afford">Affordability</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="standard">
              <div className="card-surface elevation-1 p-4 sm:p-6">
                <EMICalculator />
              </div>
            </TabsContent>
            <TabsContent value="compare">
              <div className="card-surface elevation-1 p-4 sm:p-6">
                <LoanComparisonCalculator />
              </div>
            </TabsContent>
            <TabsContent value="prepay">
              <div className="card-surface elevation-1 p-4 sm:p-6">
                <PrepaymentCalculator />
              </div>
            </TabsContent>
            <TabsContent value="afford">
              <div className="card-surface elevation-1 p-4 sm:p-6">
                <LoanAffordabilityCalculator />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Improved info/guide section */}
        <section className="max-w-5xl mx-auto mt-10">
          {/* Quick info cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="card-surface elevation-1 p-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">How to use</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Enter principal, annual rate, and tenure. We compute your EMI, total interest, and total payment. Charts show yearly principal vs interest.</p>
            </div>
            <div className="card-surface elevation-1 p-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">EMI formula</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300"><span className="font-mono">EMI = [P × R × (1+R)^N] / [(1+R)^N − 1]</span></p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">P: Principal, R: monthly rate, N: months</p>
            </div>
            <div className="card-surface elevation-1 p-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Reducing balance</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Interest is charged on outstanding principal after each EMI. This is what lenders typically use and what our calculators assume.</p>
            </div>
          </div>

          {/* Accordion */}
          <div className="mt-6 space-y-3">
            <details className="card-surface elevation-1 p-5 group open:elevation-2 transition">
              <summary className="cursor-pointer list-none flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Understanding EMI</span>
                <span className="text-gray-500 group-open:rotate-180 transition">▾</span>
              </summary>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                <p>Each EMI has two parts: principal (reduces balance) and interest (cost of borrowing). Early EMIs are interest-heavy; later EMIs are principal-heavy. This pattern is the amortization schedule.</p>
              </div>
            </details>

            <details className="card-surface elevation-1 p-5 group open:elevation-2 transition">
              <summary className="cursor-pointer list-none flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Impact of Prepayment</span>
                <span className="text-gray-500 group-open:rotate-180 transition">▾</span>
              </summary>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                <p>Part-prepayment reduces your outstanding principal. You can either keep EMI the same to finish earlier (reduce tenure), or keep tenure the same to lower EMI. Reducing tenure usually saves more total interest.</p>
              </div>
            </details>

            <details className="card-surface elevation-1 p-5 group open:elevation-2 transition">
              <summary className="cursor-pointer list-none flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Tips to lower EMI burden</span>
                <span className="text-gray-500 group-open:rotate-180 transition">▾</span>
              </summary>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Higher down payment:</strong> Lowers principal and EMI.</li>
                  <li><strong>Longer tenure:</strong> Lowers EMI but raises total interest.</li>
                  <li><strong>Negotiate rate:</strong> Small rate drops save big over time.</li>
                  <li><strong>Good credit score:</strong> Often qualifies for better rates.</li>
                  <li><strong>Balance transfer:</strong> Move to lower-rate lender if beneficial.</li>
                </ul>
              </div>
            </details>

            <details className="card-surface elevation-1 p-5 group open:elevation-2 transition">
              <summary className="cursor-pointer list-none flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Related tools & disclaimer</span>
                <span className="text-gray-500 group-open:rotate-180 transition">▾</span>
              </summary>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                <p>Try our <a href="/tools/sip" className="text-blue-600 dark:text-blue-400 hover:underline">SIP Calculator</a> for investments, or browse more on the <a href="/tools" className="text-blue-600 dark:text-blue-400 hover:underline">Financial Tools</a> page.</p>
                <p className="mt-2">This tool is for education only. Loan terms and fees vary by lender. Confirm with your bank. Consult a financial advisor for personal recommendations.</p>
              </div>
            </details>
          </div>
        </section>
      </div>
    </div>
  );
}
