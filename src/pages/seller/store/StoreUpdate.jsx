import { useEffect, useState } from "react";
import { getMyStore, updateStore, getAllCategories } from "@/api/sellerStoreService";
import { useNavigate } from "react-router-dom";

const StoreUpdate = () => {
  const [form, setForm] = useState(null);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [store, cats] = await Promise.all([getMyStore(), getAllCategories()]);

        const filteredStore = {
          id: store.id, // 🔥 GEREKLİ: API'de ID lazımsa buraya ekle
          storeName: store.storeName || "",
          storeDescription: store.storeDescription || "",
          imageUrl: store.imageUrl || "",
          storePhone: store.storePhone || "",
          storeMail: store.storeMail || "",
          storeProvince: store.storeProvince || "",
          storeDistrict: store.storeDistrict || "",
          categoryIds: store.categoryIds || [],
        };

        setForm(filteredStore);
        setCategories(cats);
      } catch {
        setMessage("❌ Mağaza veya kategori bilgileri alınamadı.");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => parseInt(opt.value));
    setForm((prev) => ({ ...prev, categoryIds: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStore(form.id, form); // ✅ ID artık burada mevcut
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
            value={form[key]}
            onChange={handleChange}
            placeholder={key}
            className="p-2 border border-gray-300 rounded-md text-sm text-[#003636]"
          />
        ))}

        {/* Kategori çoklu seçim alanı */}
        <div className="col-span-full">
          <label className="block mb-1 text-sm font-semibold text-gray-700">Kategoriler</label>
          <select
            multiple
            value={form.categoryIds}
            onChange={handleCategoryChange}
            className="w-full p-2 border border-gray-300 rounded-md text-sm text-[#003636] bg-white"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Seçili kategorileri etiket olarak göster */}
          {form.categoryIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.categoryIds.map((id) => {
                const cat = categories.find((c) => c.id === id);
                return (
                  <span
                    key={id}
                    className="bg-[#E6F4F1] text-[#00665A] px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {cat?.name || `Kategori ${id}`}
                  </span>
                );
              })}
            </div>
          )}
        </div>

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
