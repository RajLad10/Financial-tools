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

// Prefer environment-provided site URL (without trailing slash), fallback to production URL
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://financial-tools-blush.vercel.app").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
  verification: {
    google: 'iXEOejM2oguAvYuOiL7QrftDj1VObr1yAhkPlhJAHQc',
  },
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
        // Tip: replace with a real PNG/JPG og image at public/og-cover.png
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
                  url: `${siteUrl}/`,
                  logo: `${siteUrl}/favicon.ico`,
                  sameAs: [
                    // Replace or remove with your actual profiles
                    'https://x.com/fincalc',
                  ],
                },
                {
                  '@type': 'WebSite',
                  name: 'FinCalc',
                  url: `${siteUrl}/`,
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: `${siteUrl}/tools?q={search_term_string}`,
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
