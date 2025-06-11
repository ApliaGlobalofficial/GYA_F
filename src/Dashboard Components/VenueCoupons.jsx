import React, { useState } from "react";
import { Plus, X } from "lucide-react";

export default function CouponPage() {
  const [activeTab, setActiveTab] = useState("my-coupons");

  const handleAddCoupon = () => {
    console.log("Add new coupon clicked");
    // Handle add coupon logic here
  };

  const dismissAlert = () => {
    console.log("Alert dismissed");
    // Handle alert dismissal
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-6xl font-light text-gray-900 tracking-wide">
          COUPON
        </h1>
        <button
          onClick={handleAddCoupon}
          className="bg-black text-[#e3c27e] hover:bg-gray-800 px-6 py-3 rounded-md flex items-center gap-2 transition-colors duration-200 focus:outline-none focus:ring-2  focus:ring-offset-2"
        >
          <Plus size={20} />
          ADD NEW COUPON
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("my-coupons")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "my-coupons"
                ? "border-red-500 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            My Coupons
          </button>
          <button
            onClick={() => setActiveTab("marketplace-coupons")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "marketplace-coupons"
                ? "border-red-500 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Marketplace Coupons
          </button>
        </nav>
      </div>

      {/* Alert Message */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <X
              size={20}
              className="text-red-500 cursor-pointer hover:text-red-700"
              onClick={dismissAlert}
            />
          </div>
          <div className="ml-3">
            <p className="text-red-700 font-medium">No coupons found!</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-96">
        {activeTab === "my-coupons" && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              You don't have any coupons yet. Click "ADD NEW COUPON" to get
              started!
            </p>
          </div>
        )}

        {activeTab === "marketplace-coupons" && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No marketplace coupons available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
