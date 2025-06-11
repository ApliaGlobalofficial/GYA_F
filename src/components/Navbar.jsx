import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import flags from "emoji-flags";
import { FaChevronDown, FaMapMarkerAlt } from "react-icons/fa";
import logo from "../assets/getyourartslogo.jpg";
import {
  getLocationData,
  updateCountry,
  getCurrenyDetailsByCountryName,
} from "../services/ApiService";

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [countryOptions, setCountryOptions] = useState([]);
  const [selectedCountryOption, setSelectedCountryOption] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userRole, setUserRole] = useState("customer");
  const location = useLocation();
  const dropdownRef = useRef(null);
  const countryDropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const isActive = (path) =>
    location.pathname === path ? "text-[#e3c27e]" : "text-white";

  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?._id || user?.id;
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserRole(null);
    navigate("/");
    window.location.reload();
  };

  const handleCountryChange = async (selected) => {
    setSelectedCountryOption(selected);
    localStorage.setItem("selectedCountry", selected.value);
    setOpenDropdown(null); // ✅ close dropdown on manual select
    getCurrenyDetailsByCountryName(selected.value)
      .then((res) => {
        localStorage.setItem("currency", JSON.stringify(res));
      })
      .catch((ex) => console.error(ex));

    try {
      const userId = getUserId();
      if (userId) {
        await updateCountry(userId, { country: selected.value });
      }
    } catch (err) {
      console.warn("Could not update country in DB", err);
    }

    // ✅ Reload page after setting country
    window.location.reload();
  };

  const detectLocation = async () => {
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        const apiUrl = `${
          import.meta.env.VITE_GEOLOCATION_API_URL
        }reverse?lat=${latitude}&lon=${longitude}&format=json`;
        console.log("Geolocation API URL:", apiUrl);

        const data = await getLocationData(apiUrl);
        console.log("Geolocation Data:", data);

        const detectedCountry = data?.address?.country;
        if (detectedCountry) {
          const match = countryOptions.find(
            (c) => c.value.toLowerCase() === detectedCountry.toLowerCase()
          );

          if (match) {
            setSelectedCountryOption(match);
            localStorage.setItem("selectedCountry", match.value);
            getCurrenyDetailsByCountryName(match.value)
              .then((res) => {
                localStorage.setItem("currency", JSON.stringify(res));
              })
              .catch((ex) => console.error(ex));
            // const userId = getUserId();
            // if (userId) {
            //   await updateCountry(userId, { country: match.value });
            // }

            setOpenDropdown(null); // ✅ close the modal here
          } else {
            alert(`Detected country (${detectedCountry}) not in your list`);
          }
        } else {
          alert("Could not detect country");
        }
      });
    } catch (err) {
      console.error("Geolocation error", err);
      alert("Failed to detect your location");
    }
  };

  useEffect(() => {
    const triggerDropdown = () => {
      setOpenDropdown("countries");
    };
    window.addEventListener("triggerCountryDropdown", triggerDropdown);

    return () => {
      window.removeEventListener("triggerCountryDropdown", triggerDropdown);
    };
  }, []);

  useEffect(() => {
    const countries = flags.data.map((country) => ({
      value: country.name,
      label: `${country.emoji} ${country.name}`,
    }));
    setCountryOptions(countries);

    const stored = localStorage.getItem("selectedCountry");

    if (!stored) {
      setOpenDropdown("countries");
    } else {
      const match = countries.find((c) => c.value === stored);
      if (match) {
        setSelectedCountryOption(match); // ✅ Use the full match object (has label with emoji)
      }
    }

    const user = localStorage.getItem("user");
    if (user) setUserRole(JSON.parse(user).role.toLowerCase());
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setUserRole(JSON.parse(user).role.toLowerCase());
    else setUserRole(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-center bg-[#000000] text-white py-14 px-6 border-b-2 border-[#C4A35A] shadow-md z-50">
      <div className="absolute left-20 ml-20">
        <img src={logo} alt="GetYourArts Logo" className="w-[90px] h-[110px]" />
      </div>

      <div className="flex justify-center ml-[300px] space-x-10 items-center">
        <Link
          to="/"
          className={`text-xl font-medium hover:text-[#e3c27e] ${isActive(
            "/"
          )}`}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={`text-xl font-medium hover:text-[#e3c27e] ${isActive(
            "/about"
          )}`}
        >
          About
        </Link>
        <Link
          to="/contact"
          className={`text-xl font-medium hover:text-[#e3c27e] ${isActive(
            "/contact"
          )}`}
        >
          Contact
        </Link>

        {userRole === "artist" && (
          <>
            <Link
              to="/shop-art"
              className={`text-xl font-medium hover:text-[#e3c27e] ${isActive(
                "/find-venue"
              )}`}
            >
              Explore Venues
            </Link>
            <Link
              to="/artist-dashboard"
              className={`ml-6 text-xl font-medium hover:text-[#e3c27e] ${isActive(
                "/artist-dashboard"
              )}`}
            >
              Dashboard
            </Link>
            {/* <Link
              to="/artist-profiles"
              className={`ml-6 text-xl font-medium hover:text-[#e3c27e] ${isActive(
                "/venue-dashboard"
              )}`}
            >
              My Profile
            </Link> */}
          </>
        )}

        {userRole === "venue" && (
          <>
            <Link
              to="/find-artwork"
              className={`text-xl font-medium hover:text-[#e3c27e] ${isActive(
                "/find-artwork"
              )}`}
            >
              Explore Artist
            </Link>
            <Link
              to="/venue-dashboard"
              className={`ml-6 text-xl font-medium hover:text-[#e3c27e] ${isActive(
                "/venue-dashboard"
              )}`}
            >
              Dashboard
            </Link>
          </>
        )}

        {userRole !== "artist" && userRole !== "venue" && (
          <Link
            to="/shop-art"
            className={`ml-6 text-xl font-medium hover:text-[#e3c27e] ${isActive(
              "/shop-art"
            )}`}
          >
            Shop Art
          </Link>
        )}

        {userRole ? (
          <>
            <button
              onClick={handleLogout}
              className="text-xl font-medium hover:text-[#e3c27e]"
            >
              Logout
            </button>

            {userRole === "customer" && (
              <Link
                to="/customer-dashboard"
                className="text-xl font-medium hover:text-[#e3c27e] ml-4"
              >
                My Profile
              </Link>
            )}
          </>
        ) : (
          <Link
            to="/user-signin"
            className="text-xl font-medium hover:text-[#e3c27e]"
          >
            Sign In
          </Link>
        )}

        {userRole === "admin" ? (
          <Link
            to="/admin-dashboard"
            className={`text-xl font-medium font-[Lato,sans-serif] hover:text-[#e3c27e] ${isActive(
              "/admin-dashboard"
            )}`}
          >
            Dashboard
          </Link>
        ) : (
          <div className="relative" ref={countryDropdownRef}>
            <button
              onClick={() => toggleDropdown("countries")}
              className="text-xl font-medium flex items-center hover:text-[#e3c27e] space-x-1"
            >
              {selectedCountryOption ? (
                <>
                  <FaMapMarkerAlt className="mr-1 text-[#e3c27e]" />
                  <span>{selectedCountryOption.label}</span>
                </>
              ) : (
                <>
                  <span>Choose Country</span>
                  <FaChevronDown className="text-xs" />
                </>
              )}
            </button>

            {openDropdown === "countries" && (
              <div className="absolute bg-white text-black mt-2 py-3 px-4 w-72 shadow-lg rounded-md border border-gray-300 z-50">
                {/* Small ✕ Close Button */}
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setOpenDropdown(null)}
                    className="text-gray-400 hover:text-black text-sm"
                    title="Close"
                  >
                    ✕
                  </button>
                </div>

                {/* Auto-locate */}
                <div
                  onClick={detectLocation}
                  className="flex items-center gap-2 mb-3 text-sm cursor-pointer hover:text-[#e3c27e]"
                >
                  <FaMapMarkerAlt />
                  <span>📍 Locate Automatically</span>
                </div>

                <Select
                  options={countryOptions}
                  value={selectedCountryOption}
                  onChange={handleCountryChange}
                  isSearchable
                  placeholder="Choose Country"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
