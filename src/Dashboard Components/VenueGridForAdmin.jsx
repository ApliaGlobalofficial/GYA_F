import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  fetchAllVenues,
  approvedVenueByAdmin,
  rejectedVenueByAdmin,
} from "../services/ApiService";
import { format } from "date-fns";
import { showNotification } from "../utilities/Utility";
import { ChevronDown, Search } from "lucide-react";

export const VenueGridForAdmin = ({ columns }) => {
  VenueGridForAdmin.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 20;

  const fetchData = async () => {
    try {
      const res = await fetchAllVenues(currentPage, itemsPerPage);
      if (res.status === "success") {
        setData(res.data);
        setTotalPages(Math.ceil(res.total / itemsPerPage));
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const selectStatus = (venue, status) => {
    const action = status === 1 ? approvedVenueByAdmin : rejectedVenueByAdmin;
    const label = status === 1 ? "Approved" : "Rejected";
    const type = status === 1 ? "success" : "warning";

    action(venue.venue_id)
      .then(() => {
        showNotification({
          title: `Venue ${label}`,
          message: `"${
            venue.venue_name
          }" has been ${label.toLowerCase()} by Admin.`,
          type,
        });
        fetchData();
      })
      .catch((error) => {
        console.error(`Error ${label.toLowerCase()}ing:`, error);
        showNotification({
          title: `${label} Failed`,
          message: `Could not ${label.toLowerCase()} "${venue.venue_name}".`,
          type: "danger",
        });
      });
  };

  const filteredData = data.filter(
    (venue) =>
      venue.venue_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.registered_company_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold font-[Cinzel] text-[#000000]">
          ALL VENUE REQUESTS
        </h2>

        <div className="relative w-80">
          <input
            type="text"
            placeholder="Search venues..."
            className="w-full pl-10 pr-4 py-2 border border-[#e3c27e] rounded focus:outline-none focus:ring-1 focus:ring-[#f1c152]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute top-2.5 left-3 text-gray-500" size={18} />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-lg font-semibold">Loading...</p>
      ) : (
        <div className="bg-white p-6 shadow-lg rounded-lg border border-[#e3c27e]">
          <div className="overflow-x-auto w-full">
            <table className="min-w-[1400px] w-full text-sm border-collapse">
              <thead
                className="bg-[#ffe974]"
                style={{ position: "sticky", top: 0, zIndex: 1 }}
              >
                <tr className="text-left text-black font-semibold">
                  {columns.map((column, index) => {
                    if (column === "Venue Description" || column === "Actions")
                      return null;
                    return (
                      <th
                        key={index}
                        className="px-4 py-3 border border-[#7A7A7A7A]"
                      >
                        {column}
                      </th>
                    );
                  })}
                  <th className="px-4 py-3 border border-[#7A7A7A7A]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-3 text-center text-red-600 font-semibold"
                    >
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((venue, index) => (
                    <tr
                      key={venue.venue_id}
                      className={index % 2 === 0 ? "bg-[#fffcea]" : "bg-white"}
                    >
                      <td className="px-4 py-3 border border-[#e3c27e]">
                        {venue.venue_id}
                      </td>
                      <td className="px-4 py-3 border border-[#e3c27e]">
                        {venue.venue_name || "N/A"}
                      </td>
                      <td className="px-4 py-3 border border-[#e3c27e]">
                        {venue.website || "N/A"}
                      </td>
                      <td className="px-4 py-3 border border-[#e3c27e]">
                        {venue.venue_established_date
                          ? format(
                              new Date(venue.venue_established_date),
                              "yyyy-MM-dd"
                            )
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 border border-[#e3c27e]">
                        {venue.registered_company_name || "N/A"}
                      </td>
                      <td className="px-4 py-3 border border-[#e3c27e]">
                        {venue.company_type}
                      </td>
                      <td className="px-4 py-3 border border-[#e3c27e]">
                        {venue.created_at
                          ? format(
                              new Date(venue.created_at),
                              "yyyy-MM-dd HH:mm"
                            )
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 border border-[#e3c27e]">
                        {venue.art_location_to_be_displayed || "N/A"}
                      </td>

                      <td className="px-4 py-3 border border-[#e3c27e] truncate max-w-[150px]">
                        {venue.venue_type}
                      </td>
                      <td className="px-4 py-3 border border-[#e3c27e]">
                        {venue.venue_status === 0
                          ? "Pending"
                          : venue.venue_status === 1
                          ? "Approved by Admin"
                          : "Rejected by Admin"}
                      </td>
                      <td className="px-4 py-3 border border-[#e3c27e] relative overflow-visible">
                        <button
                          onClick={() => toggleDropdown(venue.venue_id)}
                          className="bg-black text-white px-3 py-1 rounded-md flex items-center gap-1"
                        >
                          Actions <ChevronDown size={14} />
                        </button>
                        {openDropdownId === venue.venue_id && (
                          <div className="absolute z-50 right-0 mt-2 w-36 bg-white border border-gray-300 rounded shadow-md text-sm">
                            <button
                              onClick={() => selectStatus(venue, 1)}
                              className="block w-full px-4 py-2 bg-green-600 text-white hover:bg-green-700 text-left"
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => selectStatus(venue, 2)}
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
          </div>

          <div className="sticky bottom-0 bg-white py-2 flex justify-between items-center border-t border-gray-300 mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
