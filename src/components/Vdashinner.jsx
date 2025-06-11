"use client"

import { useState } from "react"
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
} from "recharts"
import { Calendar, AlertCircle, ArrowRight, Plus, Tag, BarChart2, MapPin, Home, Users } from "lucide-react"

// Sample data for charts
const monthlyData = [
  { name: "1", bookings: 5, visitors: 30, revenue: 250, net: 200, discount: 30, refund: 0 },
  { name: "5", bookings: 8, visitors: 50, revenue: 400, net: 320, discount: 50, refund: 0 },
  { name: "10", bookings: 12, visitors: 70, revenue: 600, net: 480, discount: 80, refund: 0 },
  { name: "15", bookings: 10, visitors: 65, revenue: 500, net: 400, discount: 60, refund: 0 },
  { name: "20", bookings: 15, visitors: 90, revenue: 750, net: 600, discount: 90, refund: 0 },
  { name: "25", bookings: 20, visitors: 120, revenue: 1000, net: 800, discount: 120, refund: 0 },
  { name: "30", bookings: 18, visitors: 110, revenue: 900, net: 720, discount: 100, refund: 0 },
]

const categoryData = [
  { name: "Concert Halls", value: 13600 },
  { name: "Exhibition Centers", value: 6500 },
  { name: "Galleries", value: 3700 },
  { name: "Outdoor Venues", value: 3400 },
]

const COLORS = ["#4a9d8f", "#e3c27e", "#e57373", "#2c3e50"]

const Vdashinner = () => {
  const [timeframe, setTimeframe] = useState("monthly")

  return (
    <div className="flex-1 p-6 bg-white overflow-y-auto">

      {/* Banner notification */}
      <div className="mb-6 p-4 bg-[#f8e1a4] text-[#7a5c21] rounded-md shadow-md border-l-4 border-[#e3c27e]">
        <p className="text-center">
          Start with <span className="text-[#b8860b] font-medium">adding Venue details</span> to gain profile progress.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {["Total Bookings", "Revenue", "Visitors", "Cancellations"].map((title, index) => (
          <div key={index} className="bg-white p-6 rounded-md shadow-md border border-[#e3c27e]">
            <h3 className="text-center text-gray-600 mb-2">{title}</h3>
            <p className="text-center text-2xl font-bold text-[#b8860b]">£0.00</p>
          </div>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Venue Bookings This Month */}
        <div className="bg-white p-6 rounded-md shadow-md border border-[#e3c27e]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#2c3e50] flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-[#e3c27e]" />
              Venue Bookings This Month
            </h3>
            <select
              className="bg-white border border-[#e3c27e] rounded-md px-2 py-1 text-sm text-[#2c3e50]"
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
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3c27e" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e3c27e", borderRadius: "4px" }} />
                <Legend />
                <Line type="monotone" dataKey="bookings" stroke="#e3c27e" strokeWidth={2} />
                <Line type="monotone" dataKey="visitors" stroke="#2c3e50" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="#4a9d8f" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Venue Categories */}
        <div className="bg-white p-6 rounded-md shadow-md border border-[#e3c27e]">
          <h3 className="text-lg font-semibold text-[#2c3e50]">Top Venue Categories</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e3c27e", borderRadius: "4px" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-md shadow-md border border-[#e3c27e] mb-8">
        <h3 className="text-lg font-semibold text-[#2c3e50] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["Add New Venue", "Manage Bookings", "View Revenue Reports"].map((text, index) => (
            <button
              key={index}
              className="flex items-center justify-between p-4 border border-[#e3c27e] rounded-md hover:bg-[#e3c27e]/20 transition-colors"
            >
              <span className="text-[#2c3e50]">{text}</span>
              <ArrowRight className="h-5 w-5 text-[#e3c27e]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Vdashinner
