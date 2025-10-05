# FinCalc — SIP & EMI Calculator

A modern, SEO-optimized financial tools platform built with Next.js 15, featuring interactive SIP (Systematic Investment Plan) and EMI (Equated Monthly Installment) calculators with beautiful charts and comprehensive educational content.

## 🚀 Features

- **SIP Calculator:** Estimate mutual fund returns with monthly compounding, visualize growth with interactive charts
- **EMI Calculator:** Calculate loan EMIs with yearly principal vs interest breakdown
- **SEO Optimized:** Comprehensive metadata, structured data (JSON-LD), and content for first-page rankings
- **Modern UI:** Clean, responsive design with dark mode support using Tailwind CSS v4
- **Interactive Charts:** Powered by Chart.js for visual insights
- **Fast & Accessible:** Built with Next.js 15 App Router for optimal performance

## 🛠️ Tech Stack

- **Framework:** Next.js 15.4.6 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Charts:** Chart.js 4.5 + react-chartjs-2
- **Forms:** react-hook-form + zod validation
- **UI Components:** Radix UI (Tabs), Framer Motion
- **Icons:** Heroicons

## 📦 Getting Started

### Prerequisites

- Node.js 20+ (recommended)
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Financial-tools

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build for Production

```bash
npm run build
npm start
```

## 🌐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Site URL for canonical URLs and structured data (no trailing slash)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**Important:** Set this on your hosting platform (Vercel, Netlify, etc.) for production.

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with global metadata & JSON-LD
│   ├── page.tsx            # Homepage with hero and feature cards
│   ├── globals.css         # Global styles
│   ├── sitemap.ts          # Dynamic XML sitemap
│   ├── robots.ts           # robots.txt configuration
│   ├── about/
│   │   └── page.tsx        # About page
│   └── tools/
│       ├── page.tsx        # Tools index page
│       ├── sip/
│       │   └── page.tsx    # SIP Calculator page
│       └── emi/
│           └── page.tsx    # EMI Calculator page
├── components/
│   ├── calculators/
│   │   ├── SIPCalculator.tsx
│   │   └── EMICalculator.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── ui/
│       └── Tabs.tsx
└── lib/
    └── utils.ts
```

## 🔍 SEO Features

### Implemented SEO Enhancements

✅ **Metadata & Open Graph**
- Dynamic canonical URLs
- Comprehensive meta titles and descriptions
- Open Graph and Twitter Card tags
- Page-specific metadata on all routes

✅ **Structured Data (JSON-LD)**
- Organization schema with logo and social profiles
- WebSite schema with SearchAction
- FAQPage schema on calculator pages
- BreadcrumbList schema for navigation context
- WebApplication schema for calculator tools

✅ **Content Optimization**
- Keyword-rich headings (H1, H2, H3)
- Comprehensive educational content on calculator pages
- Internal linking with keyword-rich anchors
- Related tools sections for cross-linking

✅ **Technical SEO**
- XML sitemap with lastModified dates
- robots.txt with sitemap reference
- Semantic HTML structure
- Mobile-responsive design
- Fast loading with Next.js optimization

### Target Keywords

**Primary:**
- SIP calculator
- EMI calculator
- Mutual fund calculator
- Loan calculator

**Secondary:**
- SIP return calculator
- Home loan EMI calculator
- Investment calculator India
- Free SIP calculator

See `SEO_IMPROVEMENTS.md` for complete SEO documentation and strategy.

## 📊 Monitoring & Analytics

### Recommended Tools

1. **Google Search Console:** Monitor indexing, search queries, and CTR
2. **Google Analytics / Plausible:** Track user behavior and traffic sources
3. **PageSpeed Insights:** Monitor Core Web Vitals
4. **Schema Markup Validator:** Test structured data

### Setup Checklist

- [ ] Submit sitemap to Google Search Console
- [ ] Set up analytics tracking
- [ ] Create and add OG image (`public/og-cover.png`, 1200x630)
- [ ] Update social profile URLs in `src/app/layout.tsx`
- [ ] Monitor keyword rankings weekly
- [ ] Build backlinks from finance blogs

## 🎨 Customization

### Update Site Information

1. **Site URL:** Set `NEXT_PUBLIC_SITE_URL` environment variable
2. **Social Profiles:** Update `sameAs` array in `src/app/layout.tsx`
3. **Brand Name:** Search and replace "FinCalc" throughout the codebase
4. **OG Image:** Add your branded image at `public/og-cover.png`

### Add More Calculators

1. Create new route: `src/app/tools/[calculator-name]/page.tsx`
2. Add metadata and structured data (follow SIP/EMI examples)
3. Update sitemap in `src/app/sitemap.ts`
4. Add link in `src/app/tools/page.tsx`

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Environment Variables on Vercel

1. Go to Project Settings > Environment Variables
2. Add `NEXT_PUBLIC_SITE_URL` with your production domain
3. Redeploy

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using Next.js**
