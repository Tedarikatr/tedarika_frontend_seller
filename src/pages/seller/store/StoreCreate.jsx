import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createStore, getAllCategories } from "@/api/sellerStoreService";

const StoreCreate = () => {
  const [form, setForm] = useState({
    storeName: "",
    storeDescription: "",
    imageFile: null,
    storePhone: "",
    storeMail: "",
    storeProvince: "",
    storeDistrict: "",
    categoryIds: [],
  });

  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getAllCategories()
      .then(setCategories)
      .catch(() => setMessage("Kategoriler alınamadı."));
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, imageFile: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.storeName.trim()) {
      return setMessage("Mağaza adı zorunludur.");
    }
    if (form.categoryIds.length === 0) {
      return setMessage("En az bir kategori seçilmelidir.");
    }

    try {
      setMessage("Mağaza oluşturuluyor...");
      await createStore(form);
      navigate("/seller/store");
    } catch {
      setMessage("Mağaza oluşturulamadı.");
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

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg grid gap-5"
      >
        <input
          name="storeName"
          value={form.storeName}
          onChange={handleChange}
          placeholder="Mağaza Adı *"
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003636]"
        />

        <textarea
          name="storeDescription"
          value={form.storeDescription}
          onChange={handleChange}
          placeholder="Mağaza Açıklaması"
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003636]"
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Mağaza Görseli</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="text-sm"
          />
          {form.imageFile && (
            <span className="text-sm text-gray-600">{form.imageFile.name}</span>
          )}
        </div>

        <input
          name="storePhone"
          type="tel"
          value={form.storePhone}
          onChange={handleChange}
          placeholder="Telefon"
          className="p-3 border border-gray-300 rounded-md"
        />

        <input
          name="storeMail"
          type="email"
          value={form.storeMail}
          onChange={handleChange}
          placeholder="E-posta"
          className="p-3 border border-gray-300 rounded-md"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            name="storeProvince"
            value={form.storeProvince}
            onChange={handleChange}
            placeholder="İl"
            className="p-3 border border-gray-300 rounded-md"
          />
          <input
            name="storeDistrict"
            value={form.storeDistrict}
            onChange={handleChange}
            placeholder="İlçe"
            className="p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategoriler
          </label>
          <select
            multiple
            value={form.categoryIds}
            onChange={handleCategoryChange}
            className="w-full p-3 border border-gray-300 rounded-md text-sm"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-[#003636] hover:bg-[#004848] text-white font-semibold py-2 rounded-lg transition"
        >
          Mağazayı Oluştur
        </button>
      </form>
    </div>
  );
};

export default StoreCreate;
