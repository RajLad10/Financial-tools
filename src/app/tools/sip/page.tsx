import type { Metadata } from 'next';
import { SIPCalculator } from '@/components/calculators/SIPCalculator';
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
  const faq = [
    {
      q: 'What is a SIP calculator?',
      a: 'A SIP calculator estimates the maturity value of periodic investments based on your monthly amount, expected return rate, and time horizon.',
    },
    {
      q: 'How are SIP returns calculated?',
      a: 'We use monthly compounding with the provided expected annual return (CAGR). Actual returns vary with market performance.',
    },
    {
      q: 'Is the SIP calculator free to use?',
      a: 'Yes, the calculator is completely free and works on mobile and desktop.',
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
            SIP Calculator
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Estimate your SIP maturity and visualize growth over time.
          </p>
        </div>

        {/* Quick switch tabs to related tools */}
        <div className="flex justify-center mb-6">
          <Tabs defaultValue="sip" className="max-w-5xl mx-auto w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="p-0 grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="sip">SIP Calculator</TabsTrigger>
                <TabsTrigger asChild value="emi">
                  <a href="/tools/emi">EMI Calculator</a>
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="sip">
              <div className="card-surface elevation-1 p-4 sm:p-6">
                <SIPCalculator />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* SEO content */ }
        <section className="prose dark:prose-invert max-w-3xl mx-auto mt-10">
          <h2>How this SIP calculator helps</h2>
          <p>
            Enter your monthly investment, period in years, and expected return to
            see total investment, expected returns, and maturity value. Use the
            Full/Compact toggle to switch number formatting.
          </p>
          <h3>Disclaimer</h3>
          <p>
            This tool is for educational purposes. Market returns are not
            guaranteed and past performance does not indicate future results.
          </p>
        </section>
      </div>
    </div>
  );
}
