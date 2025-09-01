import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function StatsChart({ dailyStats, weeklyStats, monthlyStats }) {
  const [activeTab, setActiveTab] = useState("daily");
  const [selectedMonth, setSelectedMonth] = useState(""); 
  const [selectedStaff, setSelectedStaff] = useState(""); // <-- staff filter

  // Unique staff list nikalna dropdown ke liye
  const staffList = [
    ...new Set([
      ...dailyStats.map((d) => d.staff?.name),
      ...weeklyStats.map((d) => d.staff?.name),
      ...monthlyStats.map((d) => d.staff?.name),
    ]),
  ].filter(Boolean);

  // Chart data select
  const chartData =
    activeTab === "daily"
      ? dailyStats
          .filter((d) => {
            if (selectedStaff && d.staff?.name !== selectedStaff) return false;
            return true;
          })
          .map((d) => ({
            label: d.day,
            clients: d.total_clients,
            services: d.total_services,
          }))
      : activeTab === "weekly"
      ? weeklyStats
          .filter((d) => {
            if (selectedStaff && d.staff?.name !== selectedStaff) return false;
            return true;
          })
          .map((d) => {
            const weekString = String(d.week);
            const year = weekString.slice(0, 4);
            const weekNum = weekString.slice(4);
            return {
              label: `Week ${weekNum} (${year})`,
              clients: d.total_clients,
              services: d.total_services,
            };
          })
      : monthlyStats
          .filter((d) => {
            if (selectedStaff && d.staff?.name !== selectedStaff) return false;
            if (selectedMonth && d.month !== selectedMonth) return false;
            return true;
          })
          .map((d) => ({
            label: d.month,
            clients: d.total_clients,
            services: d.total_services,
          }));

  return (
    <div className="bg-white rounded-lg  overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between md:items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-800">Booking Stats</h2>
        <div className="flex flex-wrap gap-2 items-center">
          {/* Tabs */}
          <button
            onClick={() => setActiveTab("daily")}
            className={`px-3 py-1 rounded ${
              activeTab === "daily"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setActiveTab("weekly")}
            className={`px-3 py-1 rounded ${
              activeTab === "weekly"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setActiveTab("monthly")}
            className={`px-3 py-1 rounded ${
              activeTab === "monthly"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Monthly
          </button>

          {/* Staff Selector */}
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">All Staff</option>
            {staffList.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Month selector only for monthly */}
          {activeTab === "monthly" && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            />
          )}
        </div>
      </div>

      <div className="p-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="clients"
              stroke="#2563eb"
              name="Clients"
            />
            <Line
              type="monotone"
              dataKey="services"
              stroke="#16a34a"
              name="Services"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StatsChart;
