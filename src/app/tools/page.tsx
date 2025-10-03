import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Financial Tools — SIP & EMI Calculators',
  description:
    'Use free online SIP and EMI calculators with interactive charts. Estimate SIP maturity, EMI, total interest, and total payment with clarity.',
  alternates: { canonical: '/tools' },
};

export default function Tools() {
  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Financial Tools
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Calculate investments and loan payments with ease.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Explore our calculators:
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <a href="/tools/sip" className="card-surface elevation-1 transition hover:elevation-2">
            <div className="p-7">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">SIP Calculator</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Plan investments and visualize growth over time.</p>
            </div>
          </a>
          <a href="/tools/emi" className="card-surface elevation-1 transition hover:elevation-2">
            <div className="p-7">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">EMI Calculator</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Compute EMIs and understand principal vs interest.</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

