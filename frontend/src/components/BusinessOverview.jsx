import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f43f5e", "#f59e0b", "#0ea5e9"];

// Week formatting helper
const formatWeek = (weekString) => {
  if (!weekString) return "";
  const str = String(weekString);
  const year = str.slice(0, 4);
  const weekNum = str.slice(4);
  return `Week ${weekNum} (${year})`;
};

function BusinessOverview({ data = {} }) {
  const [activeTab, setActiveTab] = useState("daily");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Safe arrays with proper data type conversion
  const daily = Array.isArray(data?.dailyRevenue)
    ? data.dailyRevenue.map((item) => ({
        ...item,
        revenue: parseFloat(item.revenue) || 0,
        staff: item.staff || { name: "" },
      }))
    : [];

  const weekly = Array.isArray(data?.weeklyRevenue)
    ? data.weeklyRevenue.map((item) => ({
        ...item,
        revenue: parseFloat(item.revenue) || 0,
        staff: item.staff || { name: "" },
      }))
    : [];

  const monthly = Array.isArray(data?.monthlyRevenue)
    ? data.monthlyRevenue.map((item) => ({
        ...item,
        revenue: parseFloat(item.revenue) || 0,
        staff: item.staff || { name: "" },
      }))
    : [];

  const services = Array.isArray(data?.revenueByService)
    ? data.revenueByService.map((item) => ({
        ...item,
        totalRevenue: parseFloat(item.totalRevenue) || 0,
        service: {
          id: item.serviceId,
          title: item.serviceTitle || "Unknown Service",
        },
        staff: {
          id: item["staff.id"] || null,
          name: item["staff.name"] || "",
        },
      }))
    : [];

  // Unique staff list
  const staffList = [
    ...new Set([
      ...daily.map((d) => d.staff?.name),
      ...weekly.map((d) => d.staff?.name),
      ...monthly.map((d) => d.staff?.name),
      ...services.map((d) => d.staff?.name),
    ]),
  ].filter(Boolean);

  // Filtered chartData
  const chartData =
    activeTab === "daily"
      ? daily
          .filter((d) =>
            selectedStaff ? d.staff?.name === selectedStaff : true
          )
          .map((d) => ({ label: d.day, revenue: d.revenue }))
      : activeTab === "weekly"
      ? weekly
          .filter((d) =>
            selectedStaff ? d.staff?.name === selectedStaff : true
          )
          .map((d) => ({ label: formatWeek(d.week), revenue: d.revenue }))
      : activeTab === "monthly"
      ? monthly
          .filter((d) => {
            if (selectedStaff && d.staff?.name !== selectedStaff) return false;
            if (selectedMonth && d.month !== selectedMonth) return false;
            return true;
          })
          .map((d) => ({ label: d.month, revenue: d.revenue }))
      : [];

  // Custom tooltip formatter
  const formatTooltip = (value, name, props) => {
    return [
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value),
      name,
    ];
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between md:items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-800">
          Business Overview
        </h2>
        <div className="flex flex-wrap gap-2 items-center">
          {/* Tabs */}
          {["daily", "weekly", "monthly", "services"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded capitalize ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}

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

          {/* Month Selector (only for monthly) */}
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

      {/* Charts */}
      <div className="p-4">
        {["daily", "weekly", "monthly"].includes(activeTab) && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis
                tickFormatter={(value) =>
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                  }).format(value)
                }
              />
              <Tooltip formatter={formatTooltip} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeTab === "services" && (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={services.filter((d) =>
                  selectedStaff ? d.staff?.name === selectedStaff : true
                )}
                dataKey="totalRevenue"
                nameKey="serviceTitle"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label={({ service, totalRevenue }) =>
                  `${service?.title}: ${new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalRevenue)}`
                }
              >
                {services
                  .filter((d) =>
                    selectedStaff ? d.staff?.name === selectedStaff : true
                  )
                  .map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
              </Pie>
              <Tooltip formatter={formatTooltip} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}

        {chartData.length === 0 && activeTab !== "services" && (
          <div className="text-center py-8 text-gray-500">
            No data available for the selected filters
          </div>
        )}

        {services.length === 0 && activeTab === "services" && (
          <div className="text-center py-8 text-gray-500">
            No service revenue data available
          </div>
        )}
      </div>
    </div>
  );
}

export default BusinessOverview;
