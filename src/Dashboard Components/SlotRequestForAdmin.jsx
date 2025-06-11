import React, { useState, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { fetchAllAddedSlotsForAdmin , updateStatus} from "../services/ApiService";
import { showNotification } from "../utilities/Utility"; // ✅ Import showNotification
import { set } from "date-fns";
import { getDateInFormat } from "../utilities/Utility";

const SlotRequestForAdmin = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const [addSlotsData, setAddSlotsData] = useState([]);
  const [addSlotsTotal, setAddSlotsTotal] = useState(0);
  const [editSlotsData, setEditSlotsData] = useState([]);
  const [ogAddSlotsData, setOgAddSlotsData] = useState([]);
  const [ogEditSlotsData, setogEditSlotsData] = useState([]);

  const fetchAllAddedSlots = async (page, limit,status) => {
    try {
      const res = await fetchAllAddedSlotsForAdmin(page, limit,status);
      if(status == 1){
              console.log("Fetched edited slots:", res);
      setogEditSlotsData(res.data);
      setEditSlotsData(res.data);
      }else{
              console.log("Fetched added slots:", res);
      setOgAddSlotsData(res.data);
      setAddSlotsData(res.data);
      }
     setAddSlotsTotal(res.total);

    } catch (err) {
      console.error("Error fetching added slots:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "add") {
      fetchAllAddedSlots(page, limit,0);
    }else if(activeTab === "edited"){
      fetchAllAddedSlots(page, limit,1);
    }
    }, [activeTab, page, limit]); 

    useEffect(() => {
      if (activeTab == "add" && searchTerm !="") {
        const filteredData = addSlotsData.filter(
          (item) =>
            item.venue?.venue_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.venue?.location?.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        console.log("Filtered add slots data:", filteredData);
        setAddSlotsData(filteredData);
      } else if (activeTab == "edited" && searchTerm !="") {
        const filteredData = editSlotsData.filter(
          (item) =>
            item.venue.venue_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.venue.location.display_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setEditSlotsData(filteredData);
      } else{
        setAddSlotsData(ogAddSlotsData);
        setEditSlotsData(ogEditSlotsData);
      }
    }, [searchTerm]);

  const toggleDropdown = async (id,status) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };
  const  handleStatus = async (id,status) => {
    console.log("Status ID:", id);
    try{
    await updateStatus(id,status);
     showNotification({
            title: "Status Updated",
            message: "Slot status updated successfully.",
            type: "success",
          });
    }catch(err){
      console.error("Error updating status:", err);
      showNotification({
            title: "Status Error",
            message: err.message,
            type: "danger",
          });
    }
    setOpenDropdownId(null);
       
  }

  const totalPages = Math.ceil(addSlotsTotal / limit);

  const renderTable = (data) => (
    <div className="bg-white p-6 shadow-lg rounded-lg border border-[#e3c27e]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-md rounded-lg min-w-[1400px]">
          <thead className="bg-[#ffe974] text-[#000000] sticky top-0 z-10">
            <tr className="text-left font-semibold">
              {[
                "Date",
                "Venue Name",
                "Location",
                "Slot",
                "Price",
                "Status",
                "Actions",
                "Wall Image",
                "Dimension",

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
                  colSpan={12}
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
                  <td className="px-4 py-3 border border-[#e3c27e]">{getDateInFormat(item.request_on)}</td>
                  <td className="px-4 py-3 border border-[#e3c27e]">{item.venue.venue_name}</td>
                  <td className="px-4 py-3 border border-[#e3c27e]">{item?.venue?.location?.display_name}</td>
                  <td className="px-4 py-3 border border-[#e3c27e]">{item.slot_name}</td>
                  <td className="px-4 py-3 border border-[#e3c27e] text-green-600">₹ {item.slot_price}</td>
                  <td className="px-4 py-3 border border-[#e3c27e]">
                    {item.venue_slot_status === 0
                      ? "Pending"
                      : item.venue_slot_status === 1
                      ? "Approved by Admin"
                      : item.status === 2
                      ? "Rejected by Admin"
                      : "Pending"}
                  </td>
                  <td className="px-4 py-3 border border-[#e3c27e] relative">
                    <button
                      onClick={() => toggleDropdown(item.id)}
                      className="bg-[#f4511e] text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      Actions <ChevronDown size={14} />
                    </button>
                    {openDropdownId === item.id && (
                      <div className="absolute z-50 right-0 mt-2 w-36 bg-white border border-gray-300 rounded shadow-md text-sm">
                        <button onClick={() => {handleStatus(item.id,1)}} className="block w-full px-4 py-2 bg-green-600 text-white hover:bg-green-700 text-left">✅ Approve</button>
                        <button onClick={() => {handleStatus(item.id,2)}} className="block w-full px-4 py-2 bg-red-500 text-white hover:bg-red-600 text-left">❌ Reject</button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 border border-[#e3c27e]">
                    <img src={item.slot_bg} alt="Artwork" className="w-16 h-16 object-cover rounded-md" />
                  </td>
                  <td className="px-4 py-3 border border-[#e3c27e]">{item.slot_dimension}</td>
                
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
        ALL SLOT REQUESTS
      </h2>

      {/* Tabs and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("add")}
            className={`px-6 py-2 rounded ${
              activeTab === "add" ? "bg-yellow-400 text-black font-bold" : "bg-gray-200"
            }`}
          >
            Add Slot Requests
          </button>
          <button
            onClick={() => setActiveTab("edited")}
            className={`px-6 py-2 rounded ${
              activeTab === "edited" ? "bg-yellow-400 text-black font-bold" : "bg-gray-200"
            }`}
          >
            Edited Slot Requests
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by venue or location..."
            className="w-full pl-10 pr-4 py-2 border border-[#e3c27e] rounded focus:outline-none focus:ring-1 focus:ring-[#f1c152]"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
          <Search className="absolute top-2.5 left-3 text-gray-500" size={18} />
        </div>
      </div>

      {/* Table */}
      {activeTab === "add" ? renderTable(addSlotsData) : renderTable(editSlotsData)}

      {/* Pagination */}
      {activeTab === "add" && addSlotsTotal > 0 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="font-semibold">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SlotRequestForAdmin;
