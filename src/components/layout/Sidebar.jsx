import { NavLink, useNavigate } from "react-router-dom";
import {
  Home, Package, ShoppingCart, Store, ClipboardList,
  LogOut, Settings, MessageSquare, ChevronRight,
  X, MapPin, ChevronLeft
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
      className={`fixed md:static inset-y-0 left-0 z-50 bg-[#002c2c] text-white shadow-xl transform transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${collapsed ? "w-20" : "w-64"}`}
    >
      <div className="flex flex-col h-full">
        {/* Mobil Başlık */}
        <div className="flex items-center justify-between md:hidden px-4 py-3 border-b border-white/10 bg-[#002c2c]">
          <span className="text-xl font-bold tracking-tight">Tedarika</span>
          <button onClick={onClose} className="hover:scale-110 transition">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Logo & Collapse Butonu */}
        <div className="hidden md:flex items-center justify-between px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Store size={22} />
            {!collapsed && <span className="text-xl font-extrabold">Tedarika</span>}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg hover:bg-white/10 transition"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Menü */}
        <div className="flex-1 overflow-y-auto px-2 py-6 text-sm custom-scrollbar">
          <SidebarLink to="/seller/dashboard" icon={<Home size={18} />} collapsed={collapsed} onClick={onClose}>
            Dashboard
          </SidebarLink>

          <SectionTitle title="Mağaza Yönetimi" collapsed={collapsed} />
          <SidebarLink to="/seller/store/coverage" icon={<MapPin size={18} />} collapsed={collapsed} onClick={onClose}>
            Lokasyonlarım
          </SidebarLink>

          <SectionTitle title="Ürünler" collapsed={collapsed} />
          <SidebarLink to="/seller/products/my-store" icon={<Package size={18} />} collapsed={collapsed} onClick={onClose}>
            Ürünlerim
          </SidebarLink>
          <SidebarLink to="/seller/products/database" icon={<ChevronRight size={14} />} collapsed={collapsed} onClick={onClose}>
            Veritabanı
          </SidebarLink>
          <SidebarLink to="/seller/products/requests" icon={<ChevronRight size={14} />} collapsed={collapsed} onClick={onClose}>
            Başvurularım
          </SidebarLink>

          <SectionTitle title="İşlemler" collapsed={collapsed} />
          <SidebarLink to="/seller/orders" icon={<ShoppingCart size={18} />} collapsed={collapsed} onClick={onClose}>
            Siparişler
          </SidebarLink>
          <SidebarLink to="/seller/quotations" icon={<ClipboardList size={18} />} collapsed={collapsed} onClick={onClose}>
            Teklifler
          </SidebarLink>
          <SidebarLink to="/seller/reviews" icon={<MessageSquare size={18} />} collapsed={collapsed} onClick={onClose}>
            Yorumlar
          </SidebarLink>

          <SectionTitle title="Hesap" collapsed={collapsed} />
          <SidebarLink to="/seller/profile" icon={<Settings size={18} />} collapsed={collapsed} onClick={onClose}>
            Profil
          </SidebarLink>
        </div>

        {/* Çıkış Butonu */}
        <div className="px-2 py-5 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-300 hover:text-white hover:bg-white/10 text-sm transition-all"
          >
            <LogOut size={18} />
            {!collapsed && <span>Çıkış</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

const SidebarLink = ({ to, icon, children, onClick, collapsed }) => (
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
    {!collapsed && <span>{children}</span>}
  </NavLink>
);

const SectionTitle = ({ title, collapsed }) =>
  !collapsed ? (
    <div className="mt-4 mb-1 px-3 text-xs uppercase tracking-wide text-white/50 font-semibold">
      {title}
    </div>
  ) : null;

export default Sidebar;
