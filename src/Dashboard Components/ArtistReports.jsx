import React, { useState } from "react";
import {
  BarChart3,
  ShoppingCart,
  Package,
  TrendingUp,
  RefreshCw,
  CreditCard,
  Truck,
  Tag,
  Calendar,
} from "lucide-react";

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

const monthlyData = [
  { name: "1", items: 5, orders: 3, gross: 250 },
  { name: "5", items: 8, orders: 5, gross: 400 },
  { name: "10", items: 12, orders: 7, gross: 600 },
  { name: "15", items: 10, orders: 6, gross: 500 },
  { name: "20", items: 15, orders: 9, gross: 750 },
  { name: "25", items: 20, orders: 12, gross: 1000 },
  { name: "30", items: 18, orders: 10, gross: 900 },
];

const metrics = [
  {
    label: "gross sales in this period",
    value: "£0.00",
    color: "text-gray-500",
  },
  {
    label: "net sales in this period",
    value: "£0.00",
    color: "text-gray-500",
  },
  { label: "orders placed", value: "0", color: "text-gray-500" },
  { label: "items purchased", value: "0", color: "text-gray-500" },
  {
    label: "refunded 0 orders (0 items)",
    value: "£0.00",
    color: "text-red-400",
  },
  { label: "charged for shipping", value: "£0.00", color: "text-gray-500" },
  {
    label: "worth of coupons used",
    value: "£0.00",
    color: "text-yellow-500",
  },
];

const salesData = [
  { label: "Number of items sold", icon: Package, color: "bg-gray-100" },
  {
    label: "Average gross sales amount",
    icon: TrendingUp,
    color: "bg-yellow-100",
  },
  { label: "Coupon amount", icon: Tag, color: "bg-orange-100" },
  { label: "Gross sales amount", icon: BarChart3, color: "bg-red-100" },
  { label: "Refund amount", icon: RefreshCw, color: "bg-gray-100" },
];

const salesDataRight = [
  { label: "Number of orders", icon: ShoppingCart, color: "bg-blue-100" },
  {
    label: "Average net sales amount",
    icon: TrendingUp,
    color: "bg-teal-100",
  },
  { label: "Shipping amount", icon: Truck, color: "bg-blue-100" },
  { label: "Net sales amount", icon: CreditCard, color: "bg-blue-100" },
];
export default function SalesReportsDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    "Overview",
    "Sales by day",
    "Top selling",
    "Top earning",
    "Statement",
  ];

  function renderPanel() {
    switch (activeTab) {
      case "Overview":
        return <Overview />;
      case "Sales by day":
        return <SalesByDayChart />;
      case "Top selling":
        return <TopSellingTable />;
      case "Top earning":
        return <TopEarningList />;
      case "Statement":
        return <StatementView />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-light text-gray-800 mb-8 tracking-wide">
          REPORTS
        </h1>

        {/* Navigation Tabs */}
        <div className="flex space-x-6 mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* This is where the panel switches */}
        <div className="mt-6">{renderPanel()}</div>
        {/* Main Content */}
      </div>
    </div>
  );
}

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

