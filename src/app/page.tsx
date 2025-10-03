export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 to-white dark:from-transparent dark:to-transparent" />
        {/* <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950" /> */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Plan smarter with modern financial tools
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            SIP and EMI calculators with interactive charts and clear breakdowns —
            designed to help you make confident money decisions.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <a href="/tools" className="inline-flex">
              <span className="inline-flex items-center rounded-lg bg-blue-600 text-white px-5 py-3 text-sm font-medium shadow-sm hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ring-offset-2">
                Explore Tools
              </span>
            </a>
            <a href="/about" className="inline-flex">
              <span className="inline-flex items-center rounded-lg border border-gray-300 text-gray-800 dark:text-gray-100 dark:border-gray-600 px-5 py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 dark:focus-visible:ring-gray-600 ring-offset-2">
                Learn More
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Feature links */}
      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          <a href="/tools" className="card-surface elevation-1 transition hover:elevation-2">
            <div className="p-7">
              <div className="text-blue-600 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">SIP Calculator</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Plan investments and visualize growth over time.</p>
            </div>
          </a>
          <a href="/tools" className="card-surface elevation-1 transition hover:elevation-2">
            <div className="p-7">
              <div className="text-blue-600 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">EMI Calculator</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Compute EMIs and understand principal vs interest.</p>
            </div>
          </a>
        </div>
      </section>

      {/* Why section */}
      <section className="py-4 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 text-center">Why choose FinCalc?</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="card-surface p-6">
              <div className="text-blue-600 mb-3 flex justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 text-center">Fast & Accurate</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center mt-1">Precise results instantly.</p>
            </div>
            <div className="card-surface p-6">
              <div className="text-blue-600 mb-3 flex justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 text-center">Visual Insights</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center mt-1">Interactive charts and breakdowns.</p>
            </div>
            <div className="card-surface p-6">
              <div className="text-blue-600 mb-3 flex justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 text-center">Easy to Use</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center mt-1">Clean interface, simple controls.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

