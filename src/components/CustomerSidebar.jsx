import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaHistory,
  FaUser,
  FaCreditCard,
  FaPowerOff,
} from "react-icons/fa";

import { Settings } from "lucide-react";

const CustomerSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const menuItems = [
    {
      name: "My Profile",
      icon: <FaUser size={18} />,
      path: "/customer-dashboard",
    },
    {
      name: "Order History",
      icon: <FaHistory size={18} />,
      path: "/customer-dashboard/order-history",
    },

    {
      name: "Payment Method",
      icon: <FaCreditCard size={18} />,
      path: "/customer-dashboard/payment",
    },
    {
      name: "Wishlist",
      icon: <FaHeart size={18} />,
      path: "/customer-dashboard/wishlist",
    },

    {
      name: "Settings",
      icon: <Settings size={18} />,
      path: "/customer-dashboard/settings",
    },
  ];

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setLoggedInUser(user);
    }
  }, []);

  return (
    <div className="h-full w-64 bg-gradient-to-b from-[#FFD580] to-[#FFFACD] text-black flex flex-col shadow-lg">
      {/* User Badge */}
      <div className="p-6 flex flex-col items-center border-b border-yellow-300">
        <div className="bg-[#C8910B] text-white w-16 h-16 flex items-center justify-center rounded-full text-xl font-bold">
          {loggedInUser?.firstName?.[0]}
          {loggedInUser?.lastName?.slice(-1)}
        </div>
        <p className="mt-2 font-semibold text-black text-sm">
          {loggedInUser?.firstName} {loggedInUser?.lastName}
        </p>
      </div>

      {/* Main Menu */}
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link
                to={item.path}
                className={`flex items-center px-6 py-3 rounded-l-full transition-all duration-300 ${
                  location.pathname === item.path
                    ? "bg-black text-[#FFD700] font-bold shadow-md"
                    : "text-black hover:bg-[#FFBB33] hover:text-black"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Small Icon Row Below Menu */}
        <div className="mt-4 px-6 pt-4 border-t border-[#f1c152] flex justify-around">
          <Link
            to="/customer-dashboard/profile"
            className={`hover:text-[#FFBB33] ${
              location.pathname === "/customer-dashboard/profile"
                ? "text-[#FFBB33] font-bold"
                : "text-black"
            }`}
          >
            <FaUser size={22} />
          </Link>

          <Link
            to="/customer-dashboard/settings"
            className="text-black hover:text-[#FFBB33]"
          >
            <Settings size={22} />
          </Link>

          <button
            onClick={handleLogout}
            className="text-black hover:text-[#FFBB33]"
          >
            <FaPowerOff size={22} />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default CustomerSidebar;
