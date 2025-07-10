import { NavLink, useNavigate } from "react-router-dom";
import {
  Home, Package, ShoppingCart, Store, ClipboardList,
  FileText, LogOut, Settings, MessageSquare, Briefcase,
  ChevronRight, X
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/seller/login");
  };

  return (
    <aside
      className={`fixed md:static z-50 inset-y-0 left-0 w-64 bg-[#002c2c] text-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
    >
      {/* Mobile Header */}
      <div className="flex items-center justify-between md:hidden p-4 border-b border-white/10">
        <span className="text-xl font-bold">Tedarika</span>
        <button onClick={onClose}><X className="w-5 h-5 text-white" /></button>
      </div>

      {/* Desktop Logo */}
      <div className="hidden md:flex items-center gap-2 p-6 text-2xl font-bold border-b border-white/10">
        <Store size={24} />
        <span>Tedarika</span>
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col gap-1 px-4 py-6 text-sm">
        <SidebarLink to="/seller/dashboard" icon={<Home size={18} />}>Dashboard</SidebarLink>
        <SidebarLink to="/seller/products/my-store" icon={<Package size={18} />}>Ürünler</SidebarLink>
        <div className="ml-5 border-l border-white/10 pl-4 flex flex-col gap-1">
          <SidebarLink to="/seller/products/my-store" icon={<ChevronRight size={14} />}>Ürünlerim</SidebarLink>
          <SidebarLink to="/seller/products/database" icon={<ChevronRight size={14} />}>Ürün Veritabanı</SidebarLink>
          <SidebarLink to="/seller/products/requests" icon={<ChevronRight size={14} />}>Başvurularım</SidebarLink>
        </div>
        <SidebarLink to="/seller/orders" icon={<ShoppingCart size={18} />}>Siparişler</SidebarLink>
        <SidebarLink to="/seller/store" icon={<Store size={18} />}>Mağazam</SidebarLink>
        <SidebarLink to="/seller/quotations" icon={<ClipboardList size={18} />}>Teklifler</SidebarLink>
        <SidebarLink to="/seller/reviews" icon={<MessageSquare size={18} />}>Yorumlar</SidebarLink>
        <SidebarLink to="/seller/requests" icon={<FileText size={18} />}>İstekler</SidebarLink>
        <SidebarLink to="/seller/company-view" icon={<Briefcase size={18} />}>Şirket Bilgilerim</SidebarLink>
        <SidebarLink to="/seller/profile" icon={<Settings size={18} />}>Profil</SidebarLink>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto px-4 py-5 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-300 hover:text-white hover:bg-white/10 text-sm"
        >
          <LogOut size={18} />
          <span>Çıkış</span>
        </button>
      </div>
    </aside>
  );
};

const SidebarLink = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
        isActive
          ? "bg-white/20 font-semibold text-white"
          : "text-white/80 hover:text-white hover:bg-white/10"
      }`
    }
  >
    {icon}
    <span>{children}</span>
  </NavLink>
);

export default Sidebar;
