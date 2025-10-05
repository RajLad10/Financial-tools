import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About FinCalc — Free SIP & EMI Calculators',
  description:
    'Learn about FinCalc, a free suite of SIP and EMI calculators with interactive charts to help plan investments and loans.',
  alternates: { canonical: '/about' },
};

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        About FinCalc
      </h1>
      
      <div className="prose prose-blue max-w-none">
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          FinCalc is your go-to platform for financial planning and calculations. Our tools help you make informed decisions about your investments and loans.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">
          Our Features
        </h2>
        
        <ul className="space-y-4 text-gray-600 dark:text-gray-300">
          <li className="flex items-start">
            <svg className="w-6 h-6 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>SIP Calculator with detailed investment breakdowns</span>
          </li>
          <li className="flex items-start">
            <svg className="w-6 h-6 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>EMI Calculator with payment schedules</span>
          </li>
          <li className="flex items-start">
            <svg className="w-6 h-6 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Interactive charts and visualizations</span>
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">
          Why Choose FinCalc?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="p-6 rounded-lg shadow-sm border border-gray-100 dark:border-white/10 bg-white dark:bg-white/[0.06]">
            <div className="text-blue-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Fast & Accurate</h3>
            <p className="text-gray-600 dark:text-gray-300">Real-time calculations with precise results</p>
          </div>

          <div className="p-6 rounded-lg shadow-sm border border-gray-100 dark:border-white/10 bg-white dark:bg-white/[0.06]">
            <div className="text-blue-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">User Friendly</h3>
            <p className="text-gray-600 dark:text-gray-300">Clean interface with intuitive controls</p>
          </div>

          <div className="p-6 rounded-lg shadow-sm border border-gray-100 dark:border-white/10 bg-white dark:bg-white/[0.06]">
            <div className="text-blue-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Visual Insights</h3>
            <p className="text-gray-600 dark:text-gray-300">Clear charts and detailed breakdowns</p>
          </div>
        </div>
      </div>
    </div>
  );
}