const SalesByDayChart = () => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar - Metrics */}
        <div className="space-y-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-sm border border-gray-200"
            >
              <div className={`text-2xl font-light mb-1 ${metric.color}`}>
                {metric.value}
              </div>
              <div className="text-xs text-gray-500 leading-tight">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-2">
          {/* This Month's Sales Header */}
          <div className="mb-6">
            <h2 className="text-xl font-light text-gray-800 mb-4 tracking-wide">
              THIS MONTH&apos;S SALES
            </h2>

            {/* Legend Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-8">
              <div className="space-y-2">
                {salesData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-sm ${item.color}`}></div>
                    <span className="text-xs text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {salesDataRight.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-sm ${item.color}`}></div>
                    <span className="text-xs text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Area */}
          <div className="bg-white border border-gray-200 rounded-sm p-6 h-64">
            <LineChartCard
              data={monthlyData}
              // timeframe={timeframe}
              // setTimeframe={setTimeframe}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const TopSellingTable = () => {
  const [dateRange, setDateRange] = useState("May 15, 2025 - June 13, 2025");
  const [showResults, setShowResults] = useState(true);

  const handleShow = () => {
    setShowResults(true);
  };

  const handleDateChange = (e) => {
    setDateRange(e.target.value);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Date Range Selector */}
      <div className="flex items-center gap-4 mb-8">
        <input
          type="text"
          value={dateRange}
          onChange={handleDateChange}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent min-w-[250px]"
          placeholder="Select date range"
        />
        <button
          onClick={handleShow}
          className="px-6 py-2 bg-black hover:bg-gray-800 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 "
        >
          Show
        </button>
      </div>

      {/* Report Table */}
      {showResults && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-200">
            <div className="px-6 py-4 text-left">
              <h3 className="text-lg font-medium text-gray-700">Product</h3>
            </div>
            <div className="px-6 py-4 text-center">
              <h3 className="text-lg font-medium text-gray-700">Sales</h3>
            </div>
          </div>

          {/* Empty State */}
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 text-base">
              No products found in given range.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const TopEarningList = () => {
  const [dateRange, setDateRange] = useState("May 15, 2025 - June 13, 2025");
  const [showResults, setShowResults] = useState(true);

  const handleShow = () => {
    setShowResults(true);
  };

  const handleDateChange = (e) => {
    setDateRange(e.target.value);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Date Range Selector */}
      <div className="flex items-center gap-4 mb-8">
        <input
          type="text"
          value={dateRange}
          onChange={handleDateChange}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent min-w-[250px]"
          placeholder="Select date range"
        />
        <button
          onClick={handleShow}
          className="px-6 py-2 bg-black hover:bg-gray-800 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 "
        >
          Show
        </button>
      </div>

      {/* Report Table */}
      {showResults && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
            <div className="px-6 py-4 text-left">
              <h3 className="text-lg font-medium text-gray-700">Product</h3>
            </div>
            <div className="px-6 py-4 text-center">
              <h3 className="text-lg font-medium text-gray-700">Sales</h3>
            </div>
            <div className="px-6 py-4 text-center">
              <h3 className="text-lg font-medium text-gray-700">Earning</h3>
            </div>
          </div>

          {/* Empty State */}
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 text-base">
              No products found in given range.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const StatementView = () => {
  const [dateRange, setDateRange] = useState("June 1, 2025 - June 13, 2025");
  const [showResults, setShowResults] = useState(true);

  const handleShow = () => {
    setShowResults(true);
  };

  const handleDateChange = (e) => {
    setDateRange(e.target.value);
  };

  const handleExportAll = () => {
    // Export functionality would go here
    console.log("Exporting all data...");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header with Date Range, Show Button, and Export Button */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={dateRange}
            onChange={handleDateChange}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent min-w-[280px]"
            placeholder="Select date range"
          />
          <button
            onClick={handleShow}
            className="px-6 py-2 bg-black hover:bg-gray-800 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 "
          >
            Show
          </button>
        </div>

        <button
          onClick={handleExportAll}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Export All
        </button>
      </div>

      {/* Report Table */}
      {showResults && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            <div className="px-4 py-4 text-left border-r border-gray-200">
              <h3 className="text-base font-medium text-gray-700">
                Balance Date
              </h3>
            </div>
            <div className="px-4 py-4 text-left border-r border-gray-200">
              <h3 className="text-base font-medium text-gray-700">Trn Date</h3>
            </div>
            <div className="px-4 py-4 text-center border-r border-gray-200">
              <h3 className="text-base font-medium text-gray-700">ID</h3>
            </div>
            <div className="px-4 py-4 text-center border-r border-gray-200">
              <h3 className="text-base font-medium text-gray-700">Type</h3>
            </div>
            <div className="px-4 py-4 text-center border-r border-gray-200">
              <h3 className="text-base font-medium text-gray-700">Debit</h3>
            </div>
            <div className="px-4 py-4 text-center border-r border-gray-200">
              <h3 className="text-base font-medium text-gray-700">Credit</h3>
            </div>
            <div className="px-4 py-4 text-center">
              <h3 className="text-base font-medium text-gray-700">Balance</h3>
            </div>
          </div>

          {/* Empty State */}
          <div className="px-6 py-12 text-left">
            <p className="text-gray-600 text-base">No Result found!</p>
          </div>
        </div>
      )}
    </div>
  );
};

const Overview = () => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar - Metrics */}
        <div className="space-y-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-sm border border-gray-200"
            >
              <div className={`text-2xl font-light mb-1 ${metric.color}`}>
                {metric.value}
              </div>
              <div className="text-xs text-gray-500 leading-tight">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-2">
          {/* This Month's Sales Header */}
          <div className="mb-6">
            <h2 className="text-xl font-light text-gray-800 mb-4 tracking-wide">
              THIS MONTH&apos;S SALES
            </h2>

            {/* Legend Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-8">
              <div className="space-y-2">
                {salesData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-sm ${item.color}`}></div>
                    <span className="text-xs text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {salesDataRight.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-sm ${item.color}`}></div>
                    <span className="text-xs text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Area */}
          <div className="bg-white border border-gray-200 rounded-sm p-6 h-64">
            <LineChartCard
              data={monthlyData}
              // timeframe={timeframe}
              // setTimeframe={setTimeframe}
            />
          </div>
        </div>
      </div>
    </>
  );
};
