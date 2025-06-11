import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  fetchAllArtsForAdmin,
  approvedArtByAdmin,
  rejectArtByAdmin,
} from "../services/ApiService";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { getCountryNameByUserId, showNotification } from "../utilities/Utility";

export const ArtGridForAdmin = ({ columns }) => {
  ArtGridForAdmin.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [userCountries, setUserCountries] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 20;

  // ✅ Reusable fetchData
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchAllArtsForAdmin(currentPage, itemsPerPage);
      setData(response.data);
      setTotalPages(Math.ceil(response.total / itemsPerPage));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const selectStatus = (art, status) => {
    const action = status === 1 ? approvedArtByAdmin : rejectArtByAdmin;
    const actionLabel = status === 1 ? "Approved" : "Rejected";
    const notificationType = status === 1 ? "success" : "warning";

    action(art.id)
      .then(() => {
        showNotification({
          title: `Art ${actionLabel}`,
          message: `"${
            art.title
          }" has been ${actionLabel.toLowerCase()} by Admin.`,
          type: notificationType,
        });
        fetchData(); // ✅ Refresh after action
      })
      .catch((error) => {
        console.error(`Error ${actionLabel.toLowerCase()}:`, error);
        showNotification({
          title: `${actionLabel} Failed`,
          message: `Could not ${actionLabel.toLowerCase()} "${art.title}".`,
          type: "danger",
        });
      });
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  useEffect(() => {
    const fetchAllCountries = async () => {
      const countryMap = { ...userCountries };
      await Promise.all(
        data.map(async (art) => {
          const userId = art.user_id;
          if (userId && !countryMap[userId]) {
            const country = await getCountryNameByUserId(userId);
            countryMap[userId] = country;
          }
        })
      );
      setUserCountries(countryMap);
    };

    if (data?.length > 0) {
      fetchAllCountries();
    }
  }, [data]);

  const filteredData = data.filter(
    (art) =>
      (art.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (art.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (art.tags || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
        <h2 className="text-2xl font-bold font-[Cinzel] text-[#000000]">
          ALL ART REQUESTS
        </h2>
        <input
          type="text"
          placeholder="Search artworks..."
          className="border border-[#e3c27e] px-4 py-2 rounded-md w-80 focus:outline-none focus:ring-1 focus:ring-[#e3c27e]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-center text-lg font-semibold">Loading...</p>
      ) : (
        <div className="bg-white p-6 shadow-lg rounded-lg border border-[#e3c27e]">
          <div className="overflow-x-auto w-full">
            <table className="min-w-[1400px] border-collapse shadow-md rounded-lg overflow-visible">
              <thead>
                <tr className="bg-[#ffe974] text-[#000000]">
                  {columns.map((column, index) => {
                    if (
                      column === "Artist Info" ||
                      column === "Art Description"
                    )
                      return null;
                    return (
                      <th
                        key={index}
                        className="border border-[#7a7a7a7a] px-6 py-3 text-sm font-bold uppercase text-left"
                      >
                        {column}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {data?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length - 2 + 1}
                      className="px-4 py-3 text-center text-red-600 font-semibold"
                    >
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((art, index) => (
                    <tr
                      key={art.id}
                      className={index % 2 === 0 ? "bg-[#fffcea]" : "bg-white"}
                    >
                      <td className="border border-[#e3c27e] px-4 py-3 font-semibold">
                        {art.title}
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3">
                        {art.category || "N/A"}
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3">
                        {userCountries[art.user_id] || "Loading..."}
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3 text-green-600 font-semibold min-w-[110px]">
                        {art.currency_symbol || art.currency_key}{" "}
                        {art.price || "N/A"}
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3">
                        {art.currency_symbol || art.currency_key}{" "}
                        {art.discounted_price || "N/A"}
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3">
                        <a
                          href={art.file}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          View Art
                        </a>
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3">
                        <a
                          href={art.cover_img}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          View Cover Image
                        </a>
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3">
                        {art.tags || "N/A"}
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3">
                        {art.uploaded_on
                          ? format(
                              new Date(art.uploaded_on),
                              "yyyy-MM-dd HH:mm:ss"
                            )
                          : "N/A"}
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3 font-semibold">
                        {art.art_status === 0
                          ? "Pending"
                          : art.art_status === 1
                          ? "Verified"
                          : "Rejected"}
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3 relative overflow-visible">
                        <button
                          onClick={() => toggleDropdown(art.id)}
                          className="bg-black text-white px-3 py-1 rounded-md flex items-center gap-1"
                        >
                          Actions <ChevronDown size={14} />
                        </button>
                        {openDropdownId === art.id && (
                          <div className="absolute z-50 right-0 mt-2 w-36 bg-white border border-gray-300 rounded shadow-md text-sm">
                            <button
                              onClick={() => selectStatus(art, 1)}
                              className="block w-full px-4 py-2 bg-green-600 text-white hover:bg-green-700 text-left"
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => selectStatus(art, 2)}
                              className="block w-full px-4 py-2 bg-red-500 text-white hover:bg-red-600 text-left"
                            >
                              ❌ Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="mt-4 bg-white py-2 flex justify-between items-center border-t border-gray-300 rounded-b-lg px-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-[#2c3e50] font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
