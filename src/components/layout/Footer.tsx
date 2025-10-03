"use client";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200/60 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-gray-600 dark:text-gray-300 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>
          © {new Date().getFullYear()} <span className="font-semibold text-gray-900 dark:text-gray-100">FinCalc</span>. All rights reserved.
        </p>
        {/* <div className="flex items-center gap-4">
          <a href="/about" className="hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">About</a>
          <a href="/tools" className="hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">Tools</a>
        </div> */}
      </div>
    </footer>
  );
}
