import type { Metadata } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { IncomeTaxNewCalculator } from '@/components/calculators/IncomeTaxNewCalculator';
import { IncomeTaxOldCalculator } from '@/components/calculators/IncomeTaxOldCalculator';

export const metadata: Metadata = {
  title: 'Income Tax Calculator — New vs Old Regime (India)',
  description:
    'Free Income Tax calculator for India. Compare New vs Old Regime with slabs, standard deduction, and Chapter VI-A deductions.',
  alternates: { canonical: '/tools/income-tax' },
  keywords: [
    'income tax calculator',
    'new regime tax calculator',
    'old regime tax calculator',
    'india income tax slabs',
    'tax rebate 87A',
    'standard deduction',
  ],
  openGraph: {
    title: 'Income Tax Calculator — New vs Old Regime (India)',
    description:
      'Compute tax under New and Old Regime with accurate slabs and cess. Includes deductions and standard deduction where applicable.',
    url: '/tools/income-tax',
  },
  twitter: {
    title: 'Income Tax Calculator — New vs Old Regime (India)',
    description:
      'Compute tax under New and Old Regime with accurate slabs and cess. Includes deductions and standard deduction where applicable.',
    card: 'summary_large_image',
  },
};

export default function IncomeTaxPage() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://financial-tools-blush.vercel.app').replace(/\/$/, '');
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Tools', item: `${base}/tools` },
      { '@type': 'ListItem', position: 2, name: 'Income Tax Calculator', item: `${base}/tools/income-tax` },
    ],
  };
  const appJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'FinCalc Income Tax Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: `${base}/tools/income-tax`,
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
  };
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'New Regime' },
      { '@type': 'ListItem', position: 2, name: 'Old Regime' },
    ],
  };

  return (
    <div className="py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">Income Tax Calculator</h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">Compare New vs Old Regime with correct slabs and cess.</p>
        </div>

        <div className="flex justify-center mb-6">
          <Tabs defaultValue="new" className="max-w-5xl mx-auto w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="p-0 grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="new">New Regime</TabsTrigger>
                <TabsTrigger value="old">Old Regime</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="new">
              <div className="card-surface elevation-1 p-4 sm:p-6">
                <IncomeTaxNewCalculator />
              </div>
            </TabsContent>
            <TabsContent value="old">
              <div className="card-surface elevation-1 p-4 sm:p-6">
                <IncomeTaxOldCalculator />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
