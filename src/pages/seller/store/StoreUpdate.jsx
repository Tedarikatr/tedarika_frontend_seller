import { useEffect, useState } from "react";
import {
  getMyStore,
  updateStore,
  getAllCategories,
  uploadProductImage,
} from "@/api/sellerStoreService";
import { useNavigate } from "react-router-dom";
import { Store, Upload } from "lucide-react";

const StoreUpdate = () => {
  const [form, setForm] = useState(null);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [store, cats] = await Promise.all([
          getMyStore(),
          getAllCategories(),
        ]);
        setForm({
          id: store.id,
          storeName: store.storeName || "",
          storeDescription: store.storeDescription || "",
          imageUrl: store.imageUrl || "",
          storePhone: store.storePhone || "",
          storeMail: store.storeMail || "",
          storeProvince: store.storeProvince || "",
          storeDistrict: store.storeDistrict || "",
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

  const toggleCategory = (catId) => {
    setForm((prev) => {
      const updated = prev.categoryIds.includes(catId)
        ? prev.categoryIds.filter((id) => id !== catId)
        : [...prev.categoryIds, catId];
      return { ...prev, categoryIds: updated };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const response = await uploadProductImage(0, file);
      if (response?.url) {
        setForm((prev) => ({ ...prev, imageUrl: response.url }));
      } else {
        alert("Görsel yüklenemedi.");
      }
    } catch {
      alert("❌ Görsel yükleme hatası.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await updateStore(form.id, form);
      setMessage("✅ Mağaza başarıyla güncellendi.");
      setTimeout(() => navigate("/seller/store"), 1500);
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
        {/* Başlık */}
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-[#003636] text-white p-3 rounded-full">
            <Store size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#003636]">
              Mağaza Bilgilerini Güncelle
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Mağazanıza ait bilgileri güncelleyin ve görünürlüğünüzü artırın.
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* Text input alanları */}
          {[
            { name: "storeName", label: "Mağaza Adı" },
            { name: "storeDescription", label: "Açıklama" },
            { name: "storePhone", label: "Telefon" },
            { name: "storeMail", label: "E-posta" },
            { name: "storeProvince", label: "İl" },
            { name: "storeDistrict", label: "İlçe" },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="text-sm text-gray-600 font-medium mb-1">
                {field.label}
              </label>
              <input
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.label}
                className="p-2.5 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-[#00665a] focus:outline-none bg-gray-50"
              />
            </div>
          ))}

          {/* Görsel alanı */}
          <div className="col-span-full">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Mağaza Görseli
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm"
              />
              {uploading && <span className="text-sm text-gray-500">Yükleniyor...</span>}
            </div>
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="Mağaza Görseli"
                className="mt-3 w-32 h-32 object-cover border border-gray-200 rounded-lg shadow"
              />
            )}
          </div>

          {/* Kategori seçimi */}
          <div className="col-span-full mt-2">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Kategori Seçimi
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => {
                const selected = form.categoryIds.includes(cat.id);
                return (
                  <label
                    key={cat.id}
                    className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition cursor-pointer
                      ${
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

          {/* Seçilen kategoriler etiketi */}
          {form.categoryIds.length > 0 && (
            <div className="col-span-full flex flex-wrap gap-2 mt-4">
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

          {/* Submit butonu */}
          <div className="col-span-full mt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#003636] to-[#005e5e] text-white font-semibold py-3 rounded-lg shadow-lg hover:brightness-110 transition"
            >
              Güncelle
            </button>
          </div>

          {/* Mesaj */}
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
