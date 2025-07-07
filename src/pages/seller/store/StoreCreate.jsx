import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStore } from "@/api/sellerStoreService";

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

  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      form.categoryIds = form.categoryIds.split(",").map((id) => Number(id.trim()));
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
        {[
          "storeName", "storeDescription", "imageUrl", "storePhone", "storeMail",
          "storeProvince", "storeDistrict"
        ].map((key) => (
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

        <input
          name="categoryIds"
          value={form.categoryIds}
          onChange={handleChange}
          placeholder="Kategori ID'leri (virgülle ayır)"
          required
          className="p-2 border border-gray-300 rounded-md"
        />

        <button type="submit" className="bg-[#003636] text-white py-2 rounded-lg hover:bg-[#004848]">
          Oluştur
        </button>

        {message && <p className="text-center text-red-600">{message}</p>}
      </form>
    </div>
  );
};

export default StoreCreate;
