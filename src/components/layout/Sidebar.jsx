import { NavLink } from "react-router-dom";
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
  Tags,
  FileText,
  Upload,
  BarChart3,
  PackageX,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { useLogout } from "@/hooks/useLogout";

const Sidebar = ({ isOpen, onClose }) => {
  const performLogout = useLogout();
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState({
    store: true,
    products: true,
    operations: true,
    reports: true,
    account: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLogout = () => {
    performLogout();
  };

  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-50 pt-[env(safe-area-inset-top,0px)] md:pt-0 bg-gradient-to-b from-[#003131] to-[#001e1e] text-white shadow-2xl backdrop-blur-md transition-all duration-300 ease-in-out
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
        <div className={`flex-1 overflow-y-auto ${collapsed ? "px-2" : "px-3"} py-6 text-sm custom-scrollbar space-y-1`}>
          <SidebarLink to="/seller/dashboard" icon={<Home size={18} />} collapsed={collapsed} onClick={onClose}>
            Anasayfa
          </SidebarLink>

          {/* MAĞAZA YÖNETİMİ */}
          <CollapsibleSection
            title="MAĞAZA YÖNETİMİ"
            isOpen={openSections.store}
            onToggle={() => toggleSection("store")}
            collapsed={collapsed}
          >
            <SidebarLink to="/seller/store/coverage" icon={<MapPin size={18} />} collapsed={collapsed} onClick={onClose}>
              Lokasyonlarım
            </SidebarLink>
            <SidebarLink to="/seller/brands" icon={<Tags size={18} />} collapsed={collapsed} onClick={onClose}>
              Markalarım
            </SidebarLink>
          </CollapsibleSection>

          {/* ÜRÜNLER */}
          <CollapsibleSection
            title="ÜRÜNLER"
            isOpen={openSections.products}
            onToggle={() => toggleSection("products")}
            collapsed={collapsed}
          >
            <SidebarLink to="/seller/products/my-store" icon={<Package size={18} />} collapsed={collapsed} onClick={onClose}>
              Ürünlerim
            </SidebarLink>
            <SidebarLink to="/seller/products/database" icon={<FileText size={18} />} collapsed={collapsed} onClick={onClose}>
              Ürün Kataloğu
            </SidebarLink>
            <SidebarLink to="/seller/products/draft/upload" icon={<Upload size={18} />} collapsed={collapsed} onClick={onClose}>
              Ürün Yükleme
            </SidebarLink>
          </CollapsibleSection>

          {/* İŞLEMLER */}
          <CollapsibleSection
            title="İŞLEMLER"
            isOpen={openSections.operations}
            onToggle={() => toggleSection("operations")}
            collapsed={collapsed}
          >
            <SidebarLink to="/seller/orders" icon={<ShoppingCart size={18} />} collapsed={collapsed} onClick={onClose}>
              Siparişler
            </SidebarLink>
            <SidebarLink to="/seller/orders/refund-requests" icon={<PackageX size={18} />} collapsed={collapsed} onClick={onClose}>
              İade Talepleri
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
          </CollapsibleSection>

          {/* RAPORLAR */}
          <CollapsibleSection
            title="RAPORLAR"
            isOpen={openSections.reports}
            onToggle={() => toggleSection("reports")}
            collapsed={collapsed}
          >
            <SidebarLink to="/seller/reports/sales" icon={<BarChart3 size={18} />} collapsed={collapsed} onClick={onClose}>
              Satış Raporları
            </SidebarLink>
          </CollapsibleSection>

          {/* HESAP */}
          <CollapsibleSection
            title="HESAP"
            isOpen={openSections.account}
            onToggle={() => toggleSection("account")}
            collapsed={collapsed}
          >
            <SidebarLink to="/seller/profile" icon={<Settings size={18} />} collapsed={collapsed} onClick={onClose}>
              Profil
            </SidebarLink>
          </CollapsibleSection>
        </div>

        {/* Çıkış */}
        <div className={`${collapsed ? "px-2" : "px-3"} py-5 border-t border-white/10`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${collapsed ? "justify-center" : ""} gap-3 ${collapsed ? "px-2" : "px-3"} py-2 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20 text-sm transition-all`}
            title={collapsed ? "Çıkış" : undefined}
          >
            <LogOut size={18} className="flex-shrink-0" />
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
      `flex items-center ${collapsed ? "justify-center" : ""} ${collapsed ? "gap-0" : "gap-3"} ${collapsed ? "px-2" : "px-3"} py-2 rounded-lg font-medium transition-all group ${
        isActive
          ? "bg-white/20 text-white shadow-inner"
          : "text-white/80 hover:text-white hover:bg-white/10"
      }`
    }
    title={collapsed ? children : undefined}
  >
    <span className="group-hover:scale-110 transition-transform flex-shrink-0">{icon}</span>
    {!collapsed && <span>{children}</span>}
  </NavLink>
);

// 🔠 Açılır Kapanır Bölüm Bileşeni
const CollapsibleSection = ({ title, isOpen, onToggle, collapsed, children }) => {
  // Collapsed durumunda sadece alt menü öğelerini göster (ikonlar)
  if (collapsed) {
    return (
      <div className="mt-2 space-y-1">
        {children}
      </div>
    );
  }

  // Normal durumda başlık ve alt menüler
  return (
    <div className="mt-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 mb-1 rounded-lg text-xs uppercase tracking-wide text-white/70 hover:text-white hover:bg-white/10 font-bold transition-all duration-200 group"
      >
        <span className="group-hover:scale-105 transition-transform">{title}</span>
        {isOpen ? (
          <ChevronUp size={16} className="text-white/60 group-hover:text-white transition-colors" />
        ) : (
          <ChevronDown size={16} className="text-white/60 group-hover:text-white transition-colors" />
        )}
      </button>
      {isOpen && (
        <div className="ml-2 space-y-1 border-l-2 border-white/10 pl-2">
          {children}
        </div>
      )}
    </div>
  );
};

// 🔠 Başlık bileşeni (artık kullanılmıyor ama geriye dönük uyumluluk için bırakıldı)
const SectionTitle = ({ title, collapsed }) =>
  !collapsed ? (
    <div className="mt-4 mb-1 px-3 text-xs uppercase tracking-wide text-white/50 font-semibold">
      {title}
    </div>
  ) : null;

export default Sidebar;
