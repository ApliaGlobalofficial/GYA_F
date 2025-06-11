import React, { useState, useEffect } from "react";
import CustomerSidebar from "../components/CustomerSidebar";
import {
  fetchCustomerDashboard,
  updateUserProfile,
} from "../services/ApiService";
import { showNotification } from "../utilities/Utility";
import CustomerSettings from "../Dashboard Components/CustomerSettings";
import CustomerWishlist from "../Dashboard Components/CustomerWishlist";
import { Routes, Route, useLocation } from "react-router-dom";
import CustomerProfile from "../Dashboard Components/CustomerProfile";

const CustomerDashboard = () => {
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");

    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setLoggedInUser(user);

      const fetchData = async () => {
        const data = await fetchCustomerDashboard(user.id);
        setUserData(data.userdetails);
        setTransactions(data.transactions);
      };
      fetchData();
    }
  }, []);

  const updateUser = () => {
    const updatedData = {
      user_id: userData.user_id,
      lastname: userData.lastname,
      firstname: userData.firstname,
      phone: userData.phone,
    };

    updateUserProfile(updatedData, userData.user_id)
      .then((response) => {
        showNotification({
          title: "Update Successful",
          message: `Your data has been updated successfully!`,
          type: "success",
        });
        setUserData((prevData) => ({ ...prevData, ...updatedData }));
      })
      .catch((error) => console.error("Error updating user:", error));
  };

  const handleInputChange = (field, value) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <div className="flex h-screen bg-[#FFF8E1]">
      <CustomerSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route
            path="/"
            element={
              userData && (
                <div className="mt-10 max-w-4xl mx-auto px-4">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                    My Profile
                  </h2>
                  <div className="bg-white p-8 rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="text"
                        value={userData.email}
                        className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-700"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={userData.firstname}
                        onChange={(e) =>
                          handleInputChange("firstname", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg p-3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={userData.lastname}
                        onChange={(e) =>
                          handleInputChange("lastname", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg p-3"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={userData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg p-3"
                      />
                    </div>

                    <div className="col-span-2 flex justify-end">
                      <button
                        onClick={updateUser}
                        className="bg-[#C8910B] hover:bg-[#b67e07] transition-colors text-white font-semibold px-6 py-3 rounded-lg"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )
            }
          />

          <Route
            path="/order-history"
            element={
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-800 my-6">
                  Your Orders
                </h1>

                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
                  >
                    <div className="flex flex-col md:flex-row md:space-x-6">
                      <div className="flex-shrink-0 flex items-center">
                        <img
                          src={transaction.relatedData.cover_img}
                          alt={transaction.relatedData.title}
                          className="w-32 h-24 object-cover rounded-md border"
                        />
                      </div>
                      <div className="flex-1 mt-4 md:mt-0 space-y-1">
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-semibold">
                            {transaction.relatedData.title}
                          </h2>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              transaction.txn_status === 1
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {transaction.txn_status === 1
                              ? "Delivered"
                              : "In Transit"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {transaction.relatedData.artist_info}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Category:</span>{" "}
                          {transaction.relatedData.category}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Description:</span>{" "}
                          {transaction.relatedData.art_description}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0 md:text-right space-y-1 text-sm text-gray-700">
                        <h3 className="text-base font-semibold text-gray-800">
                          Order Summary
                        </h3>
                        <p>
                          <span className="font-medium text-gray-600">
                            Txn ID:
                          </span>{" "}
                          {transaction.txn_id}
                        </p>
                        <p>
                          <span className="font-medium text-gray-600">
                            Date:
                          </span>{" "}
                          {new Date(transaction.txn_on).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-medium text-gray-600">
                            Payment:
                          </span>{" "}
                          {transaction.txn_payload?.details?.card_number
                            ? `Card •••• ${transaction.txn_payload.details.card_number.slice(
                                -4
                              )}`
                            : transaction.txn_payload?.payment_method || "N/A"}
                        </p>
                        <p className="font-semibold text-black">
                          {transaction.currency_symbol || "$"}
                          {transaction.amount}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
          />

          <Route
            path="/payment"
            element={
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
                <div className="bg-white p-6 rounded shadow space-y-4 w-full max-w-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">VISA **** 1234</p>
                      <p className="text-sm text-gray-500">
                        {userData
                          ? `${userData.firstname} ${userData.lastname}`
                          : ""}
                      </p>
                      <p className="text-yellow-600 mt-1">
                        This card has expired
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-red-500">
                      🗑️
                    </button>
                  </div>
                  <button className="bg-[#FFBB33] px-4 py-2 rounded text-black font-medium">
                    Add New Payment Method
                  </button>
                </div>
              </div>
            }
          />

          <Route path="/settings" element={<CustomerSettings />} />
          <Route path="/wishlist" element={<CustomerWishlist />} />
          <Route path="/profile" element={<CustomerProfile/>} />
        </Routes>
      </div>
    </div>
  );
};

export default CustomerDashboard;
