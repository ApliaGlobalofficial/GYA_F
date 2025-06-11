import React, { useState, useEffect } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { FiGrid, FiList } from "react-icons/fi";
import { MdToggleOff, MdToggleOn } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { fetchAllArtist } from "../services/ApiService";

const FindArtwork = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [sortOption, setSortOption] = useState("Most Popular");
  const [isFeatured, setIsFeatured] = useState(false);
  const [openNow, setOpenNow] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [artistData, setArtistData] = useState([]);
  const [filteredArtistData, setFilteredArtistData] = useState([]);
  const [searchVendor, setSearchVendor] = useState("");

  const navigate = useNavigate();

  const toggleMenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artistsData = await fetchAllArtist();
        setArtistData(artistsData);
        setFilteredArtistData(artistsData);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };
    fetchArtists();
  }, []);

  const applyFilters = () => {
    let filtered = [...artistData];

    // Search filter
    if (searchVendor.trim()) {
      const lowerSearch = searchVendor.toLowerCase();
      filtered = filtered.filter(
        (data) =>
          data.user.firstname.toLowerCase().includes(lowerSearch) ||
          data.user.lastname.toLowerCase().includes(lowerSearch)
      );
    }

    // Featured filter
    if (isFeatured) {
      filtered = filtered.filter((data) => data.is_featured); // Replace with actual key
    }

    // Open now filter
    if (openNow) {
      filtered = filtered.filter((data) => data.is_open_now); // Replace with actual key
    }

    setFilteredArtistData(filtered);
  };

  useEffect(() => {
    applyFilters(); // Reapply filters on toggle change
  }, [isFeatured, openNow]);

  return (
    <div className="min-h-screen bg-[#ffffff] p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold font-[Cinzel] text-[#000000] mt-[10px] mb-6 text-center">
          STORE LISTING
        </h1>

        {/* Filter + Sort Panel */}
        <div className="bg-white border border-[#e3c27e] rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-lg font-semibold">
              Total stores showing: {filteredArtistData?.length}
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">Sort by:</span>
                <select
                  className="border border-[#e3c27e] rounded px-3 py-1 text-sm"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option>Most Popular</option>
                  <option>Most Recent</option>
                  <option>Random</option>
                  <option>Top Rated</option>
                  <option>Most Reviewed</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded border ${
                    viewMode === "grid" ? "bg-[#e3c27e]" : "hover:bg-gray-100"
                  }`}
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded border ${
                    viewMode === "list" ? "bg-[#e3c27e]" : "hover:bg-gray-100"
                  }`}
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Toggle Filters */}
        <div className="bg-white border border-[#e3c27e] rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Search Vendors"
              className="border border-[#e3c27e] rounded px-3 py-2 flex-1"
              onChange={(e) => setSearchVendor(e.target.value)}
              value={searchVendor}
            />
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Featured:</span>
              <button
                onClick={() => setIsFeatured(!isFeatured)}
                className="flex items-center gap-2 px-4 py-2"
              >
                {isFeatured ? (
                  <MdToggleOn className="text-green-500 text-5xl" />
                ) : (
                  <MdToggleOff className="text-gray-400 text-5xl" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Open Now:</span>
              <button
                onClick={() => setOpenNow(!openNow)}
                className="flex items-center gap-2 px-4 py-2"
              >
                {openNow ? (
                  <MdToggleOn className="text-green-500 text-5xl" />
                ) : (
                  <MdToggleOff className="text-gray-400 text-5xl" />
                )}
              </button>
            </div>
            <button
              onClick={applyFilters}
              className="flex items-center px-4 py-2 bg-black text-[#e3c27e] text-lg font-semibold transition duration-300 shadow-lg transform hover:scale-105 rounded-md"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Artist Cards */}
        <div
          className={`max-w-7xl mx-auto grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {filteredArtistData?.map((artist, idx) => (
            <div
              key={idx}
              onClick={() =>
                navigate("/artist-profiles", { state: { artistData: artist } })
              }
              className="relative rounded-lg overflow-hidden bg-white border border-[#e3c27e] shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              {/* Top Image */}
              <div
                className="h-44 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${artist?.background_img})` }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 p-4 text-white flex flex-col justify-end">
                  <h3 className="text-lg font-bold">
                    {artist?.user.firstname + " " + artist?.user.lastname}
                  </h3>
                  <p className="text-sm">{artist?.user.address}</p>
                  {artist?.user.phone && (
                    <p className="text-sm flex items-center">
                      <FaPhoneAlt className="mr-2" /> {artist?.user.phone}
                    </p>
                  )}
                </div>

                {/* Floating Profile Image */}
                <div className="absolute bottom-[-20px] right-4 bg-white rounded-full p-1 shadow-md z-10">
                  <img
                    src={artist?.profile_img}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border border-white"
                  />
                </div>
              </div>

              {/* Bottom Strip */}
              <div className="flex justify-start items-center bg-white px-2 py-3 mt-6">
                <button className="bg-black text-[#e3c27e] rounded-full w-10 h-10 flex items-center justify-center text-lg hover:text-white transition">
                  <IoIosArrowForward />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindArtwork;
