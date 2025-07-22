import {
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { getDashboardSummary, getWeeklyFinance } from "@/api/sellerFinanceService";
import { motion } from "framer-motion";
import { FaBoxOpen, FaLiraSign, FaTruck, FaBan, FaClipboardList, FaCheckCircle } from "react-icons/fa";

const COLORS = ["#00A982", "#74D6BA", "#E2F0EA"];

const iconMap = {
  "Toplam Sipariş": <FaClipboardList className="text-[#00A982]" size={24} />,
  "Aktif Ürün": <FaBoxOpen className="text-[#00A982]" size={24} />,
  "Toplam Gelir": <FaLiraSign className="text-[#00A982]" size={24} />,
  "Bekleyen Kargo": <FaTruck className="text-[#00A982]" size={24} />,
  "İptal Edilen": <FaBan className="text-[#00A982]" size={24} />,
  "Bekleyen Teklif": <FaCheckCircle className="text-[#00A982]" size={24} />,
};

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [weeklyChart, setWeeklyChart] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboard = await getDashboardSummary();
        setSummary(dashboard);

        const weekly = await getWeeklyFinance();
        setWeeklyChart([
          { name: "Bu Hafta", value: weekly.totalAmount || 0 },
          { name: "Sipariş", value: weekly.totalOrders || 0 },
        ]);
      } catch (err) {
        console.error("Finans verileri alınamadı:", err);
      }
    };

    fetchData();
  }, []);

  if (!summary) {
    return (
      <div className="p-10 text-center text-gray-500 text-lg animate-pulse">Yükleniyor...</div>
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
    <div className="min-h-screen bg-gradient-to-br from-[#e6f4f1] via-[#f1f9f7] to-[#f9fdfc] px-6 py-10 font-sans">
      <motion.h1
        className="text-3xl sm:text-4xl font-bold text-[#003a32] mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Satıcı Paneli
      </motion.h1>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 mb-10">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.title}
            className="bg-white/90 backdrop-blur-lg border border-[#D7E6E0] shadow-md rounded-2xl px-4 py-5 hover:shadow-lg transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">{stat.title}</p>
              {iconMap[stat.title]}
            </div>
            <p className="text-2xl font-semibold text-[#00443d]">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Grafikler */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {/* Line Chart */}
        <motion.div
          className="col-span-2 bg-white border border-[#D7E6E0] rounded-2xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold text-[#00443d] mb-4">
            Haftalık Finans
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weeklyChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6F0EB" />
              <XAxis dataKey="name" stroke="#607672" />
              <YAxis stroke="#607672" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#00A982"
                strokeWidth={3}
                dot={{
                  r: 5,
                  stroke: "#00A982",
                  strokeWidth: 2,
                  fill: "white",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          className="bg-white border border-[#D7E6E0] rounded-2xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold text-[#00443d] mb-4">
            Sipariş Dağılımı
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={[
                  {
                    name: "Tamamlanan",
                    value:
                      summary.totalOrders -
                      summary.pendingShipments -
                      summary.cancelledOrders,
                  },
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
                  <Cell key={index} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "13px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
