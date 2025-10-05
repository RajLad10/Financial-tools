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
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://financial-tools-blush.vercel.app').replace(/\/$/, '');
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
        name: 'SIP Calculator',
        item: `${base}/tools/sip`,
      },
    ],
  };

  const appJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'FinCalc SIP Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: `${base}/tools/sip`,
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
          <h2>How to Use This SIP Calculator</h2>
          <p>
            Enter your monthly investment amount, investment period in years, and expected annual return rate (CAGR) to
            see your total investment, expected returns, and maturity value. Use the
            Full/Compact toggle to switch number formatting for easier reading.
          </p>

          <h2>What is a SIP (Systematic Investment Plan)?</h2>
          <p>
            A Systematic Investment Plan (SIP) is a disciplined investment method where you invest a fixed amount regularly
            (monthly, quarterly, etc.) in mutual funds. SIPs leverage rupee cost averaging and the power of compounding to
            help you build wealth over time, making them ideal for long-term financial goals like retirement, education, or home purchase.
          </p>

          <h2>How SIP Returns Are Calculated</h2>
          <p>
            Our SIP calculator uses the future value of an annuity formula with monthly compounding. The formula accounts for:
          </p>
          <ul>
            <li><strong>Monthly investment amount:</strong> The fixed sum you invest each month.</li>
            <li><strong>Investment tenure:</strong> The total number of years you plan to invest.</li>
            <li><strong>Expected annual return (CAGR):</strong> The compound annual growth rate you anticipate based on historical fund performance.</li>
          </ul>
          <p>
            The calculator compounds returns monthly to give you an accurate estimate of your maturity value. Remember, actual returns
            depend on market performance and may vary.
          </p>

          <h2>Benefits of Using a SIP Calculator</h2>
          <ul>
            <li><strong>Plan your investments:</strong> Estimate how much you need to invest monthly to reach your financial goals.</li>
            <li><strong>Visualize growth:</strong> See how your wealth grows over time with interactive charts.</li>
            <li><strong>Compare scenarios:</strong> Adjust monthly amounts, tenure, or expected returns to find the best strategy.</li>
            <li><strong>Make informed decisions:</strong> Understand the impact of compounding and time on your investments.</li>
          </ul>

          <h2>SIP vs Lump Sum Investment</h2>
          <p>
            While lump sum investments can benefit from immediate market exposure, SIPs offer several advantages:
          </p>
          <ul>
            <li><strong>Rupee cost averaging:</strong> You buy more units when prices are low and fewer when prices are high, averaging out your cost.</li>
            <li><strong>Disciplined investing:</strong> Regular investments build a savings habit and reduce the temptation to time the market.</li>
            <li><strong>Lower risk:</strong> Spreading investments over time reduces the impact of market volatility.</li>
            <li><strong>Accessibility:</strong> Start with small amounts (as low as ₹500/month) instead of needing a large sum upfront.</li>
          </ul>

          <h2>Realistic Return Expectations</h2>
          <p>
            Historical data shows that equity mutual funds in India have delivered 12-15% CAGR over long periods (10+ years),
            while debt funds typically return 6-8%. However, past performance doesn&apos;t guarantee future results. Consider:
          </p>
          <ul>
            <li>Market conditions and economic cycles</li>
            <li>Fund manager expertise and fund house reputation</li>
            <li>Your risk tolerance and investment horizon</li>
            <li>Diversification across asset classes</li>
          </ul>

          <h2>Tax Implications of SIP Investments</h2>
          <p>
            Tax treatment depends on the type of mutual fund and holding period:
          </p>
          <ul>
            <li><strong>Equity funds (held &gt;1 year):</strong> Long-term capital gains above ₹1 lakh taxed at 10%.</li>
            <li><strong>Equity funds (held ≤1 year):</strong> Short-term capital gains taxed at 15%.</li>
            <li><strong>Debt funds:</strong> Gains taxed as per your income tax slab.</li>
          </ul>
          <p>
            Consult a tax advisor for personalized guidance based on your financial situation.
          </p>

          <h2>Related Tools</h2>
          <p>
            Explore our <a href="/tools/emi" className="text-blue-600 hover:underline">EMI Calculator</a> to plan loan repayments,
            or visit our <a href="/tools" className="text-blue-600 hover:underline">Financial Tools</a> page for more calculators.
          </p>

          <h3>Disclaimer</h3> 
          <p>
            This tool is for educational and informational purposes only. Market returns are not
            guaranteed, and past performance does not indicate future results. Always consult a certified financial advisor
            before making investment decisions.
          </p>
        </section>
      </div>
    </div>
  );
}
