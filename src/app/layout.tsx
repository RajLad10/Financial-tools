import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://financial-tools-blush.vercel.app'),
  title: {
    default: 'FinCalc — SIP & EMI Calculator',
    template: '%s | FinCalc',
  },
  description:
    'Calculate SIP returns and loan EMIs with interactive charts. Free online financial calculators for planning investments, EMIs, and total payments.',
  keywords: [
    'SIP calculator',
    'EMI calculator',
    'loan calculator',
    'mutual fund calculator',
    'investment calculator',
    'financial tools',
    'SIP returns',
    'EMI schedule',
  ],
  authors: [{ name: 'FinCalc' }],
  creator: 'FinCalc',
  publisher: 'FinCalc',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'FinCalc — SIP & EMI Calculator',
    description:
      'Free SIP and EMI calculators with beautiful charts. Plan investments and loans quickly and accurately.',
    siteName: 'FinCalc',
    images: [
      {
        url: '/og-cover.png',
        width: 1200,
        height: 630,
        alt: 'FinCalc — SIP & EMI Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinCalc — SIP & EMI Calculator',
    description:
      'Free SIP and EMI calculators with beautiful charts. Plan investments and loans quickly and accurately.',
    images: ['/og-cover.png'],
    creator: '@fincalc',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Organization & Website JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  name: 'FinCalc',
                  url: 'https://financial-tools-blush.vercel.app/',
                  logo: 'https://financial-tools-blush.vercel.app/icon.png',
                },
                {
                  '@type': 'WebSite',
                  name: 'FinCalc',
                  url: 'https://financial-tools-blush.vercel.app/',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://financial-tools-blush.vercel.app/tools?q={search_term_string}',
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
