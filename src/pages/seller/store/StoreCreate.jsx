import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createStore, getAllCategories, uploadProductImage } from "@/api/sellerStoreService";

const StoreCreate = () => {
  const [form, setForm] = useState({
    storeName: "",
    storeDescription: "",
    imageUrl: "",
    storePhone: "",
    storeMail: "",
    storeProvince: "",
    storeDistrict: "",
    categoryIds: [],
  });

  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllCategories()
      .then(setCategories)
      .catch(() => setMessage("❌ Kategoriler alınamadı."));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) =>
      parseInt(opt.value)
    );
    setForm({ ...form, categoryIds: selected });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setUploading(true);
    try {
      // Görsel yükleme
      const storeProductId = 0; // Bu sadece görsel yükleme API'ye özel, gerekmeyebilir veya değiştirilebilir
      const formData = new FormData();
      formData.append("file", file);

      // API endpoint'ine uygun şekilde güncelle (kendi mağaza görsel yükleme endpoint'in varsa onu kullan!)
      const response = await uploadProductImage(storeProductId, file);

      if (response?.url) {
        setForm({ ...form, imageUrl: response.url });
      } else {
        alert("Görsel yüklenemedi.");
      }
    } catch (err) {
      alert("❌ Görsel yükleme hatası.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStore(form);
      navigate("/seller/store");
    } catch (err) {
      setMessage("❌ Mağaza oluşturulamadı.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#003636] text-center">Mağaza Oluştur</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 bg-white p-6 rounded-xl shadow">

        <input
          name="storeName"
          value={form.storeName}
          onChange={handleChange}
          placeholder="Mağaza Adı"
          required
          className="p-2 border border-gray-300 rounded-md"
        />

        <textarea
          name="storeDescription"
          value={form.storeDescription}
          onChange={handleChange}
          placeholder="Mağaza Açıklaması"
          required
          className="p-2 border border-gray-300 rounded-md"
        />

        {/* Görsel Yükleme */}
        <div>
          <label className="block text-sm font-medium mb-1">Mağaza Görseli</label>
          <input type="file" onChange={handleImageChange} accept="image/*" className="w-full" />
          {uploading && <p className="text-sm text-gray-500 mt-1">Yükleniyor...</p>}
          {form.imageUrl && (
            <img src={form.imageUrl} alt="Mağaza Görseli" className="mt-2 w-32 h-32 object-cover rounded-md" />
          )}
        </div>

        <input
          name="storePhone"
          value={form.storePhone}
          onChange={handleChange}
          placeholder="Mağaza Telefonu"
          required
          className="p-2 border border-gray-300 rounded-md"
        />

        <input
          name="storeMail"
          value={form.storeMail}
          onChange={handleChange}
          placeholder="Mağaza E-posta"
          required
          className="p-2 border border-gray-300 rounded-md"
        />

        <input
          name="storeProvince"
          value={form.storeProvince}
          onChange={handleChange}
          placeholder="İl"
          required
          className="p-2 border border-gray-300 rounded-md"
        />

        <input
          name="storeDistrict"
          value={form.storeDistrict}
          onChange={handleChange}
          placeholder="İlçe"
          required
          className="p-2 border border-gray-300 rounded-md"
        />

        {/* Sektör / Kategori Seçimi */}
        <select
          multiple
          value={form.categoryIds}
          onChange={handleCategoryChange}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option disabled>📂 Sektör Seçin (CTRL + Click ile çoklu)</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-[#003636] text-white py-2 rounded-lg hover:bg-[#004848]"
        >
          Mağazayı Oluştur
        </button>

        {message && <p className="text-center text-red-600">{message}</p>}
      </form>
    </div>
  );
};

export default StoreCreate;
