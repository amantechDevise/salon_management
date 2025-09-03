import React, { useState, useMemo } from "react";
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

  // Process data with proper staff information
  const processedData = useMemo(() => {
    // Process daily revenue
    const daily = Array.isArray(data?.dailyRevenue)
      ? data.dailyRevenue.map((item) => ({
          ...item,
          revenue: parseFloat(item.revenue) || 0,
          staffName: item["staff.name"] || "Unknown Staff",
          staffId: item["staff.id"] || null,
        }))
      : [];

    // Process weekly revenue
    const weekly = Array.isArray(data?.weeklyRevenue)
      ? data.weeklyRevenue.map((item) => ({
          ...item,
          revenue: parseFloat(item.revenue) || 0,
          staffName: item["staff.name"] || "Unknown Staff",
          staffId: item["staff.id"] || null,
        }))
      : [];

    // Process monthly revenue
    const monthly = Array.isArray(data?.monthlyRevenue)
      ? data.monthlyRevenue.map((item) => ({
          ...item,
          revenue: parseFloat(item.revenue) || 0,
          staffName: item["staff.name"] || "Unknown Staff",
          staffId: item["staff.id"] || null,
        }))
      : [];

    // Process service revenue
    const services = Array.isArray(data?.revenueByService)
      ? data.revenueByService.map((item) => ({
          ...item,
          totalRevenue: parseFloat(item.totalRevenue) || 0,
          totalBookings: parseInt(item.totalBookings) || 0,
          serviceTitle: item.serviceTitle || "Unknown Service",
          staffName: item["staff.name"] || "All Staff",
          staffId: item["staff.id"] || null,
        }))
      : [];

    return { daily, weekly, monthly, services };
  }, [data]);

  // Get unique staff list from all data
  const staffList = useMemo(() => {
    const allStaff = [
      ...processedData.daily.map((d) => ({ id: d.staffId, name: d.staffName })),
      ...processedData.weekly.map((d) => ({
        id: d.staffId,
        name: d.staffName,
      })),
      ...processedData.monthly.map((d) => ({
        id: d.staffId,
        name: d.staffName,
      })),
      ...processedData.services.map((d) => ({
        id: d.staffId,
        name: d.staffName,
      })),
    ];

    // Remove duplicates and filter out null/undefined
    return [
      ...new Map(
        allStaff
          .filter((staff) => staff.id && staff.name)
          .map((staff) => [staff.id, staff])
      ).values(),
    ];
  }, [processedData]);

  // Filter data based on selected staff
  const filteredData = useMemo(() => {
    const filterByStaff = (items) => {
      if (!selectedStaff) return items;
      return items.filter((item) => item.staffId === selectedStaff);
    };

    return {
      daily: filterByStaff(processedData.daily),
      weekly: filterByStaff(processedData.weekly),
      monthly: filterByStaff(processedData.monthly),
      services: filterByStaff(processedData.services),
    };
  }, [processedData, selectedStaff]);

  // Prepare chart data based on active tab
  const chartData = useMemo(() => {
    if (activeTab === "daily") {
      return filteredData.daily.map((d) => ({
        label: d.day,
        revenue: d.revenue,
        staffName: d.staffName,
      }));
    } else if (activeTab === "weekly") {
      return filteredData.weekly.map((d) => ({
        label: formatWeek(d.week),
        revenue: d.revenue,
        staffName: d.staffName,
      }));
    } else if (activeTab === "monthly") {
      return filteredData.monthly.map((d) => ({
        label: d.month,
        revenue: d.revenue,
        staffName: d.staffName,
      }));
    }
    return [];
  }, [activeTab, filteredData]);

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
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
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
              <Tooltip
                formatter={formatTooltip}
                labelFormatter={(label) => {
                  const item = chartData.find((d) => d.label === label);
                  return `${label}${
                    item && item.staffName ? ` - ${item.staffName}` : ""
                  }`;
                }}
              />
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
                data={filteredData.services}
                dataKey="totalRevenue"
                nameKey="serviceTitle"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label={({ serviceTitle, totalRevenue }) =>
                  `${serviceTitle}: ${new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalRevenue)}`
                }
              >
                {filteredData.services.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={formatTooltip}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length) {
                    return `${payload[0].payload.serviceTitle} - ${payload[0].payload.staffName}`;
                  }
                  return label;
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}

        {chartData.length === 0 && activeTab !== "services" && (
          <div className="text-center py-8 text-gray-500">
            No data available for the selected filters
          </div>
        )}

        {filteredData.services.length === 0 && activeTab === "services" && (
          <div className="text-center py-8 text-gray-500">
            No service revenue data available
          </div>
        )}
      </div>
    </div>
  );
}

export default BusinessOverview;
