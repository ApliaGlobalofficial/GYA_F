import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Gift,
  BarChart2,
  MessageSquare,
  Bell,
  Settings,
  User,
  CalendarCheck,
} from "lucide-react";
import { FaPowerOff } from "react-icons/fa";

const VenueSidebar = ({ activePage }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload(); // ✅ Force refresh
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/venue-dashboard",
    },
    {
      name: "My Profile",
      icon: <Package size={20} />,
      path: "/venue-dashboard/products",
    },
    {
      name: "Booking Request",
      icon: <CalendarCheck size={20} />,
      path: "/venue-dashboard/booking-request",
    },
    {
      name: "Slots",
      icon: <MessageSquare size={20} />,
      path: "/venue-dashboard/slots",
    },
    {
      name: "Coupons",
      icon: <Gift size={20} />,
      path: "/venue-dashboard/coupons",
    },
    {
      name: "Reports",
      icon: <BarChart2 size={20} />,
      path: "/venue-dashboard/reports",
    },
    {
      name: "Reviews",
      icon: <MessageSquare size={20} />,
      path: "/venue-dashboard/reviews",
    },
    {
      name: "Notifications",
      icon: <Bell size={20} />,
      path: "/venue-dashboard/announcements",
    },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/venue-dashboard/settings",
    },
  ];

  return (
    <div className="h-full w-64 bg-gradient-to-b from-[#FFD580] to-[#FFFACD] text-black flex flex-col shadow-lg">
      <nav className="mt-[50px]">
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

        {/* Compact Icon Row Below Menu */}
        <div className="mt-4 px-6 pt-4 border-t border-[#f1c152] flex justify-around">
          <Link
            to="/venue-dashboard/profile"
            className={`hover:text-[#FFBB33] ${
              activePage === "profile"
                ? "text-[#FFBB33] font-bold"
                : "text-black"
            }`}
          >
            <User size={22} />
          </Link>

          <Link to="/settings" className="text-black hover:text-[#FFBB33]">
            <Settings size={22} />
          </Link>

          <button
            onClick={handleLogout}
            className="text-black hover:text-[#FFBB33]"
          >
            <FaPowerOff size={20} />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default VenueSidebar;
