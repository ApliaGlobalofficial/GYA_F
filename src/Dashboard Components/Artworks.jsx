import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Pencil } from "lucide-react";
import noProductImage from "../assets/noproductfound.webp";
import {
  getCurrencySymbolByCountry,
  getDateInFormat,
  getCountryNameByUserId,
  FILTER_OPTIONS,
} from "../utilities/Utility";
import { fetchArtsByUserId, deleteArtById } from "../services/ApiService";
import { showNotification } from "../utilities/Utility";
import { toast } from "react-toastify";
import { AlertTriangle } from "lucide-react";

const getUserIdFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const Artworks = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedArtworks, setSelectedArtworks] = useState([]);
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const userId = getUserIdFromToken();
  const [userCountries, setUserCountries] = useState({});

  useEffect(() => {
    if (userId) fetchArtworks(userId);
    else {
      setLoading(false);
      setError("User not authenticated");
    }
  }, [userId]);

  const fetchArtworks = async (userId) => {
    try {
      const response = await fetchArtsByUserId(userId);
      setArtworks(response);
    } catch (error) {
      console.error("Error fetching artworks:", error);
      setError("Failed to load artworks.");
      setArtworks([]);
      showNotification({
        title: "Load Failed",
        message: "Unable to fetch artworks.",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditArtwork = (art) => {
    navigate(`/artist-dashboard/artworks/editartwork/${art.id}`);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredArtworks = artworks
    .filter(
      (art) =>
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (art.artist_info &&
          art.artist_info.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter((art) => {
      if (activeFilter === "All") return true;
      return art.art_status === 0 | art.art_status === 4
        ? "Pending" === activeFilter
        : art.art_status === 1 && "Live" === activeFilter;
    });

  const filterCounts = {
    All: artworks.length,
    Pending: artworks.filter((art) => art.art_status == 0 | art.art_status ==4).length,
    "Live": artworks.filter((art) => art.art_status === 1).length,
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedArtworks(artworks.map((art) => art.id));
    } else {
      setSelectedArtworks([]);
    }
  };

  const handleSelectArtwork = (id) => {
    setSelectedArtworks((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const bulkDelete = async () => {
    if (selectedArtworks.length === 0) {
      showNotification({
        title: "No Selection",
        message: "Please select artworks to delete.",
        type: "warning",
      });
      return;
    }

    const ConfirmToast = ({ closeToast }) => (
      <div className="text-sm">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="text-yellow-500" size={20} />
          <p className="font-semibold text-gray-800">
            Are you sure you want to delete the selected artworks?
          </p>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={async () => {
              closeToast();
              try {
                const deletePromises = selectedArtworks.map((id) =>
                  deleteArtById(id)
                );
                await Promise.all(deletePromises);
                setArtworks((prev) =>
                  prev.filter((art) => !selectedArtworks.includes(art.id))
                );
                setSelectedArtworks([]);
                toast.info("Selected artworks were successfully deleted.");
              } catch (error) {
                console.error("Error deleting artworks:", error);
                setError(
                  error?.response?.data?.message ||
                    "Failed to delete selected artworks."
                );
                toast.error("Failed to delete selected artworks.");
              }
            }}
            className="px-4 py-1 bg-green-600 text-white rounded-md font-semibold"
          >
            Yes
          </button>
          <button
            onClick={closeToast}
            className="px-4 py-1 bg-red-600 text-white rounded-md font-semibold"
          >
            No
          </button>
        </div>
      </div>
    );

    toast(<ConfirmToast />, {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
    });
  };

  useEffect(() => {
    const fetchAllCountries = async () => {
      const countryMap = { ...userCountries };
      await Promise.all(
        artworks.map(async (art) => {
          const userId = art.user_id;
          if (userId && !countryMap[userId]) {
            const country = await getCountryNameByUserId(userId);
            countryMap[userId] = country;
          }
        })
      );
      setUserCountries(countryMap);
    };

    if (artworks?.length > 0) {
      fetchAllCountries();
    }
  }, [artworks]);

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
        <h2 className="text-2xl font-bold font-[Cinzel] text-[#000000]">
          ALL ARTWORKS
        </h2>
        <FilterBar
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          filterCounts={filterCounts}
        />
        {selectedArtworks.length > 0 && (
          <button
            onClick={bulkDelete}
            className="bg-red-600 text-white px-3 py-2 rounded-md font-semibold hover:bg-red-700 transition mr-2"
          >
            Delete Selected ({selectedArtworks.length})
          </button>
        )}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search artworks..."
            value={searchQuery}
            onChange={handleSearch}
            className="px-4 py-2 border rounded-md"
          />
          <button
            onClick={() => navigate("/artist-dashboard/artworks/add-artwork")}
            className="flex items-center px-6 py-3 bg-black text-[#e3c27e] text-lg font-semibold transition duration-300 shadow-lg transform hover:scale-105 rounded-md"
          >
            <PlusCircle className="mr-2" size={20} />
            Add Artwork
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-lg font-bold text-gray-600">
          Loading artworks...
        </div>
      ) : error ? (
        <div className="text-center text-red-600 font-bold">{error}</div>
      ) : (
        <div className="bg-white p-6 shadow-lg rounded-lg border border-[#e3c27e]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse shadow-md rounded-lg">
              <thead>
                <tr className="bg-[#ffe974] text-[#2c3e50]">
                  <th className="border border-[#e3c27e] px-6 py-3">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedArtworks.length === artworks.length}
                    />
                  </th>
                  {[
                    "Image",
                    "Name",
                    "Category",
                    "Price",
                    "Stock",
                    "Short Descriptions",
                    "Uploaded On",
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className="border border-[#e3c27e] px-6 py-3 text-sm font-bold uppercase text-left"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredArtworks.length > 0 ? (
                  filteredArtworks.map((art, index) => (
                    <tr
                      key={art.id}
                      className={index % 2 === 0 ? "bg-[#fffcea]" : "bg-white"}
                    >
                      <td className="border border-[#e3c27e] px-4 py-3">
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            checked={selectedArtworks.includes(art.id)}
                            onChange={() => handleSelectArtwork(art.id)}
                          />
                        </div>
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3">
                        <img
                          src={art.file}
                          alt={art.title}
                          className="w-16 h-16 object-cover rounded-md"
                          onError={(e) => (e.target.src = noProductImage)}
                        />
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3 font-semibold">
                        {art.title}
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3">
                        {art.category || "N/A"}
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3 font-bold w-48">
                        {art.discounted_price !== null ? (
                          <>
                            <span className="line-through text-red-500 mr-2">
                              {art.currency_symbol || art.currency_key}
                              {art.price}
                            </span>
                            <br />
                            <span className="text-green-500">
                              {art.currency_symbol || art.currency_key}
                              {art.discounted_price}
                            </span>
                          </>
                        ) : (
                          <>
                            {art.currency_symbol || art.currency_key}
                            {art.price}
                          </>
                        )}
                      </td>
                      <td
                        className={`border border-[#e3c27e] px-4 py-3 font-bold ${
                          art.art_status == 3
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {art.art_status == 3 ? "Out Of Stock" : "Live"}
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3">
                        {art.tags || "N/A"}
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3">
                        {getDateInFormat(art.uploaded_on) || "N/A"}
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3">
                        <div className="flex items-center space-x-2 justify-center">
                          <button
                            onClick={() => handleEditArtwork(art)}
                            className="text-blue-500"
                          >
                            <Pencil size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-6">
                      <img
                        src={noProductImage}
                        alt="No Products"
                        className="w-40 mb-4 mx-auto"
                      />
                      <h2 className="text-2xl font-[Cinzel] font-bold text-[#2c3e50]">
                        NO PRODUCTS FOUND!
                      </h2>
                      {/* <button
                        onClick={() =>
                          navigate("/artist-dashboard/artworks/add-artwork")
                        }
                        className="mt-4 flex items-center px-6 py-3 bg-black text-[#e3c27e] text-lg font-semibold rounded-md"
                      >
                        <PlusCircle className="mr-2" size={20} />
                        Add new product
                      </button> */}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterBar = ({ activeFilter, setActiveFilter, filterCounts }) => {
  return (
    <div className="flex gap-3 flex-wrap items-center mt-4 mb-6">
      {FILTER_OPTIONS.map((filter) => {
        const isActive = activeFilter === filter;
        const baseClasses =
          "px-4 py-1.5 text-sm rounded-md font-semibold border transition-all";
        const activeClasses = "bg-[#D9534F] text-white border-[#D9534F]";
        const inactiveClasses =
          "bg-white text-[#D4AF37] border-[#D4AF37] hover:bg-[#fff7e6]";

        return (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`${baseClasses} ${
              isActive ? activeClasses : inactiveClasses
            }`}
          >
            {filter} ({filterCounts[filter] || 0})
          </button>
        );
      })}
    </div>
  );
};

export default Artworks;
