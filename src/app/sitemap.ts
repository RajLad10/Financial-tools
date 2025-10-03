import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://financial-tools-blush.vercel.app';
  const routes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/tools`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/tools/sip`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/tools/emi`, changeFrequency: 'weekly', priority: 0.9 },
  ];
  return routes;
}
