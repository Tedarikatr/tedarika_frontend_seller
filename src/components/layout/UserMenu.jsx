import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UserCircle,
  Building2,
  Store,
  ShieldCheck,
  CreditCard,
  Truck,
  Mail,
  LogOut,
  ChevronRight,
} from "lucide-react";

const MENU_ITEMS = [
  { key: "seller", label: "Satıcı Bilgileri", icon: UserCircle, path: "/seller/profile" },
  { key: "company", label: "Şirket Bilgileri", icon: Building2, path: "/seller/profile#company" },
  { key: "store", label: "Mağaza Bilgileri", icon: Store, path: "/seller/profile#store" },
  { key: "subscription", label: "Abonelik", icon: ShieldCheck, path: "/seller/profile#subscription" },
  { key: "finance", label: "Ödeme", icon: CreditCard, path: "/seller/profile#finance" },
  { key: "cargo", label: "Kargo Entegrasyonu", icon: Truck, path: "/seller/profile#cargo" },
  { key: "notifications", label: "İletişim Tercihleri", icon: Mail, path: "/seller/profile#notifications" },
];

export default function UserMenu({ user, storeLogo, initials }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Dışarı tıklanınca kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // URL hash değişikliğini dinle (tab değişimi için)
  useEffect(() => {
    const handleHashChange = () => {
      // Hash değiştiğinde menüyü kapat
      setIsOpen(false);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleMenuClick = (item) => {
    if (item.path.includes("#")) {
      // Hash ile tab değiştirme
      const [path, hash] = item.path.split("#");
      navigate(path);
      // Sayfa yüklendikten sonra hash'i ayarla
      setTimeout(() => {
        window.location.hash = hash;
        // Profil sayfasında tab değiştirme için event dispatch et
        window.dispatchEvent(new CustomEvent("profile-tab-change", { detail: { tab: hash } }));
      }, 100);
    } else {
      navigate(item.path);
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/seller/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar/Logo Butonu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#003131] rounded-full"
        aria-label="Kullanıcı menüsü"
      >
        {storeLogo ? (
          <img
            src={storeLogo}
            alt="Mağaza Logosu"
            className="w-12 h-12 rounded-full object-cover shadow-xl border-2 border-white/30 hover:scale-110 transition-transform duration-300 cursor-pointer"
            title={user?.email || ""}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div
            className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full font-extrabold text-lg shadow-xl border-2 border-white/30 hover:scale-110 transition-transform duration-300 cursor-pointer"
            title={user?.email || ""}
          >
            {initials}
          </div>
        )}
      </button>

      {/* Dropdown Menü */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden z-50 animate-slide-down">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 border-b border-white/20">
            <div className="flex items-center gap-3">
              {storeLogo ? (
                <img
                  src={storeLogo}
                  alt="Mağaza Logosu"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full font-extrabold text-white">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">
                  {user?.name || "Kullanıcı"}
                </p>
                <p className="text-emerald-100 text-xs truncate">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          </div>

          {/* Menü Öğeleri */}
          <div className="py-2">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              // Aktif tab kontrolü
              const currentHash = location.hash.replace("#", "");
              const isActive = location.pathname === "/seller/profile" && 
                (item.path.includes("#") 
                  ? currentHash === item.key 
                  : !currentHash && item.key === "seller");

              return (
                <button
                  key={item.key}
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-gray-50 transition-colors ${
                    isActive ? "bg-emerald-50 border-l-4 border-emerald-600" : ""
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-emerald-600" : "text-gray-600"}`} />
                  <span className={`flex-1 font-medium text-sm ${isActive ? "text-emerald-700 font-semibold" : "text-gray-700"}`}>
                    {item.label}
                  </span>
                  <ChevronRight className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-gray-400"}`} />
                </button>
              );
            })}
          </div>

          {/* Ayırıcı */}
          <div className="border-t border-gray-200"></div>

          {/* Çıkış */}
          <div className="py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-red-50 transition-colors text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span className="flex-1 font-medium text-sm">Çıkış Yap</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
