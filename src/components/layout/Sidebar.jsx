import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Package,
  ShoppingCart,
  Store,
  ClipboardList,
  FileText,
  LogOut,
  Settings,
  MessageSquare,
  Briefcase,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerEmail");
    localStorage.removeItem("sellerRole");
    navigate("/seller/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-[#002c2c] text-white shadow-xl flex flex-col">
      <div className="p-6 font-bold text-3xl tracking-wide flex items-center gap-2">
        <Store size={26} /> Tedarika
      </div>

      <nav className="flex flex-col gap-1 px-4 text-sm mt-6">
        <SidebarLink to="/seller/dashboard" icon={<Home size={18} />}>Dashboard</SidebarLink>

        {/* Ürünler Menüsü */}
        <SidebarLink to="/seller/products/my-store" icon={<Package size={18} />}>Ürünler</SidebarLink>
        <div className="ml-6 flex flex-col gap-1">
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

      <div className="mt-auto px-4 pt-6 pb-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm w-full"
        >
          <LogOut size={18} />
          <span>Çıkış</span>
        </button>
      </div>
    </aside>
  );
};

const SidebarLink = ({ to, icon, children, extra = "" }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
        isActive ? "bg-white/25 font-semibold shadow-sm" : "hover:bg-white/10"
      } ${extra}`
    }
  >
    {icon}
    <span>{children}</span>
  </NavLink>
);

export default Sidebar;
