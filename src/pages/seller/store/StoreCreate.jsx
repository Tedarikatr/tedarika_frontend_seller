import { useState, useEffect } from "react";
import { createStore, getAllCategories } from "@/api/sellerStoreService";
import { useNavigate } from "react-router-dom";

const StoreCreate = () => {
  const [form, setForm] = useState({
    storeName: "",
    storeDescription: "",
    logoFile: null,
    bannerFile: null,
    categoryIds: [],
  });
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getAllCategories().then(setCategories).catch(() => {
      setMessage("❌ Kategoriler alınamadı.");
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) setForm((prev) => ({ ...prev, [type]: file }));
  };

  const handleCategoryChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) =>
      parseInt(opt.value)
    );
    setForm({ ...form, categoryIds: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.storeName.trim()) return setMessage("Mağaza adı zorunludur.");
    if (!form.logoFile) return setMessage("Logo zorunludur.");
    if (form.categoryIds.length === 0)
      return setMessage("En az bir kategori seçilmelidir.");

    try {
      setMessage("Mağaza oluşturuluyor...");
      await createStore(form);
      navigate("/seller/store");
    } catch {
      setMessage("❌ Mağaza oluşturulamadı.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-[#003636] mb-8">
        Mağaza Oluştur
      </h2>

      {message && (
        <div className="mb-6 text-sm px-4 py-3 border rounded-md bg-yellow-50 text-yellow-800 border-yellow-300 text-center">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-5 bg-white p-6 rounded-xl shadow-md">
        <input
          name="storeName"
          value={form.storeName}
          onChange={handleChange}
          placeholder="Mağaza Adı *"
          className="p-3 border rounded-md"
        />

        <textarea
          name="storeDescription"
          value={form.storeDescription}
          onChange={handleChange}
          placeholder="Mağaza Açıklaması"
          className="p-3 border rounded-md"
        />

        <div>
          <label className="text-sm font-semibold">Logo (zorunlu)</label>
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "logoFile")} />
        </div>

        <div>
          <label className="text-sm font-semibold">Banner (opsiyonel)</label>
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "bannerFile")} />
        </div>

        <div>
          <label className="text-sm font-semibold">Kategoriler</label>
          <select multiple value={form.categoryIds} onChange={handleCategoryChange} className="w-full border p-2 rounded-md">
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-[#003636] hover:bg-[#004848] text-white font-semibold py-2 rounded-lg"
        >
          Mağazayı Oluştur
        </button>
      </form>
    </div>
  );
};

export default StoreCreate;
