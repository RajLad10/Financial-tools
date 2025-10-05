import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://financial-tools-blush.vercel.app').replace(/\/$/, '');
  const lastModified = new Date();
  const routes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1, lastModified },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.5, lastModified },
    { url: `${base}/tools`, changeFrequency: 'weekly', priority: 0.9, lastModified },
    { url: `${base}/tools/sip`, changeFrequency: 'weekly', priority: 0.9, lastModified },
    { url: `${base}/tools/emi`, changeFrequency: 'weekly', priority: 0.9, lastModified },
  ];
  return routes;
}
