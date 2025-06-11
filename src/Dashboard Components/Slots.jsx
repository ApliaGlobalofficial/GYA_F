import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Pencil } from "lucide-react";
import noSlotImage from "../assets/noslotfound.jpg";
import { useEffect } from "react";
import { fetchVenueSlotsByUserId } from "../services/ApiService";
import { getDateInFormat } from "../utilities/Utility";


const Slots = () => {
  const [slots,setSlots] = useState([]);
  const navigate = useNavigate();

  const handleCreateSlot = () => {
    navigate("/venue-dashboard/slots/add-slot");
  };

  const handleEdit = (slotId) => {
    navigate(`/venue-dashboard/slots/edit-slot/${slotId}`);
  };

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const loggedUser = localStorage.getItem("user");
        if (!loggedUser) {
          navigate("/user-signin");
          return;
        }
        const user = JSON.parse(loggedUser);

        const response = await fetchVenueSlotsByUserId(user.id);
        if (response.data && Array.isArray(response.data)) {
          console.log("Fetched slots:", response.data);
          setSlots(response.data);
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };

    fetchSlots();
  }, []);

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-[Cinzel] text-[#000000]">
          ALL SLOTS
        </h2>
        <button
          onClick={handleCreateSlot}
          className="flex items-center px-6 py-3 bg-black text-[#e3c27e] text-lg font-semibold transition duration-300 shadow-lg transform hover:scale-105 rounded-md"
        >
          <PlusCircle className="mr-2" size={20} />
          Add Slot
        </button>
      </div>

      <div className="bg-white p-6 shadow-lg rounded-lg border border-[#e3c27e]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow-md rounded-lg">
            <thead>
              <tr className="bg-[#ffe974] text-[#2c3e50]">
                {[
                  "#",
                  "Title",
                  "Dimensions",
                  "Date",
                  "Price",
                  "Wall Image",
                  "Status",
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
              {slots.length > 0 ? (
                slots.map((slot, index) => (
                  <tr
                    key={slot.id}
                    className={index % 2 === 0 ? "bg-[#fffcea]" : "bg-white"}
                  >
                    <td className="border border-[#e3c27e] px-4 py-3">
                      {index + 1}
                    </td>
                    <td className="border border-[#e3c27e] px-4 py-3 font-semibold">
                      {slot.slot_name}
                    </td>
                    <td className="border border-[#e3c27e] px-4 py-3">
                      {slot.slot_dimension}
                    </td>
                    <td className="border border-[#e3c27e] px-4 py-3">
                      {getDateInFormat(slot.request_on)}
                    </td>
                    <td className="border border-[#e3c27e] px-4 py-3 font-bold">
                      {slot.currency_symbol}
                      {slot.slot_price}
                    </td>
                    <td className="border border-[#e3c27e] px-4 py-3">
                      <a
                        href={slot.slot_bg || noSlotImage}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={slot.slot_bg || noSlotImage}
                          alt="Wall"
                          className="w-16 h-16 object-cover rounded-md"
                          onError={(e) => (e.target.src = noSlotImage)}
                        />
                      </a>
                    </td>
                    <td
                      className={`border border-[#e3c27e] px-4 py-3 font-bold ${
                        slot.venue_slot_status == 0
                          ? "text-red-500"
                          : slot.venue_slot_status == 1
                          ? "text-green-500"
                          : slot.venue_slot_status == 2
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {slot.venue_slot_status == 0
                        ? "Approval Pending from Admin"
                        : slot.venue_slot_status == 1
                        ? "Approved"
                        : slot.venue_slot_status == 2
                        ? "Rejected from Admin"
                        : "Edit Approval Pending"}
                    </td>
                    <td className="border border-[#e3c27e] px-4 py-3">
                      <div className="flex items-center space-x-2 justify-center">
                        <button
                          onClick={() => handleEdit(slot.id)}
                          className="text-blue-500"
                          title="Edit Slot"
                        >
                          <Pencil size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6">
                    <img
                      src={noSlotImage}
                      alt="No Slots"
                      className="w-40 mb-4 mx-auto"
                    />
                    <h2 className="text-2xl font-[Cinzel] font-bold text-[#2c3e50]">
                      NO SLOTS FOUND!
                    </h2>
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

export default Slots;
