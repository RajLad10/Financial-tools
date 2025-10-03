import type { Metadata } from 'next';
import { EMICalculator } from '@/components/calculators/EMICalculator';
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

  return (
    <div className="py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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

        {/* Quick switch tabs to related tools */}
        <div className="flex justify-center mb-6">
          <Tabs defaultValue="emi" className="max-w-5xl mx-auto w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="p-0 grid w-full max-w-md grid-cols-2">
                <TabsTrigger asChild value="sip">
                  <a href="/tools/sip">SIP Calculator</a>
                </TabsTrigger>
                <TabsTrigger value="emi">EMI Calculator</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="emi">
              <div className="card-surface elevation-1 p-4 sm:p-6">
                <EMICalculator />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* SEO content */}
        <section className="prose dark:prose-invert max-w-3xl mx-auto mt-10">
          <h2>How this EMI calculator helps</h2>
          <p>
            Enter loan amount, interest rate, and tenure to compute your monthly
            EMI along with total interest and payment. The chart shows yearly
            principal vs interest.
          </p>
          <h3>Disclaimer</h3>
          <p>
            This tool is for educational purposes. Loan terms vary by lender;
            confirm with your bank before making decisions.
          </p>
        </section>
      </div>
    </div>
  );
}
