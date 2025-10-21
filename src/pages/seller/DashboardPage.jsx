import {
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { getDashboardSummary, getWeeklyFinance } from "@/api/sellerFinanceService";
import { getMyStore } from "@/api/sellerStoreService";
import { motion } from "framer-motion";
import { FaBoxOpen, FaLiraSign, FaTruck, FaBan, FaClipboardList, FaCheckCircle } from "react-icons/fa";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const [hasStore, setHasStore] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const store = await getMyStore();
        if (!store || !store.id) {
          setHasStore(false);
          setLoading(false);
          return;
        }

        const dashboard = await getDashboardSummary().catch(() => null);
        const weekly = await getWeeklyFinance().catch(() => ({}));

        setSummary(dashboard || {});
        setWeeklyChart([
          { name: "Bu Hafta", value: weekly?.totalAmount || 0 },
          { name: "Sipariş", value: weekly?.totalOrders || 0 },
        ]);
      } catch (err) {
        console.error("Dashboard verileri alınamadı:", err);
        setHasStore(false); // hata alınırsa mağaza yok gibi davran
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 text-lg animate-pulse">
        Yükleniyor...
      </div>
    );
  }

  if (!hasStore) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#e6f4f1] via-[#f1f9f7] to-[#f9fdfc] px-6">
        <div className="bg-white border border-yellow-400 shadow-xl rounded-2xl px-8 py-6 max-w-lg flex flex-col items-center gap-3">
          <AlertCircle className="w-10 h-10 text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-800">
            Henüz bir mağazanız yok
          </h2>
          <p className="text-sm text-gray-600">
            Satışa başlayabilmek için bir mağaza oluşturmalısınız.
          </p>
          <button
            onClick={() => navigate("/seller/store/create")}
            className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
          >
            Mağaza Oluştur
          </button>
        </div>
      </div>
    );
  }

  const safeSummary = {
    totalOrders: summary?.totalOrders ?? 0,
    activeProducts: summary?.activeProducts ?? 0,
    totalRevenue: summary?.totalRevenue ?? 0,
    pendingShipments: summary?.pendingShipments ?? 0,
    cancelledOrders: summary?.cancelledOrders ?? 0,
    pendingOffers: summary?.pendingOffers ?? 0,
  };

  const stats = [
    { title: "Toplam Sipariş", value: safeSummary.totalOrders },
    { title: "Aktif Ürün", value: safeSummary.activeProducts },
    { title: "Toplam Gelir", value: `₺${safeSummary.totalRevenue}` },
    { title: "Bekleyen Kargo", value: safeSummary.pendingShipments },
    { title: "İptal Edilen", value: safeSummary.cancelledOrders },
    { title: "Bekleyen Teklif", value: safeSummary.pendingOffers },
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
          visible: { transition: { staggerChildren: 0.2 } },
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
                      safeSummary.totalOrders -
                      safeSummary.pendingShipments -
                      safeSummary.cancelledOrders,
                  },
                  { name: "Bekleyen", value: safeSummary.pendingShipments },
                  { name: "İptal", value: safeSummary.cancelledOrders },
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
