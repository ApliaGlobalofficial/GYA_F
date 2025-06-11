import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  fetchSlotRequests,
  rejectedByAdmin,
  approvedByAdmin,
} from "../services/ApiService";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { showNotification } from "../utilities/Utility";

export const SlotGridForAdmin = ({ columns }) => {
  SlotGridForAdmin.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const itemsPerPage = 20;

  const fetchData = async () => {
    try {
      const response = await fetchSlotRequests(currentPage, itemsPerPage);
      setData(response.data?.data || []);
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

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const selectStatus = async (id, status) => {
    const action = status === 1 ? approvedByAdmin : rejectedByAdmin;
    const label = status === 1 ? "Approved" : "Rejected";
    const type = status === 1 ? "success" : "warning";

    try {
      await action(id);
      showNotification({
        title: `Slot ${label}`,
        message: `Slot has been ${label.toLowerCase()} by Admin.`,
        type,
      });
      fetchData();
    } catch (error) {
      console.error(`Error during ${label}:`, error);
      showNotification({
        title: `${label} Failed`,
        message: `Could not ${label.toLowerCase()} the slot request.`,
        type: "danger",
      });
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold font-[Cinzel] text-[#000000]">
          ALL SLOT REQUESTS
        </h2>
      </div>

      {loading ? (
        <div className="text-center text-lg font-bold text-gray-600">
          Loading requests...
        </div>
      ) : (
        <div className="bg-white p-6 shadow-lg rounded-lg border border-[#e3c27e]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse shadow-md rounded-lg">
              <thead>
                <tr className="bg-[#ffe974] text-[#000000]">
                  {columns
                    .filter(
                      (column) =>
                        !["email", "phone", "name", "surname"].includes(
                          column.toLowerCase()
                        )
                    )
                    .map((column, index) => (
                      <th
                        key={index}
                        style={{
                          minWidth:
                            column.toLowerCase() === "date" ||
                            column.toLowerCase() === "status"
                              ? "200px"
                              : "auto",
                        }}
                        className="border border-[#7a7a7a7a] px-6 py-3 text-sm font-bold uppercase text-left"
                      >
                        {column}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="px-4 py-3 text-center text-red-600 font-semibold"
                    >
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  data.map((b, index) => (
                    <tr
                      key={b.id}
                      className={`${
                        index % 2 === 0 ? "bg-[#fffcea]" : "bg-white"
                      }`}
                    >
                      <td className="border border-[#e3c27e] px-4 py-3">
                        {b.created_at
                          ? format(
                              new Date(b.created_at),
                              "yyyy-MM-dd HH:mm:ss"
                            )
                          : "N/A"}
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3 w-48 min-w-[12rem] whitespace-normal">
                        {b?.venue.venue_name}
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3 w-48 min-w-[12rem] whitespace-normal">
                        {b?.venue?.location.display_name}
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3 w-48 min-w-[12rem] whitespace-normal">
                        {b.slot?.slot_name}
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-4 text-green-600">
                        {b.slot.currency_symbol || b.slot.currency_key}{" "}
                        {b.slot?.slot_price}
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3 text-blue-600">
                        {b.slot.currency_symbol || b.slot.currency_key}{" "}
                        {b.service_charge}
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3 font-bold text-green-600">
                        {b.slot.currency_symbol || b.slot.currency_key}{" "}
                        {b.slot?.slot_price && b.service_charge
                          ? (
                              parseFloat(b.slot?.slot_price) +
                              parseFloat(b.service_charge)
                            ).toFixed(2)
                          : "N/A"}
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3">
                        {b.request_status === 0
                          ? "Pending"
                          : b.request_status === 1
                          ? "Approved by Venue and Pending by Admin"
                          : b.request_status === 2
                          ? "Approved by Admin"
                          : b.request_status === 3
                          ? "Rejected by Venue"
                          : b.request_status === 4
                          ? "Rejected by Admin"
                          : "Pending"}
                      </td>
                      <td className="border border-[#e3c27e] px-4 py-3 relative overflow-visible">
                        {(b.request_status === 1 ||
                          b.request_status === 2 ||
                          b.request_status === 4) && (
                          <>
                            <button
                              onClick={() => toggleDropdown(b.id)}
                              className="bg-black text-white px-3 py-1 rounded-md flex items-center gap-1"
                            >
                              Actions <ChevronDown size={14} />
                            </button>
                            {openDropdownId === b.id && (
                              <div className="absolute z-50 right-0 mt-2 w-36 bg-white border border-gray-300 rounded shadow-md text-sm">
                                <button
                                  onClick={() => selectStatus(b.id, 1)}
                                  className="block w-full px-4 py-2 bg-green-600 text-white hover:bg-green-700 text-left"
                                >
                                  ✅ Approve
                                </button>
                                <button
                                  onClick={() => selectStatus(b.id, 2)}
                                  className="block w-full px-4 py-2 bg-red-500 text-white hover:bg-red-600 text-left"
                                >
                                  ❌ Reject
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </td>
                  
                      <td className="border border-[#e3c27e] px-4 py-3 text-center">
                        <a href={b.art.cover_img} target="_blank" rel="noopener noreferrer">
                          <img
                            src={b.art.cover_img}
                            alt="Artwork"
                            className="w-16 h-16 object-cover rounded-md hover:opacity-90 transition duration-200"
                          />
                        </a>
                      </td>

                      <td className="border border-[#e3c27e] px-4 py-3">
                        {b.slot?.slot_dimension}
                      </td>
                     
                      <td className="border border-[#e3c27e] px-4 py-3">
                        {b.art.is_art_mounted ? (
                          <span className="text-green-700 font-semibold">
                            Yes
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold">No</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="sticky bottom-0 bg-white py-4 flex justify-between items-center border-t border-gray-300 mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="font-semibold">
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
      )}
    </div>
  );
};
