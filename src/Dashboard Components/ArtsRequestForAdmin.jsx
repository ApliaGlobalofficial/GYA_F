import React, { useEffect, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import defaultArt from "../assets/1.jpg";

const ArtsRequestForAdmin = () => {
  const [activeTab, setActiveTab] = useState("uploaded");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingArts, setPendingArts] = useState([]);

  // Modal state for reject reason
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentRejectId, setCurrentRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // Fetch pending arts from server
  const getPendingArts = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_API_URL}art/pending-arts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const json = await res.json();
      console.log("Pending arts fetched:", json);
      
      if (res.ok) {
        setPendingArts(json.data || []);
      } else {
        console.error("Failed fetching:", json);
      }
    } catch (e) {
      console.error("Error fetching pending arts:", e);
    }
  };

  // Approve or reject (with reason) handler
  const handleStatus = async (status, id, reason = "") => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_API_URL}art/${id}/approve-by-admin`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status, reason }),
        }
      );
      if (res.ok) {
        getPendingArts();
      } else {
        console.error("Status update failed:", await res.json());
      }
    } catch (e) {
      console.error("Error updating status:", e);
    }
  };

  useEffect(() => {
    getPendingArts();
  }, []);

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const onRejectClick = (id) => {
    setCurrentRejectId(id);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    handleStatus(2, currentRejectId, rejectReason);
    setShowRejectModal(false);
  };

  // Filter tabs and search
  const uploadedArts = pendingArts.filter((art) => art.art_status === 0);
  const editedArts = pendingArts.filter((art) => art.art_status === 4);
  const displayed = (
    activeTab === "uploaded" ? uploadedArts : editedArts
  ).filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderTable = (data) => (
    <div className="relative bg-white p-6 shadow-lg rounded-lg border border-[#e3c27e]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg min-w-[1200px]">
          <thead className="bg-[#ffe974] sticky top-0">
            <tr className="text-left font-semibold">
              {[
                "Art",
                "Title",
                "Category",
                "Artist",
                "Country",
                "Price",
                "Discounted Price",
                "Status",
                "Actions",
                "Edited Fields",
              ].map((col) => (
                <th key={col} className="border border-[#7a7a7a7a] px-4 py-3">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-4 text-red-600">
                  No Data Found
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr
                  key={item.id}
                  className={idx % 2 === 0 ? "bg-[#fffcea]" : "bg-white"}
                >
                  <td className="px-4 py-3 border border-[#e3c27e]">
                    <a
                      href={item.image || defaultArt}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={item.image || defaultArt}
                        alt="Art"
                        className="w-16 h-16 object-cover rounded-md hover:scale-105 transition-transform cursor-pointer"
                      />
                    </a>
                  </td>
                  <td className="px-4 py-3 border border-[#e3c27e]">
                    {item.title}
                  </td>
                  <td className="px-4 py-3 border border-[#e3c27e]">
                    {item.category}
                  </td>
                  <td className="px-4 py-3 border border-[#e3c27e]">
                    {item.artist}
                  </td>
                  <td className="px-4 py-3 border border-[#e3c27e]">
                    {item.country}
                  </td>
                  <td className="px-4 py-3 border border-[#e3c27e]">
                    ₹ {item.price}
                  </td>
                  <td className="px-4 py-3 border border-[#e3c27e]">
                    ₹ {item.discounted_price}
                  </td>
                  <td className="px-4 py-3 border border-[#e3c27e]">
                    {item.status === 0
                      ? "Pending"
                      : item.status === 2
                      ? "Approved"
                      : "Rejected"}
                  </td>
                  <td className="px-4 py-3 border border-[#e3c27e] relative">
                    <button
                      onClick={() => toggleDropdown(item.id)}
                      className="bg-[#ff7043] text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      Actions <ChevronDown size={14} />
                    </button>
                    {openDropdownId === item.id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-md text-sm z-50">
                        <button
                          onClick={() => handleStatus(1, item.id)}
                          className="block w-full px-4 py-2 bg-green-600 text-white hover:bg-green-700 text-left"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onRejectClick(item.id)}
                          className="block w-full px-4 py-2 bg-red-500 text-white hover:bg-red-600 text-left"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 border border-[#e3c27e]">
                    {(() => {
                      let fields = [];
                      try {
                        const parsed =
                          typeof item.edited_fields === "string"
                            ? JSON.parse(item.edited_fields)
                            : item.edited_fields;
                        if (Array.isArray(parsed)) fields = parsed;
                      } catch (err) {
                        console.log("Error parsing edited fields:", err);
                      }
                      return fields.map((f, i) => (
                        <div
                          key={i}
                          className="lowercase first-letter:uppercase border-b border-red-800"
                        >
                          {f}
                        </div>
                      ));
                    })()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 space-y-4">
            <h3 className="text-xl font-semibold">Reason for Rejection</h3>
            <textarea
              rows={4}
              className="w-full border rounded p-2 focus:outline-none"
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={!rejectReason.trim()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#333]">
        ALL ART REQUESTS
      </h2>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("uploaded")}
            className={`px-6 py-2 rounded ${
              activeTab === "uploaded"
                ? "bg-yellow-400 text-black font-bold"
                : "bg-gray-200"
            }`}
          >
            Uploaded Arts
          </button>
          <button
            onClick={() => setActiveTab("edited")}
            className={`px-6 py-2 rounded ${
              activeTab === "edited"
                ? "bg-yellow-400 text-black font-bold"
                : "bg-gray-200"
            }`}
          >
            Edited Arts
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by title or artist..."
            className="w-full pl-10 pr-4 py-2 border border-[#e3c27e] rounded focus:outline-none focus:ring-1 focus:ring-[#f1c152]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute top-2.5 left-3 text-gray-500" size={18} />
        </div>
      </div>

      {renderTable(displayed)}
    </div>
  );
};

export default ArtsRequestForAdmin;
