import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyStore } from "@/api/sellerStoreService";
import { StoreIcon, PlusCircle } from "lucide-react";

const StorePage = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const data = await getMyStore();
        setStore(data);
      } catch {
        setStore(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <span className="text-lg text-gray-500 animate-pulse">Mağaza bilgileri yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#003636] mb-10">
        Mağaza Bilgilerim
      </h2>

      {store ? (
        <div className="bg-white shadow-xl rounded-3xl border border-gray-100 overflow-hidden">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 p-8 items-start">
            {/* Sol: Görsel veya İkon */}
            <div className="flex-shrink-0">
              {store.imageUrl ? (
                <img
                  src={store.imageUrl}
                  alt="Mağaza Görseli"
                  className="w-28 h-28 rounded-2xl object-cover border border-gray-200 shadow"
                />
              ) : (
                <div className="bg-[#003636] text-white p-5 rounded-2xl shadow-md flex items-center justify-center w-28 h-28">
                  <StoreIcon className="h-10 w-10" />
                </div>
              )}
            </div>

            {/* Sağ: Bilgiler */}
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
                <StoreField label="Mağaza Adı" value={store.storeName} />
                <StoreField label="Açıklama" value={store.storeDescription} />
                <StoreField label="Telefon" value={store.storePhone} />
                <StoreField label="E-posta" value={store.storeMail} />
                <StoreField label="İl" value={store.storeProvince} />
                <StoreField label="İlçe" value={store.storeDistrict} />
              </div>

              <div className="mt-8 text-right">
                <button
                  onClick={() => navigate("/seller/store/update")}
                  className="bg-[#003636] hover:bg-[#004848] text-white py-2.5 px-6 rounded-xl text-sm font-semibold transition"
                >
                  Mağaza Bilgilerini Güncelle
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-3xl shadow-md flex flex-col items-center text-center border border-gray-100">
          <div className="bg-[#e0f2f1] text-[#003636] p-4 rounded-full mb-4">
            <StoreIcon className="h-8 w-8" />
          </div>
          <p className="text-gray-600 text-lg mb-4 max-w-md">
            Henüz bir mağazanız bulunmuyor. Aşağıdaki buton ile mağazanızı oluşturabilir ve satışa başlayabilirsiniz.
          </p>
          <button
            onClick={() => navigate("/seller/store/create")}
            className="bg-[#003636] hover:bg-[#004848] text-white py-2.5 px-5 rounded-xl text-sm font-medium flex items-center gap-2 transition"
          >
            <PlusCircle size={18} />
            Mağaza Oluştur
          </button>
        </div>
      )}
    </div>
  );
};

const StoreField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
    <p className="text-gray-800 font-medium">{value || "-"}</p>
  </div>
);

export default StorePage;
