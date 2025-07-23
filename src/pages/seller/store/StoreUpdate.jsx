import { useEffect, useState } from "react";
import { getMyStore, updateStore, getAllCategories, uploadProductImage } from "@/api/sellerStoreService";
import { useNavigate } from "react-router-dom";

const StoreUpdate = () => {
  const [form, setForm] = useState(null);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [store, cats] = await Promise.all([getMyStore(), getAllCategories()]);
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
      const alreadySelected = prev.categoryIds.includes(catId);
      const updated = alreadySelected
        ? prev.categoryIds.filter((id) => id !== catId)
        : [...prev.categoryIds, catId];
      return { ...prev, categoryIds: updated };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setUploading(true);
    try {
      // örnek: uploadProductImage API’si mağaza görseli için kullanılabiliyorsa
      const storeProductId = 0; // veya gerek yoksa API’nizde değiştirin
      const response = await uploadProductImage(storeProductId, file);
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
    try {
      await updateStore(form.id, form);
      setMessage("✅ Mağaza başarıyla güncellendi.");
      setTimeout(() => navigate("/seller/store"), 1200);
    } catch {
      setMessage("❌ Güncelleme sırasında bir hata oluştu.");
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
        className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white p-6 rounded-xl shadow border"
      >
        {/* Text Fields */}
        {[
          { name: "storeName", label: "Mağaza Adı" },
          { name: "storeDescription", label: "Açıklama" },
          { name: "storePhone", label: "Telefon" },
          { name: "storeMail", label: "E-posta" },
          { name: "storeProvince", label: "İl" },
          { name: "storeDistrict", label: "İlçe" },
        ].map(({ name, label }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={label}
              className="w-full p-2 border border-gray-300 rounded-md text-sm text-[#003636] shadow-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>
        ))}

        {/* Görsel Yükleme */}
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">Mağaza Görseli</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {uploading && <p className="text-sm text-gray-500 mt-1">Yükleniyor...</p>}
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Mağaza Görseli"
              className="mt-3 w-32 h-32 object-cover rounded-md"
            />
          )}
        </div>

        {/* Kategori Seçimi */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sektörler (Kategoriler)</label>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const isSelected = form.categoryIds.includes(cat.id);
              return (
                <label
                  key={cat.id}
                  className={`flex items-center gap-2 px-3 py-2 border rounded-md text-sm cursor-pointer transition
                    ${
                      isSelected
                        ? "bg-green-100 border-green-400 text-green-800 font-medium"
                        : "bg-white border-gray-300 hover:border-green-500"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleCategory(cat.id)}
                    className="accent-green-600"
                  />
                  {cat.name}
                </label>
              );
            })}
          </div>

          {form.categoryIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
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

        {/* Güncelle Butonu */}
        <div className="col-span-full">
          <button
            type="submit"
            className="w-full bg-[#003636] hover:bg-[#004848] text-white font-semibold py-2 rounded-lg transition"
          >
            Güncelle
          </button>
        </div>

        {/* Mesaj */}
        {message && (
          <div
            className={`col-span-full text-center text-sm font-medium mt-2 ${
              message.startsWith("✅") ? "text-green-700" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default StoreUpdate;
