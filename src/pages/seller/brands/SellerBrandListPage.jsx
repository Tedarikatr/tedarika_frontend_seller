import { useState, useEffect, useMemo } from "react";
import {
  getBrandList,
  getBrandOwnership,
  getOwnedBrands,
} from "@/api/brandservice";
import OwnedBrandsSection from "@/components/Brand/OwnedBrandsSection";
import BrandList from "@/components/Brand/BrandList";
import OwnershipStatusSection from "@/components/Brand/OwnershipStatusSection";
import CreateBrandModal from "@/components/Brand/CreateBrandModal";
import OwnershipRequestModal from "@/components/Brand/OwnershipRequestModal";
import Pagination from "@/components/ui/Pagination";
import Toast from "@/components/ui/Toast";
import {
  Award,
  Sparkles,
  Search,
  CheckCircle,
  Package,
  TrendingUp,
  Plus
} from "lucide-react";

export default function SellerBrandPage() {
  const [brands, setBrands] = useState([]);
  const [ownerships, setOwnerships] = useState([]);
  const [ownedBrands, setOwnedBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [activeTab, setActiveTab] = useState("owned");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState({ id: null, name: "" });

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const showToast = (message, type = "success") => setToast({ show: true, message, type });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [brandList, ownershipList, ownedList] = await Promise.all([
        getBrandList(),
        getBrandOwnership(),
        getOwnedBrands(),
      ]);
      setBrands(brandList);
      setOwnerships(ownershipList);
      setOwnedBrands(ownedList);
    } catch (err) {
      showToast("Veri alınamadı: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Arama ve sayfalama işlemi (front-end'te)
  const filteredBrands = useMemo(() => {
    return brands.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [brands, search]);

  const totalCount = filteredBrands.length;
  const visibleBrands = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredBrands.slice(start, start + pageSize);
  }, [filteredBrands, page, pageSize]);

  const handleOwnershipRequest = (brandId, brandName) => {
    setSelectedBrand({ id: brandId, name: brandName });
    setShowRequestModal(true);
  };

  const handleRequestSuccess = (result) => {
    fetchData();
    showToast(result?.message || "Başvuru başarıyla gönderildi!", "success");
  };

  const handleCreateSuccess = (result) => {
    fetchData();
    showToast("Marka başarıyla oluşturuldu! Admin onayı bekleniyor.", "success");
  };

  // Stats
  const stats = useMemo(() => {
    const owned = ownedBrands.length;
    const pending = ownerships.filter(o => o.status === 0 || o.status === "Pending").length;
    const total = brands.length;

    return { owned, pending, total };
  }, [ownedBrands.length, ownerships, brands.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <header className="mb-6 sm:mb-8 relative bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-2xl sm:rounded-3xl shadow-2xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-center overflow-hidden">
          {/* Dekoratif Arka Plan */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl hidden sm:block"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl hidden sm:block"></div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl animate-pulse">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white tracking-tight">
                Markalar Yönetimi
              </h1>
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 animate-pulse hidden sm:block" />
            </div>
            <p className="text-emerald-100 text-sm sm:text-base lg:text-lg font-medium">
              Marka sahipliği başvurularınızı yönetin ve markalarınızı görüntüleyin
            </p>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={CheckCircle}
            label="Sahip Olduklarım"
            value={stats.owned}
            gradient="from-green-500 to-emerald-500"
            bgGradient="from-green-50 to-emerald-50"
          />
          <StatCard
            icon={TrendingUp}
            label="Bekleyen Başvuru"
            value={stats.pending}
            gradient="from-amber-500 to-orange-500"
            bgGradient="from-amber-50 to-orange-50"
          />
          <StatCard
            icon={Package}
            label="Toplam Marka"
            value={stats.total}
            gradient="from-purple-500 to-pink-500"
            bgGradient="from-purple-50 to-pink-50"
          />
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Yeni Marka Oluştur
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6 bg-white rounded-2xl p-2 shadow-lg border-2 border-gray-200">
          {["owned", "status", "all"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
              className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${activeTab === tab
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105"
                : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {tab === "owned" 
                ? "Sahip Olduklarım" 
                : tab === "status"
                ? "Başvuru Durumları"
                : "Tüm Markalar"}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-lg">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-xl animate-pulse mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-500 text-lg font-medium">Yükleniyor...</p>
          </div>
        ) : activeTab === "owned" ? (
          <OwnedBrandsSection ownedBrands={ownedBrands} />
        ) : activeTab === "status" ? (
          <OwnershipStatusSection ownerships={ownerships} />
        ) : (
          <>
            {/* Search Bar */}
            <div className="mb-6 bg-white rounded-2xl shadow-lg p-4 border-2 border-gray-200">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Marka ara..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-800"
                />
              </div>
            </div>

            {/* Brand List */}
            <BrandList
              brands={visibleBrands}
              ownerships={ownerships}
              sending={false}
              onOwnershipRequest={handleOwnershipRequest}
            />

            {/* Pagination */}
            {totalCount > pageSize && (
              <div className="mt-6">
                <Pagination
                  total={totalCount}
                  current={page}
                  perPage={pageSize}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}

        {/* Modals */}
        <CreateBrandModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />

        <OwnershipRequestModal
          isOpen={showRequestModal}
          onClose={() => {
            setShowRequestModal(false);
            setSelectedBrand({ id: null, name: "" });
          }}
          brandId={selectedBrand.id}
          brandName={selectedBrand.name}
          onSuccess={handleRequestSuccess}
        />

        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </div>
    </div>
  );
}

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, gradient, bgGradient }) => (
  <div className={`bg-gradient-to-br ${bgGradient} rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">{label}</p>
        <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">{value}</p>
      </div>
      <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
      </div>
    </div>
  </div>
);
