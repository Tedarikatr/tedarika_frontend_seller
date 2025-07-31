import { useEffect, useState } from "react";
import {
  getMyStore,
  updateStore,
  getAllCategories,
} from "@/api/sellerStoreService";
import { Store } from "lucide-react";

const StoreUpdate = () => {
  const [form, setForm] = useState(null);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [store, cats] = await Promise.all([
          getMyStore(),
          getAllCategories(),
        ]);
        setForm({
          storeName: store.storeName || "",
          storeDescription: store.storeDescription || "",
          logoFile: null,
          bannerFile: null,
          categoryIds: store.categoryIds || [],
        });
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

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, [type]: file }));
    }
  };

  const toggleCategory = (catId) => {
    setForm((prev) => {
      const updated = prev.categoryIds.includes(catId)
        ? prev.categoryIds.filter((id) => id !== catId)
        : [...prev.categoryIds, catId];
      return { ...prev, categoryIds: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await updateStore(form);
      setMessage("✅ Mağaza başarıyla güncellendi.");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("❌ Güncelleme sırasında bir hata oluştu.");
    }
  };

  if (!form) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 animate-pulse">
        Mağaza bilgileri yükleniyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafb] to-[#e6f3f2] py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto bg-white border border-gray-200 shadow-2xl rounded-2xl p-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-[#003636] text-white p-3 rounded-full">
            <Store size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#003636]">Mağaza Bilgilerini Güncelle</h2>
            <p className="text-sm text-gray-600 mt-1">
              Mağazanıza ait bilgileri güncelleyin ve görünürlüğünüzü artırın.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input
            name="storeName"
            value={form.storeName}
            onChange={handleChange}
            placeholder="Mağaza Adı"
            className="p-3 border rounded-md"
          />
          <textarea
            name="storeDescription"
            value={form.storeDescription}
            onChange={handleChange}
            placeholder="Açıklama"
            className="p-3 border rounded-md col-span-full"
          />

          <div className="col-span-full">
            <label className="text-sm font-medium text-gray-700 block mb-2">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "logoFile")}
              className="text-sm"
            />
            {form.logoFile && (
              <span className="text-sm text-gray-600 mt-1 block">
                {form.logoFile.name}
              </span>
            )}
          </div>

          <div className="col-span-full">
            <label className="text-sm font-medium text-gray-700 block mb-2">Banner</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "bannerFile")}
              className="text-sm"
            />
            {form.bannerFile && (
              <span className="text-sm text-gray-600 mt-1 block">
                {form.bannerFile.name}
              </span>
            )}
          </div>

          <div className="col-span-full mt-2">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Kategoriler</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => {
                const selected = form.categoryIds.includes(cat.id);
                return (
                  <label
                    key={cat.id}
                    className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition cursor-pointer ${
                      selected
                        ? "bg-green-100 border-green-500 text-green-800 font-semibold"
                        : "bg-white border-gray-300 hover:border-green-400"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleCategory(cat.id)}
                      className="accent-green-600"
                    />
                    {cat.name}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="col-span-full mt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#003636] to-[#005e5e] text-white font-semibold py-3 rounded-lg shadow-lg hover:brightness-110 transition"
            >
              Güncelle
            </button>
          </div>

          {message && (
            <div
              className={`col-span-full text-center mt-3 text-sm font-medium ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default StoreUpdate;
