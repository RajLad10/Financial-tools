import type { Metadata } from 'next';
import { RDCalculator } from '@/components/calculators/RDCalculator';

export const metadata: Metadata = {
  title: 'RD Calculator — Recurring Deposit Maturity & Interest',
  description:
    'Free RD calculator to compute recurring deposit maturity amount, total deposit, and interest earned.',
  alternates: { canonical: '/tools/rd' },
  keywords: [
    'RD calculator',
    'recurring deposit calculator',
    'rd maturity calculator',
    'interest calculator',
  ],
  openGraph: {
    title: 'RD Calculator — Recurring Deposit Maturity & Interest',
    description:
      'Compute RD maturity with monthly compounding. Plan monthly savings confidently.',
    url: '/tools/rd',
  },
  twitter: {
    title: 'RD Calculator — Recurring Deposit Maturity & Interest',
    description:
      'Compute RD maturity with monthly compounding. Plan monthly savings confidently.',
    card: 'summary_large_image',
  },
};

export default function RDPage() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://financial-tools-blush.vercel.app').replace(/\/$/, '');
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Tools', item: `${base}/tools` },
      { '@type': 'ListItem', position: 2, name: 'RD Calculator', item: `${base}/tools/rd` },
    ],
  };
  const appJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'FinCalc RD Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: `${base}/tools/rd`,
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
  };
  return (
    <div className="py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">RD Calculator</h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">Calculate RD maturity amount, total deposit, and interest.</p>
        </div>
        <div className="card-surface elevation-1 p-4 sm:p-6 max-w-5xl mx-auto">
          <RDCalculator />
        </div>
      </div>
    </div>
  );
}
