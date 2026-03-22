import { Link, useNavigate } from "react-router-dom";
import { SeoHelmet, SEO_ROBOTS } from "@/components/seo";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <SeoHelmet
        pageTitle="Sayfa bulunamadı (404) | Tedarika Satıcı Paneli"
        robots={SEO_ROBOTS.NOINDEX_NOFOLLOW}
      />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-900 via-[#0a2626] to-emerald-950 text-white relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.45), transparent 45%), radial-gradient(circle at 80% 70%, rgba(45, 212, 191, 0.25), transparent 40%)",
          }}
        />
        <div className="relative z-10 max-w-lg w-full text-center">
          <p className="text-7xl sm:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 via-teal-200 to-white/90 drop-shadow-sm">
            404
          </p>
          <h1 className="mt-4 text-xl sm:text-2xl font-semibold text-white/95">
            Aradığınız sayfa bulunamadı
          </h1>
          <p className="mt-3 text-sm sm:text-base text-emerald-100/80 leading-relaxed">
            Bağlantı yanlış olabilir veya sayfa kaldırılmış olabilir. Satıcı paneli ana sayfasına dönebilir veya bir önceki
            sayfaya gidebilirsiniz.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/seller/landing"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-900/40 transition hover:bg-emerald-400"
            >
              <Home className="w-4 h-4" />
              Satıcı ana sayfa
            </Link>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Geri dön
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
