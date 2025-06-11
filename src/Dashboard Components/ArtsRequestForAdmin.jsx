import React, { useEffect, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import defaultArt from "../assets/1.jpg"; // ✅ Import your default art image

const ArtsRequestForAdmin = () => {
  const [activeTab, setActiveTab] = useState("uploaded");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingArts, setPendingArts] = useState([]);


 async function getPendingArts() {
    try {
      const data = await fetch(`${import.meta.env.VITE_SERVER_API_URL}art/pending-arts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await data.json();
      if (data.ok) {
      setPendingArts(result?.data || []);
      }
    } catch (error) {
      console.error("Error fetching pending arts:", error);
      // Handle error appropriately, e.g., show a notification or alert
      
    }
  }

  useEffect(() => {
    getPendingArts();
  },[])

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const uploadedArts = pendingArts.filter((art) => art.art_status == 0);
  const editedArts = pendingArts.filter((art) => art.art_status == 4);

  const filteredData = (
    activeTab === "uploaded" ? uploadedArts : editedArts
  ).filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderTable = (data) => (
    <div className="relative z-10 bg-white p-6 shadow-lg rounded-lg border border-[#e3c27e]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-md rounded-lg min-w-[1200px]">
          <thead className="bg-[#ffe974] text-[#000000] sticky top-0 z-10">
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
                <td
                  colSpan={9}
                  className="text-center text-red-600 py-4 font-semibold"
                >
                  No Data Found
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? "bg-[#fffcea]" : "bg-white"}
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
                        className="w-16 h-16 object-cover rounded-md cursor-pointer hover:scale-105 transition-transform"
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
                  <td className="px-4 py-3 border border-[#e3c27e] text-green-700 font-semibold">
                    ₹ {item.price}
                  </td>
                  <td className="px-4 py-3 border border-[#e3c27e] text-blue-600 font-semibold">
                    ₹ {item.discountedPrice}
                  </td>
                  <td className="px-4 py-3 border border-[#e3c27e]">
                    {item.status === 0
                      ? "Pending"
                      : item.status === 2
                      ? "Approved by Admin"
                      : item.status === 4
                      ? "Rejected by Admin"
                      : "Pending"}
                  </td>
                  <td className="px-4 py-3 border border-[#e3c27e] relative z-20">
                    <button
                      onClick={() => toggleDropdown(item.id)}
                      className="bg-[#ff7043] text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      Actions <ChevronDown size={14} />
                    </button>
                    {openDropdownId === item.id && (
                      <div className="absolute z-50 right-0 mt-2 w-36 bg-white border border-gray-300 rounded shadow-md text-sm">
                        <button className="block w-full px-4 py-2 bg-green-600 text-white hover:bg-green-700 text-left">
                          ✅ Approve
                        </button>
                        <button className="block w-full px-4 py-2 bg-red-500 text-white hover:bg-red-600 text-left">
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
    </div>
  );

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-3xl font-bold font-[Cinzel] text-center mb-8 text-[#333]">
        ALL ART REQUESTS
      </h2>

      {/* Top Controls */}
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

      {/* Table */}
      {renderTable(filteredData)}
      {/* {renderTable(pendingArts)} */}
    </div>
  );
};

export default ArtsRequestForAdmin;
