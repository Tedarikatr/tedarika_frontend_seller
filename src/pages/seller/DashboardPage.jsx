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
import { getDashboardSnapshot, getWeeklySnapshot } from "@/api/sellerSalesSnapshotService";
import { getMyStore } from "@/api/sellerStoreService";
import { motion } from "framer-motion";
import {
  FaBoxOpen,
  FaLiraSign,
  FaTruck,
  FaBan,
  FaClipboardList,
  FaCheckCircle,
  FaBox,
  FaShoppingCart,
  FaHandshake,
  FaBullhorn,
  FaComments,
  FaStore,
} from "react-icons/fa";
import { AlertCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

const iconMap = {
  "Toplam Sipariş": <FaClipboardList className="text-emerald-600" size={24} />,
  "Aktif Ürün": <FaBoxOpen className="text-blue-600" size={24} />,
  "Toplam Gelir": <FaLiraSign className="text-green-600" size={24} />,
  "Bekleyen Kargo": <FaTruck className="text-orange-600" size={24} />,
  "İptal Edilen": <FaBan className="text-red-600" size={24} />,
  "Bekleyen Teklif": <FaCheckCircle className="text-purple-600" size={24} />,
};

const colorMap = {
  "Toplam Sipariş": "from-emerald-500 to-teal-600",
  "Aktif Ürün": "from-blue-500 to-indigo-600",
  "Toplam Gelir": "from-green-500 to-emerald-600",
  "Bekleyen Kargo": "from-orange-500 to-amber-600",
  "İptal Edilen": "from-red-500 to-rose-600",
  "Bekleyen Teklif": "from-purple-500 to-violet-600",
};

const StatCard = ({ title, value, icon, delay }) => (
  <motion.div
    className="relative bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 overflow-hidden group"
    whileHover={{ scale: 1.03, y: -4 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
  >
    {/* Background Gradient on Hover */}
    <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[title]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
    
    <div className="relative z-10 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
        <div className="p-2 bg-gray-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-teal-600 transition-all duration-300">
        {value}
      </p>
    </div>
    
    {/* Bottom accent line */}
    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colorMap[title]} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
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
          getDashboardSnapshot().catch(() => null),
          getWeeklySnapshot().catch(() => ({})),
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-6 py-8 font-sans">
      {/* Başlık */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-2">
          Satıcı Paneli
        </h1>
        <p className="text-gray-600 text-lg">Mağazanızın genel durumunu buradan takip edebilirsiniz</p>
      </motion.div>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
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

      {/* 🔗 Hızlı Kısayollar */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-1 h-8 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full"></span>
          Hızlı Erişim
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {[
            { to: "/seller/products/my-store", icon: <FaBox />, label: "Ürünlerim", color: "from-blue-500 to-indigo-600" },
            { to: "/seller/orders", icon: <FaShoppingCart />, label: "Siparişlerim", color: "from-emerald-500 to-teal-600" },
            { to: "/seller/quotations", icon: <FaHandshake />, label: "Teklifler", color: "from-purple-500 to-violet-600" },
            { to: "/seller/campaigns", icon: <FaBullhorn />, label: "Kampanyalar", color: "from-orange-500 to-amber-600" },
            { to: "/seller/chat", icon: <FaComments />, label: "Mesajlar", color: "from-pink-500 to-rose-600" },
            { to: "/seller/store/update", icon: <FaStore />, label: "Mağazam", color: "from-cyan-500 to-blue-600" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to={item.to}
                className="group relative bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50 border-2 border-gray-200 hover:border-gray-300 rounded-2xl flex flex-col items-center justify-center p-6 transition-all shadow-md hover:shadow-xl overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className={`p-4 bg-gradient-to-br ${item.color} rounded-xl text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                    {item.label}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

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
          className="col-span-2 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-800">Haftalık Satış Grafiği</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weeklyChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: '14px', fontWeight: '500' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '14px', fontWeight: '500' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '2px solid #10B981', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="url(#colorGradient)"
                strokeWidth={4}
                dot={{
                  r: 6,
                  stroke: "#10B981",
                  strokeWidth: 3,
                  fill: "white",
                }}
                activeDot={{ r: 8 }}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#14B8A6" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-800">Sipariş Durumu</h3>
          </div>
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
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={index} fill={color} stroke="white" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '2px solid #3B82F6', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: '14px', fontWeight: '600' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "13px" }}
              />
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
