import {
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { getDashboardSummary, getWeeklyFinance } from "@/api/sellerFinanceService";

const COLORS = ["#017F5B", "#75D8B1", "#E1ECE5"];

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [weeklyChart, setWeeklyChart] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboard = await getDashboardSummary();
        setSummary(dashboard);

        const weekly = await getWeeklyFinance();
        // Recharts için dönüştür
        const formattedWeekly = [
          { name: "Bu Hafta", value: weekly.totalAmount || 0 },
          { name: "Sipariş", value: weekly.totalOrders || 0 },
        ];
        setWeeklyChart(formattedWeekly);
      } catch (err) {
        console.error("Finans verileri alınamadı:", err);
      }
    };

    fetchData();
  }, []);

  if (!summary) {
    return (
      <div className="p-10 text-center text-gray-500">
        Yükleniyor...
      </div>
    );
  }

  const stats = [
    { title: "Toplam Sipariş", value: summary.totalOrders },
    { title: "Aktif Ürün", value: summary.activeProducts },
    { title: "Toplam Gelir", value: `₺${summary.totalRevenue}` },
    { title: "Bekleyen Kargo", value: summary.pendingShipments },
    { title: "İptal Edilen", value: summary.cancelledOrders },
    { title: "Bekleyen Teklif", value: summary.pendingOffers },
  ];

  return (
    <div className="bg-[#F7F9F8] min-h-screen p-8 font-sans">
      <h2 className="text-3xl font-semibold text-[#003333] mb-6">Satıcı Paneli</h2>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-2xl shadow-sm p-4 border border-[#DCE8E3]"
          >
            <p className="text-sm text-[#607672] mb-1">{stat.title}</p>
            <p className="text-xl font-bold text-[#003333]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart (Örnek) */}
        <div className="col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-[#DCE8E3]">
          <h3 className="text-lg font-semibold text-[#003333] mb-4">Haftalık Finans</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6F0EB" />
              <XAxis dataKey="name" stroke="#607672" />
              <YAxis stroke="#607672" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#017F5B"
                strokeWidth={3}
                dot={{ r: 4, stroke: "#017F5B", strokeWidth: 2, fill: "white" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart (Sipariş Dağılımı) */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#DCE8E3]">
          <h3 className="text-lg font-semibold text-[#003333] mb-4">Sipariş Durumu</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "Tamamlanan", value: summary.totalOrders - summary.pendingShipments - summary.cancelledOrders },
                  { name: "Bekleyen", value: summary.pendingShipments },
                  { name: "İptal", value: summary.cancelledOrders },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
