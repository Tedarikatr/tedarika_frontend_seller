/**
 * SEO sabitleri ve kamu URL tanımları — tek import noktası.
 * @see ../seoDefaults.js — meta metinleri, robots, OG
 * @see ../seoPublicRoutes.js — sitemap / dizin URL’leri (App.jsx ile senkron)
 */

export { SEO_DEFAULTS, SEO_ROBOTS, SEO_MAIN_SITE_ORIGIN } from "../seoDefaults.js";
export {
  SEO_ORIGINS,
  SEO_INDEXABLE_ROUTES,
  SEO_SITEMAP_IMAGE,
} from "../seoPublicRoutes.js";
