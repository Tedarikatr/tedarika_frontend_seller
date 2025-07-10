import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createStore, getAllCategories } from "@/api/sellerStoreService";

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
        {["storeName", "storeDescription", "imageUrl", "storePhone", "storeMail", "storeProvince", "storeDistrict"].map((key) => (
          <input
            key={key}
            name={key}
            value={form[key]}
            onChange={handleChange}
            placeholder={key}
            required
            className="p-2 border border-gray-300 rounded-md"
          />
        ))}

        {/* Çoklu kategori dropdown */}
        <select
          multiple
          value={form.categoryIds}
          onChange={handleCategoryChange}
          className="p-2 border border-gray-300 rounded-md"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button type="submit" className="bg-[#003636] text-white py-2 rounded-lg hover:bg-[#004848]">
          Oluştur
        </button>

        {message && <p className="text-center text-red-600">{message}</p>}
      </form>
    </div>
  );
};

export default StoreCreate;
