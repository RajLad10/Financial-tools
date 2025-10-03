'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path
      ? 'text-blue-600'
      : 'text-gray-600 hover:text-blue-600';
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/70 dark:bg-white/[0.04] backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200/60 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-gray-100"
            >
              <svg 
                className="w-8 h-8 text-blue-600" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>FinCalc</span>
            </Link>
          </div>

          <div className="hidden sm:flex sm:space-x-8">
            <Link 
              href="/" 
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 dark:text-gray-300 ${isActive('/')}`}
            >
              Home
            </Link>
            <Link 
              href="/tools" 
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 dark:text-gray-300 ${isActive('/tools')}`}
            >
              Tools
            </Link>
            <Link 
              href="/about" 
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 dark:text-gray-300 ${isActive('/about')}`}
            >
              About
            </Link>
          </div>

          <div className="sm:hidden">
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile panel */}
      {open && (
        <div className="sm:hidden border-t border-gray-200/60 dark:border-white/10 bg-white/90 dark:bg-black/60 backdrop-blur">
          <div className="px-4 py-3 space-y-2">
            <Link href="/" className={`block py-2 dark:text-gray-200 ${isActive('/')}`} onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="/tools" className={`block py-2 dark:text-gray-200 ${isActive('/tools')}`} onClick={() => setOpen(false)}>
              Tools
            </Link>
            <Link href="/about" className={`block py-2 dark:text-gray-200 ${isActive('/about')}`} onClick={() => setOpen(false)}>
              About
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

