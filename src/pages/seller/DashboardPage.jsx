import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { getDashboardSummary, getWeeklyFinance } from "@/api/sellerFinanceService";
import { getMyStore } from "@/api/sellerStoreService";
import { motion } from "framer-motion";
import {
  FaBoxOpen,
  FaLiraSign,
  FaTruck,
  FaBan,
  FaClipboardList,
  FaCheckCircle,
} from "react-icons/fa";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const COLORS = ["#00A982", "#EAEAEA", "#FF8A8A"];

const iconMap = {
  "Toplam Sipariş": <FaClipboardList className="text-[#00A982]" size={22} />,
  "Aktif Ürün": <FaBoxOpen className="text-[#00A982]" size={22} />,
  "Toplam Gelir": <FaLiraSign className="text-[#00A982]" size={22} />,
  "Bekleyen Kargo": <FaTruck className="text-[#00A982]" size={22} />,
  "İptal Edilen": <FaBan className="text-[#00A982]" size={22} />,
  "Bekleyen Teklif": <FaCheckCircle className="text-[#00A982]" size={22} />,
};

const StatCard = ({ title, value, icon, delay }) => (
  <motion.div
    className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col gap-2"
    whileHover={{ scale: 1.02 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
  >
    <div className="flex justify-between items-center">
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      {icon}
    </div>
    <p className="text-2xl font-semibold text-gray-800">{value}</p>
  </motion.div>
);

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

        const [dashboard, weekly] = await Promise.all([
          getDashboardSummary().catch(() => null),
          getWeeklyFinance().catch(() => ({})),
        ]);

        setSummary(dashboard || {});
        setWeeklyChart([
          { name: "Bu Hafta", value: weekly?.totalAmount || 0 },
          { name: "Sipariş", value: weekly?.totalOrders || 0 },
        ]);
      } catch (err) {
        console.error("Dashboard verileri alınamadı:", err);
        setHasStore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-gray-500 text-lg">
        <motion.div
          className="flex items-center gap-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          <span className="w-3 h-3 bg-[#00A982] rounded-full" />
          <span>Yükleniyor...</span>
        </motion.div>
      </div>
    );
  }

  if (!hasStore) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center bg-gray-50 px-6">
        <div className="bg-white border border-yellow-400 shadow-lg rounded-2xl px-8 py-6 max-w-lg flex flex-col items-center gap-3">
          <AlertCircle className="w-10 h-10 text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-800">Henüz bir mağazanız yok</h2>
          <p className="text-sm text-gray-600">
            Satışa başlayabilmek için bir mağaza oluşturmalısınız.
          </p>
          <button
            onClick={() => navigate("/seller/store/create")}
            className="mt-3 bg-[#00A982] hover:bg-[#009874] text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
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
    <div className="min-h-screen bg-white px-6 py-8 font-sans">
      <motion.h1
        className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Satıcı Paneli
      </motion.h1>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 mb-8">
        {stats.map((stat, idx) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={iconMap[stat.title]}
            delay={idx * 0.05}
          />
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
          className="col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Haftalık Finans</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weeklyChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F3F3" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
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
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Sipariş Dağılımı</h3>
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
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={index} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "13px" }} />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center text-sm text-gray-600 mt-3">
            Toplam Sipariş: {safeSummary.totalOrders}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
