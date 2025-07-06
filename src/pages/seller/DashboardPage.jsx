// src/pages/seller/DashboardPage.jsx
const DashboardPage = () => {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Hoşgeldin Satıcı 👋</h2>
        <p className="text-gray-600 mb-8">Siparişlerini, ürünlerini ve satışlarını buradan yönetebilirsin.</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">🛒 Toplam Sipariş: 23</div>
          <div className="bg-white p-6 rounded-lg shadow-md">📦 Aktif Ürün: 8</div>
          <div className="bg-white p-6 rounded-lg shadow-md">💰 Gelir: ₺12.500</div>
        </div>
      </div>
    );
  };
  
  export default DashboardPage;
  