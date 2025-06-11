import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PaintBucket,
  MapPin,
  Grid,
  Ticket,
  Settings,
  LogOut,
  Globe,
  Newspaper,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { FaPowerOff } from "react-icons/fa";

const AdminSidebar = ({ selectedComponent, setSelectedComponent }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Art Requests", icon: <PaintBucket size={20} />, key: "arts" },
    // { name: "Slot Requests", icon: <Grid size={20} />, key: "slot" },
    { name: "Venue Requests", icon: <MapPin size={20} />, key: "venue" },
    // {
    //   name: "Slot Master",
    //   icon: <LayoutDashboard size={20} />,
    //   key: "slotmaster",
    // },
    {
      name: "Slot Requests By Venue",
      icon: <Grid size={20} />,
      key: "slotrequests",
    },
    {
      name: "Art Requests (New & Edited)",
      icon: <PaintBucket size={20} />,
      key: "artsrequests",
    },
    { name: "Support Tickets", icon: <Ticket size={20} />, key: "support" },

    { name: "Our Policies", icon: <FileText size={20} />, key: "ourpolicies" },
    {
      name: "Terms and Conditions for Platform",
      icon: <BadgeCheck size={20} />,
      key: "tncplatform",
    },
    { name: "Update News", icon: <Newspaper size={20} />, key: "updatenews" },
    { name: "Add Country", icon: <Globe size={20} />, key: "countrymaster" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-[#FFD580] to-[#FFFACD] text-black flex flex-col shadow-lg overflow-y-auto">
      <div className="p-6 border-b border-[#f1c152] text-center">
        <h1 className="text-xl font-bold font-[Cinzel] text-black">
          ADMIN PANEL
        </h1>
      </div>

      <nav className="flex-1 mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.key} className="mb-1">
              <button
                onClick={() => setSelectedComponent(item.key)}
                className={`w-full text-left flex items-center px-6 py-3 rounded-l-full transition-all duration-300 ${
                  selectedComponent === item.key
                    ? "bg-black text-[#FFD700] font-bold shadow-md"
                    : "text-black hover:bg-[#FFBB33] hover:text-black"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-[#f1c152] flex justify-center">
        <button
          onClick={handleLogout}
          className="text-black hover:text-[#FFBB33]"
        >
          <FaPowerOff size={22} />
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
