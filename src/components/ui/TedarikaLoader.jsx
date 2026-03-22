/**
 * Tedarika logosu + dönen halka — sayfa, bölüm ve tablo yüklemelerinde ortak kullanım.
 */
export default function TedarikaLoader({
  variant = "section",
  label = "Yükleniyor...",
  className = "",
}) {
  const logoSrc = `${import.meta.env.BASE_URL}images/logo.svg`.replace(/\/{2,}/g, "/");

  const sizes = {
    fullscreen: { logo: "h-20 w-20 sm:h-24 sm:w-24", ring: "h-11 w-11" },
    section: { logo: "h-16 w-16 sm:h-20 sm:w-20", ring: "h-10 w-10" },
    compact: { logo: "h-10 w-10 sm:h-12 sm:w-12", ring: "h-8 w-8" },
    inline: { logo: "h-10 w-10", ring: "h-8 w-8" },
  };

  const s = sizes[variant] || sizes.section;

  const column = (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <img src={logoSrc} alt="" className={`${s.logo} object-contain drop-shadow-lg`} draggable={false} />
      <div
        className={`${s.ring} rounded-full border-2 border-emerald-500/35 border-t-emerald-600 animate-spin`}
        aria-hidden
      />
      {label ? (
        <p className="text-gray-600 font-medium text-sm sm:text-base text-center px-2">{label}</p>
      ) : null}
    </div>
  );

  const inlineRow = (
    <div
      className={`flex items-center justify-center gap-3 ${className}`}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <img src={logoSrc} alt="" className={`${s.logo} object-contain flex-shrink-0`} draggable={false} />
      <div
        className={`${s.ring} rounded-full border-2 border-emerald-500/35 border-t-emerald-600 animate-spin flex-shrink-0`}
        aria-hidden
      />
      {label ? <span className="text-gray-500 text-sm">{label}</span> : null}
    </div>
  );

  if (variant === "inline") {
    return inlineRow;
  }

  if (variant === "fullscreen") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-white">
        {column}
      </div>
    );
  }

  if (variant === "section") {
    return (
      <div className="w-full flex items-center justify-center py-16 min-h-[50vh]">
        {column}
      </div>
    );
  }

  // compact — kart / gömülü bloklar (dış boşluk üst bileşende)
  return column;
}
