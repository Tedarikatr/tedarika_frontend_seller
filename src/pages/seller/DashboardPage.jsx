import {
  LineChart,
  Line,
  BarChart,
  Bar,
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

const incomeData = [
  { month: "Jan", value: 8000 },
  { month: "Feb", value: 9500 },
  { month: "Mar", value: 11000 },
  { month: "Apr", value: 9800 },
  { month: "May", value: 12500 },
  { month: "Jun", value: 14200 },
];

const projectStats = [
  { title: "Toplam Sipariş", value: 24 },
  { title: "Aktif Ürün", value: 12 },
  { title: "Onay Bekleyen", value: 3 },
  { title: "Tamamlanan Sipariş", value: 8 },
];

const pieData = [
  { name: "Tamamlandı", value: 40 },
  { name: "Devam", value: 35 },
  { name: "Bekliyor", value: 25 },
];

const COLORS = ["#017F5B", "#75D8B1", "#E1ECE5"];

const DashboardPage = () => {
  return (
    <div className="bg-[#F7F9F8] min-h-screen p-8 font-sans">
      <h2 className="text-3xl font-semibold text-[#003333] mb-6">Satıcı Paneli</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {projectStats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-2xl shadow-sm p-6 border border-[#DCE8E3]"
          >
            <p className="text-sm text-[#607672] mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-[#003333]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gelir Line Chart */}
        <div className="col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-[#DCE8E3]">
          <h3 className="text-lg font-semibold text-[#003333] mb-4">Aylık Gelir</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={incomeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6F0EB" />
              <XAxis dataKey="month" stroke="#607672" />
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

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#DCE8E3]">
          <h3 className="text-lg font-semibold text-[#003333] mb-4">Sipariş Durumu</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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