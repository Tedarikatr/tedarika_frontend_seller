import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SellerCampaignService from "@/api/sellerCampaignService";
import { PlusCircle, Search, Calendar, RefreshCw } from "lucide-react";
import { getMyStore } from "@/api/sellerStoreService";
import { isStoreNotFoundError } from "@/utils/storeNotFound";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TedarikaLoader from "@/components/ui/TedarikaLoader";

export default function CampaignListPage() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasStore, setHasStore] = useState(true);
  const [storeNotFoundMessage, setStoreNotFoundMessage] = useState(null);
  const navigate = useNavigate();

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const store = await getMyStore();
      if (!store || !store.id) {
        setHasStore(false);
        return;
      }

      const res = await SellerCampaignService.getAll();
      setRows(res || []);
    } catch (err) {
      console.error("Kampanyalar alınamadı:", err);
      setHasStore(false);
      setStoreNotFoundMessage(isStoreNotFoundError(err) ? err.message : null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const filteredRows = rows.filter((c) =>
    c?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // 🕒 Yükleniyor
  if (loading) {
    return <TedarikaLoader variant="section" />;
  }

  // ⚠️ Mağaza Yoksa
  if (!hasStore) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#e6f4f1] via-[#f1f9f7] to-[#f9fdfc] px-4 sm:px-6">
        <div className="bg-white border border-[#00a99d]/30 shadow-xl rounded-xl sm:rounded-2xl px-6 sm:px-8 py-5 sm:py-6 max-w-lg flex flex-col items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#00a99d]/10 text-[#00a99d] rounded-full">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-[#003636]">
            Henüz bir mağazanız yok
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            {storeNotFoundMessage || "Kampanyaları yönetebilmek için önce bir mağaza oluşturmalısınız."}
          </p>
          <button
            onClick={() => navigate("/seller/store/create")}
            className="mt-3 bg-[#00a99d] hover:bg-[#007a71] text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 rounded-lg transition"
          >
            Mağaza Oluştur
          </button>
        </div>
      </div>
    );
  }

  // ✅ Mağaza varsa normal liste
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8 lg:space-y-10 animate-fadeIn">
      {/* ÜST BAŞLIK */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#003636]">Kampanyalarım</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Aktif, taslak ve geçmiş kampanyalarınızı buradan yönetebilirsiniz.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={fetchCampaigns}
            className="flex items-center gap-1.5 sm:gap-2 border border-[#00a99d] text-[#00a99d] px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-[#00a99d]/10 transition"
          >
            <RefreshCw size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Yenile</span>
          </button>
          <Link
            to="/seller/campaigns/new"
            className="flex items-center gap-1.5 sm:gap-2 bg-[#00a99d] hover:bg-[#007a71] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold shadow transition"
          >
            <PlusCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">Yeni Kampanya</span>
            <span className="sm:hidden">Yeni</span>
          </Link>
        </div>
      </div>

      {/* ARAMA ALANI */}
      <div className="relative w-full md:w-1/3">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Kampanya adıyla ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#00a99d] outline-none transition"
        />
      </div>

      {/* KAMPANYA LİSTESİ */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
        {filteredRows.length === 0 ? (
          <div className="p-20 text-center text-gray-400 text-sm space-y-4 bg-[#f9fdfc]">
            <div className="text-5xl font-light text-[#00a99d]/30">—</div>
            <p className="text-base font-medium text-gray-700">
              Henüz kampanya bulunmuyor
            </p>
            <p className="text-xs text-gray-500">
              Yeni bir kampanya oluşturmak için{" "}
              <span className="font-semibold text-[#00a99d]">
                “Yeni Kampanya”
              </span>{" "}
              butonunu kullanabilirsiniz.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredRows.map((c) => (
              <Link
                key={c.id}
                to={`/seller/campaigns/${c.id}`}
                className="flex flex-col md:flex-row justify-between md:items-center p-4 sm:p-6 hover:bg-[#e8f5f3] transition"
              >
                {/* SOL ALAN */}
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="font-semibold text-[#003636] text-base sm:text-lg truncate">
                    {c.name || "İsimsiz Kampanya"}
                  </div>
                  <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500">
                    <StatusBadge status={c.status} />
                    <span className="truncate">{c.kind}</span>
                    {c.requiresCoupon && (
                      <span className="bg-[#00a99d]/10 text-[#00a99d] px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap">
                        Kuponlu
                      </span>
                    )}
                  </div>
                </div>

                {/* SAĞ ALAN */}
                <div className="flex flex-col md:flex-row md:items-center gap-2 text-xs sm:text-sm text-gray-600 mt-3 md:mt-0">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="sm:w-[15px] sm:h-[15px] text-gray-400 flex-shrink-0" />
                    <span className="truncate">
                      {formatDate(c.startsAt)} — {formatDate(c.endsAt)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    Öncelik: {c.priority ?? "-"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* 🔧 ALT BİLEŞENLER */
const StatusBadge = ({ status }) => {
  const colorMap = {
    Draft: "bg-gray-100 text-gray-700",
    Active: "bg-[#e1f5f2] text-[#00a99d]",
    Paused: "bg-yellow-100 text-yellow-700",
    Ended: "bg-red-100 text-red-700",
  };
  const textMap = {
    Draft: "Taslak",
    Active: "Aktif",
    Paused: "Durduruldu",
    Ended: "Bitti",
  };

  return (
    <span
      className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
        colorMap[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {textMap[status] || "Bilinmiyor"}
    </span>
  );
};

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("tr-TR") : "-";
