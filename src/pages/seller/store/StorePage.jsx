import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyStore } from "@/api/sellerStoreService";
import { StoreIcon } from "lucide-react";

const StorePage = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const data = await getMyStore();
        setStore(data);
      } catch (err) {
        setStore(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-lg text-gray-500 animate-pulse">Yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold text-center text-[#003636] mb-10">Mağaza Bilgileri</h2>

      {store ? (
        <div className="bg-white shadow-xl rounded-3xl border border-gray-100 overflow-hidden">
          <div className="flex flex-col sm:flex-row gap-8 p-8 items-start">
            {/* Sol kısım - İkon veya mağaza görseli */}
            <div className="flex-shrink-0">
              <div className="bg-[#003636] text-white p-4 rounded-2xl shadow-md">
                <StoreIcon className="h-10 w-10" />
              </div>
            </div>

            {/* Sağ kısım - Bilgiler */}
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                <StoreField label="Ad" value={store.storeName} />
                <StoreField label="Açıklama" value={store.storeDescription} />
                <StoreField label="Telefon" value={store.storePhone} />
                <StoreField label="Email" value={store.storeMail} />
                <StoreField label="İl" value={store.storeProvince} />
                <StoreField label="İlçe" value={store.storeDistrict} />
              </div>

              <div className="mt-6">
                <label className="font-semibold text-gray-700 block mb-2">Kategoriler:</label>
                <div className="flex flex-wrap gap-2">
                  {(store.categoryIds || []).map((category, index) => (
                    <span
                      key={index}
                      className="bg-[#E6F4F1] text-[#00665A] px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 text-right">
                <button
                  onClick={() => navigate("/seller/store/update")}
                  className="bg-[#003636] hover:bg-[#004848] text-white py-2 px-6 rounded-xl text-sm font-semibold transition"
                >
                  Güncelle
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center">
          <p className="text-gray-600 text-lg mb-4">Henüz bir mağazanız yok. Hemen oluşturarak satış yapmaya başlayabilirsiniz.</p>
          <button
            onClick={() => navigate("/seller/store/create")}
            className="bg-[#003636] hover:bg-[#004848] text-white py-2 px-6 rounded-xl text-sm font-medium transition"
          >
            Mağaza Oluştur
          </button>
        </div>
      )}
    </div>
  );
};

const StoreField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}:</label>
    <p className="text-gray-800">{value || "-"}</p>
  </div>
);

export default StorePage;
