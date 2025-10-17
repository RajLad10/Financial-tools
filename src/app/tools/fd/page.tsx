import type { Metadata } from 'next';
import { FDCalculator } from '@/components/calculators/FDCalculator';

export const metadata: Metadata = {
  title: 'FD Calculator — Fixed Deposit Maturity & Interest',
  description:
    'Free FD calculator to compute fixed deposit maturity amount and interest earned. Supports custom compounding frequency.',
  alternates: { canonical: '/tools/fd' },
  keywords: [
    'FD calculator',
    'fixed deposit calculator',
    'fd maturity calculator',
    'interest calculator',
  ],
  openGraph: {
    title: 'FD Calculator — Fixed Deposit Maturity & Interest',
    description:
      'Compute FD maturity and interest with quarterly compounding by default. Plan deposits confidently.',
    url: '/tools/fd',
  },
  twitter: {
    title: 'FD Calculator — Fixed Deposit Maturity & Interest',
    description:
      'Compute FD maturity and interest with quarterly compounding by default. Plan deposits confidently.',
    card: 'summary_large_image',
  },
};

export default function FDPage() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://financial-tools-blush.vercel.app').replace(/\/$/, '');
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Tools', item: `${base}/tools` },
      { '@type': 'ListItem', position: 2, name: 'FD Calculator', item: `${base}/tools/fd` },
    ],
  };
  const appJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'FinCalc FD Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: `${base}/tools/fd`,
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
  };
  return (
    <div className="py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">FD Calculator</h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">Calculate FD maturity amount and interest.</p>
        </div>
        <div className="card-surface elevation-1 p-4 sm:p-6 max-w-5xl mx-auto">
          <FDCalculator />
        </div>
      </div>
    </div>
  );
}
