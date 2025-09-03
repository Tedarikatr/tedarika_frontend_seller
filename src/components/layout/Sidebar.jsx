import { NavLink, useNavigate } from "react-router-dom";
import {
  Home, Package, ShoppingCart, Store, ClipboardList,
  FileText, LogOut, Settings, MessageSquare, ChevronRight,
  X, MapPin
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/seller/login");
  };

  // SidebarLink'e onClick props'u gönderilecek, mobilde onClose tetiklenmesi için
  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#002c2c] text-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
    >
      <div className="flex flex-col h-full">
        {/* Mobil Başlık */}
        <div className="flex items-center justify-between md:hidden px-4 py-3 border-b border-white/10 bg-[#002c2c]">
          <span className="text-xl font-bold tracking-tight">Tedarika</span>
          <button onClick={onClose} className="hover:scale-110 transition">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Logo */}
        <div className="hidden md:flex items-center gap-2 px-6 py-5 text-2xl font-extrabold border-b border-white/10 tracking-tight">
          <Store size={22} />
          <span>Tedarika</span>
        </div>

        {/* Menü (Scroll edilebilir) */}
        <div className="flex-1 overflow-y-auto px-4 py-6 text-sm custom-scrollbar">
          <SidebarLink to="/seller/dashboard" icon={<Home size={18} />} onClick={onClose}>
            Dashboard
          </SidebarLink>

          <SectionTitle title="Mağaza Yönetimi" />
          <SidebarLink to="/seller/store/coverage" icon={<MapPin size={18} />} onClick={onClose}>
            Lokasyonlarım
          </SidebarLink>

          <SectionTitle title="Ürünler" />
          <SidebarLink to="/seller/products/my-store" icon={<ChevronRight size={14} />} onClick={onClose}>
            Ürünlerim
          </SidebarLink>
          <SidebarLink to="/seller/products/database" icon={<ChevronRight size={14} />} onClick={onClose}>
            Veritabanı
          </SidebarLink>
          <SidebarLink to="/seller/products/requests" icon={<ChevronRight size={14} />} onClick={onClose}>
            Başvurularım
          </SidebarLink>

          <SectionTitle title="İşlemler" />
          <SidebarLink to="/seller/orders" icon={<ShoppingCart size={18} />} onClick={onClose}>
            Siparişler
          </SidebarLink>
          <SidebarLink to="/seller/quotations" icon={<ClipboardList size={18} />} onClick={onClose}>
            Teklifler
          </SidebarLink>
          <SidebarLink to="/seller/reviews" icon={<MessageSquare size={18} />} onClick={onClose}>
            Yorumlar
          </SidebarLink>
         

          <SectionTitle title="Hesap" />
          <SidebarLink to="/seller/profile" icon={<Settings size={18} />} onClick={onClose}>
            Profil
          </SidebarLink>
        </div>

        {/* Çıkış Butonu */}
        <div className="px-4 py-5 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-300 hover:text-white hover:bg-white/10 text-sm transition-all"
          >
            <LogOut size={18} />
            <span>Çıkış</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

// Tıklanınca onClick çağrılacak yapı (mobilde sidebar'ı kapatır)
const SidebarLink = ({ to, icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all group ${
        isActive
          ? "bg-white/20 text-white font-semibold shadow-inner"
          : "text-white/80 hover:text-white hover:bg-white/10"
      }`
    }
  >
    <span className="group-hover:scale-110 transition-transform">{icon}</span>
    <span>{children}</span>
  </NavLink>
);

const SectionTitle = ({ title }) => (
  <div className="mt-4 mb-1 px-3 text-xs uppercase tracking-wide text-white/50 font-semibold">
    {title}
  </div>
);

export default Sidebar;