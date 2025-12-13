import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Package,
  ShoppingCart,
  Store,
  ClipboardList,
  LogOut,
  Settings,
  MessageSquare,
  ChevronRight,
  X,
  MapPin,
  ChevronLeft,
  Gift,
  MessageCircle,
  Tags,
  FileText,
  Upload,
  BarChart3,
} from "lucide-react";
import { useState } from "react";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/seller/login");
  };

  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-50 bg-gradient-to-b from-[#003131] to-[#001e1e] text-white shadow-2xl backdrop-blur-md transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${collapsed ? "w-20" : "w-64"}`}
    >
      <div className="flex flex-col h-full">
        {/* Mobil Başlık */}
        <div className="flex items-center justify-between md:hidden px-4 py-3 border-b border-white/10 bg-[#003131]">
          <span className="text-xl font-bold tracking-tight text-white">
            Tedarika
          </span>
          <button onClick={onClose} className="hover:scale-110 transition">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Logo & Collapse */}
        <div className="hidden md:flex items-center justify-between px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Store size={22} className="text-white" />
            {!collapsed && (
              <span className="text-xl font-extrabold tracking-wide text-white">
                Tedarika
              </span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg hover:bg-white/10 transition"
          >
            {collapsed ? (
              <ChevronRight size={20} className="text-white/70" />
            ) : (
              <ChevronLeft size={20} className="text-white/70" />
            )}
          </button>
        </div>

        {/* Menü */}
        <div className="flex-1 overflow-y-auto px-3 py-6 text-sm custom-scrollbar space-y-1">
          <SidebarLink to="/seller/dashboard" icon={<Home size={18} />} collapsed={collapsed} onClick={onClose}>
            Dashboard
          </SidebarLink>

          <SectionTitle title="MAĞAZA YÖNETİMİ" collapsed={collapsed} />
          <SidebarLink to="/seller/store/coverage" icon={<MapPin size={18} />} collapsed={collapsed} onClick={onClose}>
            Lokasyonlarım
          </SidebarLink>

          <SidebarLink to="/seller/brands" icon={<Tags size={18} />} collapsed={collapsed} onClick={onClose}>
            Markalarım
          </SidebarLink>

          <SectionTitle title="ÜRÜNLER" collapsed={collapsed} />
          <SidebarLink to="/seller/products/my-store" icon={<Package size={18} />} collapsed={collapsed} onClick={onClose}>
            Ürünlerim
          </SidebarLink>
          <SidebarLink to="/seller/products/database" icon={<ChevronRight size={14} />} collapsed={collapsed} onClick={onClose}>
            Veritabanı
          </SidebarLink>
          <SidebarLink to="/seller/products/drafts" icon={<FileText size={18} />} collapsed={collapsed} onClick={onClose}>
            Toplu Yükleme
          </SidebarLink>

          <SectionTitle title="İŞLEMLER" collapsed={collapsed} />
          <SidebarLink to="/seller/orders" icon={<ShoppingCart size={18} />} collapsed={collapsed} onClick={onClose}>
            Siparişler
          </SidebarLink>
          <SidebarLink to="/seller/quotations" icon={<ClipboardList size={18} />} collapsed={collapsed} onClick={onClose}>
            Teklifler
          </SidebarLink>

          <SidebarLink to="/seller/campaigns" icon={<Gift size={18} />} collapsed={collapsed} onClick={onClose}>
            Kampanyalarım
          </SidebarLink>

          <SidebarLink to="/seller/reviews" icon={<MessageSquare size={18} />} collapsed={collapsed} onClick={onClose}>
            Yorumlar
          </SidebarLink>

          <SidebarLink to="/seller/chat" icon={<MessageCircle size={18} />} collapsed={collapsed} onClick={onClose}>
            Mesajlar
          </SidebarLink>

          <SectionTitle title="RAPORLAR" collapsed={collapsed} />
          <SidebarLink to="/seller/reports/sales" icon={<BarChart3 size={18} />} collapsed={collapsed} onClick={onClose}>
            Satış Raporları
          </SidebarLink>

          <SectionTitle title="HESAP" collapsed={collapsed} />
          <SidebarLink to="/seller/profile" icon={<Settings size={18} />} collapsed={collapsed} onClick={onClose}>
            Profil
          </SidebarLink>
        </div>

        {/* Çıkış */}
        <div className="px-3 py-5 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20 text-sm transition-all"
          >
            <LogOut size={18} />
            {!collapsed && <span>Çıkış</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

// 🔗 Link bileşeni
const SidebarLink = ({ to, icon, children, onClick, collapsed }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all group ${
        isActive
          ? "bg-white/20 text-white shadow-inner"
          : "text-white/80 hover:text-white hover:bg-white/10"
      }`
    }
  >
    <span className="group-hover:scale-110 transition-transform">{icon}</span>
    {!collapsed && <span>{children}</span>}
  </NavLink>
);

// 🔠 Başlık bileşeni
const SectionTitle = ({ title, collapsed }) =>
  !collapsed ? (
    <div className="mt-4 mb-1 px-3 text-xs uppercase tracking-wide text-white/50 font-semibold">
      {title}
    </div>
  ) : null;

export default Sidebar;
