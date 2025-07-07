import { useEffect, useState } from "react";
import { getMyStore, updateStore } from "@/api/sellerStoreService";
import { useNavigate } from "react-router-dom";

const StoreUpdate = () => {
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const store = await getMyStore();
        setForm(store);
      } catch {
        setMessage("❌ Mağaza bilgileri alınamadı.");
      }
    };
    fetchStore();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await updateStore(form.id, form);
      setMessage("✅ Mağaza başarıyla güncellendi.");
      setTimeout(() => navigate("/seller/store"), 1000);
    } catch {
      setMessage("❌ Güncelleme sırasında hata oluştu.");
    }
  };

  if (!form) return <div className="p-6">Yükleniyor...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#003636] text-center">
        Mağaza Bilgilerini Güncelle
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow"
      >
        {[
          "storeName",
          "storeDescription",
          "imageUrl",
          "storePhone",
          "storeMail",
          "storeProvince",
          "storeDistrict",
        ].map((key) => (
          <input
            key={key}
            name={key}
            value={form[key] || ""}
            onChange={handleChange}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            className="p-2 border border-gray-300 rounded-md text-sm text-[#003636]"
          />
        ))}

        {/* Kategori ID’leri string olarak veriliyor (örn: 1,2,3) */}
        <input
          name="categoryIds"
          value={(form.categoryIds || []).join(",")}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              categoryIds: e.target.value
                .split(",")
                .map((id) => parseInt(id.trim()))
                .filter((id) => !isNaN(id)),
            }))
          }
          placeholder="Kategori ID’leri (virgülle ayrılmış)"
          className="col-span-full p-2 border border-gray-300 rounded-md text-sm text-[#003636]"
        />

        <div className="col-span-full">
          <button
            type="submit"
            className="w-full bg-[#003636] hover:bg-[#004848] text-white font-semibold py-2 rounded-lg transition"
          >
            Güncelle
          </button>
        </div>

        {message && (
          <div className="col-span-full text-center text-sm font-medium mt-2 text-red-600">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default StoreUpdate;
