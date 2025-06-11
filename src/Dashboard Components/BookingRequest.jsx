import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import {
  fetchAllSlotRequestsByVenueUserId,
  approvedByVenue,
  rejectedByVenue,
} from "../services/ApiService";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { showNotification } from "../utilities/Utility";

const BookingRequest = () => {
  const navigate = useNavigate();
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [slotRequests, setSlotRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [userId, setUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const selectStatus = (id, status) => {
    const action = status === 1 ? approvedByVenue : rejectedByVenue;
    const label = status === 1 ? "Approved" : "Rejected";
    const type = status === 1 ? "success" : "warning";

    action(id)
      .then(() => {
        showNotification({
          title: `Booking ${label}`,
          message: `Slot has been ${label.toLowerCase()} successfully.`,
          type,
        });
        fetchData();
      })
      .catch((error) => {
        console.error(error);
        showNotification({
          title: `${label} Failed`,
          message: `Could not ${label.toLowerCase()} the booking.`,
          type: "danger",
        });
      });
  };

  const fetchData = () => {
    fetchAllSlotRequestsByVenueUserId(userId).then((res) => {
      setSlotRequests(res);
      setFilteredRequests(res);
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.user_id);
      } catch {
        alert("Session expired. Login again.");
        navigate("/login");
      }
    } else {
      alert("Login required.");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = slotRequests.filter(
      (b) =>
        b.art.title.toLowerCase().includes(term) ||
        b.slot?.slot_name.toLowerCase().includes(term) ||
        b.art.artist_info?.toLowerCase().includes(term)
    );
    setFilteredRequests(filtered);
  }, [searchTerm, slotRequests]);

  return (
    <div className="p-6 bg-white min-h-screen font-[Cinzel]">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-[#e3c27e]">
        <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
          <h2 className="text-2xl font-bold text-black">
            ALL BOOKING REQUESTS
          </h2>
          <input
            type="text"
            placeholder="Search requests..."
            className="border border-[#e3c27e] px-4 py-2 rounded-md w-80 focus:outline-none focus:ring-1 focus:ring-[#e3c27e]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="min-w-[1400px] border-collapse rounded-lg overflow-visible">
            <thead className="bg-[#ffe974] text-black font-[Cinzel]">
              <tr>
                <th className="border border-[#e3c27e] px-4 py-3">DATE</th>
                <th className="border border-[#e3c27e] px-4 py-3">ART</th>
                <th className="border border-[#e3c27e] px-4 py-3">ART TITLE</th>
                <th className="border border-[#e3c27e] px-4 py-3">PRICE</th>
                <th className="border border-[#e3c27e] px-4 py-3">
                  DISCOUNTED PRICE
                </th>
                <th className="border border-[#e3c27e] px-4 py-3">
                  ARTIST INFO
                </th>
                <th className="border border-[#e3c27e] px-4 py-3">SLOT NAME</th>
                <th className="border border-[#e3c27e] px-4 py-3">
                  SLOT DIMENSION
                </th>
                <th className="border border-[#e3c27e] px-4 py-3">
                  AVAILABLE COUNT
                </th>
                <th className="border border-[#e3c27e] px-4 py-3">STATUS</th>
                <th className="border border-[#e3c27e] px-4 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((b, idx) => (
                <tr
                  key={b.id}
                  className={`${
                    idx % 2 === 0 ? "bg-[#fffcea]" : "bg-white"
                  } font-[Lato,sans-serif]`}
                >
                  <td className="border border-[#e3c27e] px-4 py-3">
                    {b.created_at
                      ? format(new Date(b.created_at), "yyyy-MM-dd HH:mm:ss")
                      : "N/A"}
                  </td>
                  <td className="border border-[#e3c27e] px-4 py-3">
                    <a
                      href={b.art.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View File
                    </a>
                  </td>
                  <td className="border border-[#e3c27e] px-4 py-3">
                    {b.art.title}
                  </td>
                  <td className="border border-[#e3c27e] px-4 py-3">
                    {b.art.currency_symbol}
                    {b.art.price}
                  </td>
                  <td className="border border-[#e3c27e] px-4 py-3">
                    {b.art.currency_symbol}
                    {b.art.discounted_price}
                  </td>
                  <td className="border border-[#e3c27e] px-4 py-3">
                    {b.art.artist_info}
                  </td>
                  <td className="border border-[#e3c27e] px-4 py-3">
                    {b.slot?.slot_name}
                  </td>
                  <td className="border border-[#e3c27e] px-4 py-3">
                    {b.slot?.slot_dimension}
                  </td>
                  <td className="border border-[#e3c27e] px-4 py-3">
                    {b.slot?.slot_count}
                  </td>
                  <td
                    className={`border border-[#e3c27e] px-4 py-3 font-bold ${
                      b.request_status === 0
                        ? "text-yellow-600"
                        : b.request_status === 1 || b.request_status === 2
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {b.request_status === 0
                      ? "Pending"
                      : b.request_status === 1
                      ? "Approved by Venue, Pending Admin"
                      : b.request_status === 2
                      ? "Approved by Admin"
                      : b.request_status === 3
                      ? "Rejected by Venue"
                      : b.request_status === 4
                      ? "Rejected by Admin"
                      : "Pending"}
                  </td>
                  <td className="px-4 py-3 border border-[#e3c27e] relative overflow-visible">
                    <button
                      onClick={() => toggleDropdown(b.id)}
                      className="bg-black text-white px-3 py-1 rounded-md flex items-center gap-1"
                    >
                      Actions <ChevronDown size={14} />
                    </button>
                    {openDropdownId === b.id && b.request_status === 0 && (
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
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr className="font-[Lato,sans-serif]">
                  <td
                    colSpan="11"
                    className="text-center text-red-500 py-4 font-semibold"
                  >
                    No booking requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingRequest;
