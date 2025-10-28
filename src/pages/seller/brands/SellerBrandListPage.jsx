import { useState, useEffect, useMemo } from "react";
import {
  getBrandList,
  getBrandOwnership,
  getOwnedBrands,
  requestBrandOwnership,
} from "@/api/sellerBrandService";
import OwnedBrandsSection from "@/components/Brand/OwnedBrandsSection";
import BrandList from "@/components/Brand/BrandList";
import Pagination from "@/components/ui/Pagination";
import Toast from "@/components/ui/Toast";

export default function SellerBrandPage() {
  const [brands, setBrands] = useState([]);
  const [ownerships, setOwnerships] = useState([]);
  const [ownedBrands, setOwnedBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [activeTab, setActiveTab] = useState("owned");

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

  const handleOwnershipRequest = async (brandId, type = "Owner") => {
    const payload = {
      brandId,
      ownershipType: type,
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      notes: "Marka sahipliği başvurusu",
    };
    setSending(true);
    try {
      await requestBrandOwnership(payload);
      await fetchData();
      showToast("Başvuru başarıyla gönderildi!", "success");
    } catch (err) {
      showToast("Başvuru hatası: " + err.message, "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Markalar Yönetimi</h2>

      {/* Sekmeler */}
      <div className="flex gap-6 border-b pb-2">
        {["owned", "all"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "owned" ? "Sahip Olduklarım" : "Tüm Markalar"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-600">Yükleniyor...</p>
      ) : activeTab === "owned" ? (
        <OwnedBrandsSection ownedBrands={ownedBrands} />
      ) : (
        <>
          {/* Arama */}
          <div className="flex gap-3 mb-5">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Marka ara..."
              className="border rounded-md px-3 py-2 w-1/2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Marka Listesi */}
          <BrandList
            brands={visibleBrands}
            ownerships={ownerships}
            sending={sending}
            onOwnershipRequest={handleOwnershipRequest}
          />

          {/* Sayfalama */}
          <Pagination
            total={totalCount}
            current={page}
            perPage={pageSize}
            onPageChange={setPage}
          />
        </>
      )}

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
