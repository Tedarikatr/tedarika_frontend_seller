/**
 * public/sitemap-seller.xml, sitemap-satici.xml ve sitemap.xml (indeks) üretir.
 * Kaynak: src/constants/seo/index.js (SEO_INDEXABLE_ROUTES) — App.jsx ile senkron tutun.
 *
 * Çalıştır: node scripts/generate-seo.mjs  |  npm run build (prebuild)
 */
import { writeFileSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const routesUrl = pathToFileURL(join(root, "src/constants/seo/index.js")).href;
const { SEO_INDEXABLE_ROUTES, SEO_ORIGINS, SEO_SITEMAP_IMAGE } = await import(routesUrl);

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const lastmod = new Date().toISOString().slice(0, 10);

function buildUrlset(baseOrigin) {
  const lines = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
    `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`,
    `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`,
    `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9`,
    `        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`,
    ``,
    `  <!-- Otomatik üretildi: scripts/generate-seo.mjs | ${lastmod} -->`,
  ];

  for (const route of SEO_INDEXABLE_ROUTES) {
    const loc = route.path === "/" ? `${baseOrigin}/` : `${baseOrigin}${route.path}`;
    lines.push(`  <url>`);
    lines.push(`    <loc>${escapeXml(loc)}</loc>`);
    lines.push(`    <lastmod>${lastmod}</lastmod>`);
    lines.push(`    <changefreq>${route.changefreq}</changefreq>`);
    lines.push(`    <priority>${route.priority}</priority>`);
    if (route.withImage) {
      const imgUrl = `${baseOrigin}${SEO_SITEMAP_IMAGE.path}`;
      lines.push(`    <image:image>`);
      lines.push(`      <image:loc>${escapeXml(imgUrl)}</image:loc>`);
      lines.push(`      <image:title>${escapeXml(SEO_SITEMAP_IMAGE.title)}</image:title>`);
      lines.push(
        `      <image:caption>${escapeXml(SEO_SITEMAP_IMAGE.caption)}</image:caption>`
      );
      lines.push(`    </image:image>`);
    }
    lines.push(`  </url>`);
  }

  lines.push(`</urlset>`);
  lines.push(``);
  return lines.join("\n");
}

function buildSitemapIndex() {
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
    `              xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`,
    `              xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9`,
    `              http://www.sitemaps.org/schemas/sitemap/0.9/sitemap-index.xsd">`,
    `  <!-- İki host için ayrı urlset; Vercel host başına /sitemap.xml rewrite ile doğru dosya sunulur -->`,
    `  <sitemap>`,
    `    <loc>${escapeXml(`${SEO_ORIGINS.seller}/sitemap-seller.xml`)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `  </sitemap>`,
    `  <sitemap>`,
    `    <loc>${escapeXml(`${SEO_ORIGINS.satici}/sitemap-satici.xml`)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `  </sitemap>`,
    `</sitemapindex>`,
    ``,
  ].join("\n");
}

const sellerXml = buildUrlset(SEO_ORIGINS.seller);
const saticiXml = buildUrlset(SEO_ORIGINS.satici);
const indexXml = buildSitemapIndex();

writeFileSync(join(root, "public/sitemap-seller.xml"), sellerXml, "utf8");
writeFileSync(join(root, "public/sitemap-satici.xml"), saticiXml, "utf8");
writeFileSync(join(root, "public/sitemap.xml"), indexXml, "utf8");

console.log(
  `[generate-seo] lastmod=${lastmod} — sitemap-seller.xml, sitemap-satici.xml, sitemap.xml (index) yazıldı (${SEO_INDEXABLE_ROUTES.length} URL / host).`
);
