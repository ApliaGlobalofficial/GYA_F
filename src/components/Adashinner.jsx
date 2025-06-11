"use client";

import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Calendar } from "lucide-react";
import Artworks from "../Dashboard Components/Artworks";

const COLORS = [
  "#F4A261",
  "#E9C46A",
  "#F6BD60",
  "#2a9d8f",
  "#FF9F1C",
  "#D7263D",
  "#6C5B7B",
  "#3A86FF",
  "#8338EC",
  "#FF006E",
];
const BASE_URL = import.meta.env.VITE_SERVER_API_URL; // ✅ Replace with your backend API URL

const Adashinner = () => {
  const [timeframe, setTimeframe] = useState("monthly");
  const [categoryData, setCategoryData] = useState([]);
  const [netSales, setNetSales] = useState(0);
  const [earning, setEarning] = useState(0);

  const monthlyData = [
    { name: "1", items: 5, orders: 3, gross: 250 },
    { name: "5", items: 8, orders: 5, gross: 400 },
    { name: "10", items: 12, orders: 7, gross: 600 },
    { name: "15", items: 10, orders: 6, gross: 500 },
    { name: "20", items: 15, orders: 9, gross: 750 },
    { name: "25", items: 20, orders: 12, gross: 1000 },
    { name: "30", items: 18, orders: 10, gross: 900 },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token"); // or wherever you keep itw
      
      const authConfig = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const [catRes, salesRes, summaryRes] = await Promise.all([
        axios.get(`${BASE_URL}art/category-counts`, authConfig),
        axios.get(`${BASE_URL}art/sale`, authConfig),
        axios.get(`${BASE_URL}art/earning`, authConfig),
      ]);


      const formattedCategories = Array.isArray(catRes.data)
        ? catRes.data.map((item) => ({
            name: item.category,
            value: Number(item.count), // even if 0
          }))
        : [];

      setCategoryData(formattedCategories);
      setNetSales(salesRes.data.count || 0);
      setEarning(summaryRes.data.earning || 0);
    } catch (error) {
      console.error("Dashboard data fetch failed:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Response:", error.response.data);
      }
    }
  };

  return (
    <div className="flex-1 p-6 bg-white overflow-y-auto">
      <Routes>
        <Route path="/Artworks" element={<Artworks />} />
        <Route
          path="/"
          element={
            <>
              {/* Banner */}
              <div className="mb-6 p-4 bg-[#FFE6A7] text-[#7a5c21] rounded-md shadow-md border-l-4 border-[#FFD580]">
                <p className="text-center">
                  Start with{" "}
                  <span className="text-[#D99800] font-medium">
                    adding a Banner
                  </span>{" "}
                  to gain profile progress.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Net Sales" value={netSales} />
                <StatCard title="Earning" value={`₹${earning.toFixed(2)}`} />
                <StatCard title="Pageview" value="5" />
                <StatCard title="Order" value="10" />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <LineChartCard
                  data={monthlyData}
                  timeframe={timeframe}
                  setTimeframe={setTimeframe}
                />
                <PieChartCard categoryData={categoryData} />
              </div>
            </>
          }
        />
      </Routes>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-md shadow-md border border-[#FFD580]">
    <h3 className="text-center text-gray-600 mb-2">{title}</h3>
    <p className="text-center text-2xl font-bold text-[#D99800]">{value}</p>
  </div>
);

const LineChartCard = ({ data, timeframe, setTimeframe }) => (
  <div className="bg-white p-6 rounded-md shadow-md border border-[#FFD580]">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-[#2c3e50] flex items-center">
        <Calendar className="mr-2 h-5 w-5 text-[#FFD580]" />
        Sales this Month
      </h3>
      <select
        className="bg-white border border-[#FFD580] rounded-md px-2 py-1 text-sm text-[#2c3e50]"
        value={timeframe}
        onChange={(e) => setTimeframe(e.target.value)}
      >
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
    </div>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#FFD580" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="items"
            stroke="#E9C46A"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#2c3e50"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="gross"
            stroke="#F4A261"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

{
  /* Pie Chart */
}
const PieChartCard = ({ categoryData }) => {
  return (
    <div className="bg-white p-6 rounded-md shadow-md border border-[#FFD580]">
      <h3 className="text-lg font-semibold text-[#2c3e50] mb-2">
        Top Selling Categories
      </h3>
      <div className="h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={false} // ✅ clean, no labels inside pie
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value}`, `${name}`]}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #FFD580",
                borderRadius: "4px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Adashinner;
