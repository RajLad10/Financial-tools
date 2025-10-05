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
          <h2>How to Use This EMI Calculator</h2>
          <p>
            Enter your loan amount (principal), annual interest rate, and loan tenure in years to instantly compute your monthly
            EMI (Equated Monthly Installment), total interest payable, and total payment. The interactive chart visualizes yearly
            principal vs interest breakdown, helping you understand how your payments are distributed over time.
          </p>

          <h2>What is EMI?</h2>
          <p>
            EMI (Equated Monthly Installment) is the fixed monthly payment you make to repay a loan. Each EMI consists of two components:
          </p>
          <ul>
            <li><strong>Principal:</strong> The portion that reduces your outstanding loan balance.</li>
            <li><strong>Interest:</strong> The cost of borrowing, calculated on the outstanding principal.</li>
          </ul>
          <p>
            In the early years of a loan, a larger portion of your EMI goes toward interest. As you repay the principal, the interest
            component decreases, and the principal component increases—this is called an amortization schedule.
          </p>

          <h2>How EMI is Calculated</h2>
          <p>
            Our EMI calculator uses the standard amortization formula:
          </p>
          <p>
            <strong>EMI = [P × R × (1+R)^N] / [(1+R)^N – 1]</strong>
          </p>
          <p>Where:</p>
          <ul>
            <li><strong>P</strong> = Principal loan amount</li>
            <li><strong>R</strong> = Monthly interest rate (Annual rate / 12 / 100)</li>
            <li><strong>N</strong> = Loan tenure in months</li>
          </ul>
          <p>
            This formula ensures that your EMI remains constant throughout the loan tenure, making budgeting easier.
          </p>

          <h2>Types of Loans You Can Calculate</h2>
          <p>
            This EMI calculator works for all types of fixed-rate loans, including:
          </p>
          <ul>
            <li><strong>Home Loans:</strong> Typically 15-30 years with interest rates around 8-9%.</li>
            <li><strong>Car Loans:</strong> Usually 3-7 years with rates around 9-11%.</li>
            <li><strong>Personal Loans:</strong> Typically 1-5 years with rates around 11-18%.</li>
            <li><strong>Education Loans:</strong> Varies by lender and course, often with moratorium periods.</li>
            <li><strong>Business Loans:</strong> Tenure and rates depend on business type and creditworthiness.</li>
          </ul>

          <h2>Reducing Balance vs Flat Interest Rate</h2>
          <p>
            Most banks use the <strong>reducing balance method</strong>, where interest is calculated on the outstanding principal
            after each EMI payment. This is what our calculator uses, and it&apos;s more borrower-friendly than the flat rate method.
          </p>
          <p>
            In contrast, the <strong>flat rate method</strong> calculates interest on the original principal throughout the loan tenure,
            resulting in higher total interest. Always confirm with your lender which method they use.
          </p>

          <h2>Impact of Prepayment on EMI</h2>
          <p>
            Making prepayments (lump sum payments toward the principal) can significantly reduce your total interest burden. You can choose to:
          </p>
          <ul>
            <li><strong>Reduce EMI:</strong> Keep the tenure the same but lower your monthly payment.</li>
            <li><strong>Reduce tenure:</strong> Keep the EMI the same but finish the loan earlier.</li>
          </ul>
          <p>
            Reducing tenure is usually more beneficial as it saves more on total interest. Check with your lender for prepayment charges, if any.
          </p>

          <h2>Tips to Reduce Your EMI Burden</h2>
          <ul>
            <li><strong>Make a larger down payment:</strong> Reduces the principal amount and, consequently, the EMI.</li>
            <li><strong>Choose a longer tenure:</strong> Lowers monthly EMI but increases total interest. Balance affordability with cost.</li>
            <li><strong>Negotiate interest rates:</strong> A lower rate can save lakhs over the loan tenure. Compare offers from multiple lenders.</li>
            <li><strong>Maintain a good credit score:</strong> Scores above 750 often qualify for better rates.</li>
            <li><strong>Consider balance transfer:</strong> If rates have dropped, transferring to a lower-rate lender can reduce costs.</li>
          </ul>

          <h2>Understanding the Amortization Schedule</h2>
          <p>
            The amortization schedule shows how each EMI is split between principal and interest over the loan tenure. In the initial years,
            interest dominates, but as the principal reduces, the interest component shrinks. Use our chart to visualize this breakdown
            year by year.
          </p>

          <h2>Related Tools</h2>
          <p>
            Plan your investments with our <a href="/tools/sip" className="text-blue-600 hover:underline">SIP Calculator</a>,
            or explore more on our <a href="/tools" className="text-blue-600 hover:underline">Financial Tools</a> page.
          </p>

          <h3>Disclaimer</h3>
          <p>
            This tool is for educational and informational purposes only. Loan terms, interest rates, and processing fees vary by lender.
            Always confirm details with your bank or financial institution before making borrowing decisions. Consult a certified financial
            advisor for personalized guidance.
          </p>
        </section>
      </div>
    </div>
  );
}
