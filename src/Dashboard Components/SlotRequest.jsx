import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchAllSlotsByUserId, fetchSlots, updateSlotsForVenues , updateSlotsCount} from "../services/ApiService";
import { useNavigate } from "react-router-dom";

const SlotRequest = () => {
  const [mode, setMode] = useState("new");
  const [existingSlots, setExistingSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedSlotDetails, setSelectedSlotDetails] = useState({});
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [additionalQuantity, setAdditionalQuantity] = useState(1);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (!loggedUser) {
      navigate("/user-signin");
      return;
    }
    const user = JSON.parse(loggedUser);
    setLoggedInUser(user);
    fetchExistingSlots(user.id);
  }, []);

  const fetchExistingSlots = async (userId) => {
    try {
      const res = await fetchAllSlotsByUserId(userId);
      setExistingSlots(res);
      fetchSlotsMaster(res);
    } catch (err) {
      console.error("Failed to fetch existing slots:", err);
    }
  };

  const fetchSlotsMaster = async (existingslotList) => {
    try {
      const res = await fetchSlots();
      setFilteredSlots(findNonCommonSlots(res.data, existingslotList));
    } catch (err) {
      console.error("Failed to fetch slot master:", err);
    }
  };

  const findNonCommonSlots = (list1, list2) => {
    const uniqueInList1 = list1.filter(
      (slot1) => !list2.some((slot2) => slot2.slot_name === slot1.slot_name)
    );
    const uniqueInList2 = list2.filter(
      (slot2) => !list1.some((slot1) => slot1.slot_name === slot2.slot_name)
    );
    return [...uniqueInList1, ...uniqueInList2];
  };

  const handleSlotSelection = (slotId, isChecked) => {
    setSelectedSlots((prevSelected) =>
      isChecked ? [...prevSelected, slotId] : prevSelected.filter((id) => id !== slotId)
    );
  };

  const handlePriceChange = (slotId, value) => {
    setSelectedSlotDetails((prev) => ({
      ...prev,
      [slotId]: { ...prev[slotId], price: value },
    }));
  };

  const handleCountChange = (slotId, value) => {
    setSelectedSlotDetails((prev) => ({
      ...prev,
      [slotId]: { ...prev[slotId], count: value },
    }));
  };

  const handleNewSlotSubmit = async () => {
    const payload = [];
    if(selectedSlots.length == 0){
      alert("Please select a slot")
      return;
    } 
    filteredSlots.forEach((slot) => {
      if (selectedSlots.includes(slot.id)) {
        payload.push({
          slot_name: slot.slot_name,
          slot_dimension: slot.slot_dimension,
          slot_price: selectedSlotDetails[slot.id]?.price || 0,
          slot_count: selectedSlotDetails[slot.id]?.count || 1,
          total_slot_count: selectedSlotDetails[slot.id]?.count || 1,
        });
      }
    });

    try {
      await updateSlotsForVenues(payload, loggedInUser);
      alert("New slots submitted successfully.");
      setSelectedSlots([]);
      setSelectedSlotDetails({});
    } catch (error) {
      console.error("Failed to submit new slots:", error);
    }
  };

  const handleExistingSlotSubmit = async () => {
    if (!selectedSlotId || !additionalQuantity) return;

    try {
      await updateSlotsCount(selectedSlotId,additionalQuantity);
      alert("Slot count updated successfully.");
      setSelectedSlotId("");
      setAdditionalQuantity(1);
    } catch (err) {
      console.error("Failed to update slot count:", err);
      alert("Error updating slot count.");
    }
  };

  return (
    <div className="p-6 bg-[#ffffff] min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-[#e3c27e] max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center font-[Cinzel,sans-serif]">
          Request New or Extra Slot
        </h2>

        <div className="flex space-x-4 mb-8 justify-center">
          <button
            onClick={() => setMode("new")}
            className={`px-4 py-2 rounded-full border-2 font-[Lato,sans-serif] ${
              mode === "new"
                ? "bg-[#ffe974] border-[#e3c27e] text-black font-bold"
                : "bg-white border-gray-300 text-gray-700"
            }`}
          >
            New Slot
          </button>
          <button
            onClick={() => setMode("existing")}
            className={`px-4 py-2 rounded-full border-2 font-[Lato,sans-serif] ${
              mode === "existing"
                ? "bg-[#ffe974] border-[#e3c27e] text-black font-bold"
                : "bg-white border-gray-300 text-gray-700"
            }`}
          >
            Extra Quantity
          </button>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          {mode === "new" ? (
            <div>
              {filteredSlots.length > 0 ? (
                filteredSlots.map((slot) => (
                  <div key={slot.id} className="mb-6 p-4 border-b-2 border-gray-300">
                    <div className="font-bold text-xl mb-2">{slot.slot_name}</div>

                    <div className="mb-4">
                      <label className="block font-semibold mb-2">Price</label>
                      <input
                        type="number"
                        min="0"
                        value={selectedSlotDetails[slot.id]?.price || ""}
                        onChange={(e) => handlePriceChange(slot.id, e.target.value)}
                        className="border border-[#e3c27e] rounded p-2 w-full"
                        placeholder="e.g., 3000"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block font-semibold mb-2">Slot Count</label>
                      <input
                        type="number"
                        min="1"
                        value={selectedSlotDetails[slot.id]?.count || ""}
                        onChange={(e) => handleCountChange(slot.id, e.target.value)}
                        className="border border-[#e3c27e] rounded p-2 w-full"
                      />
                    </div>

                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        onChange={(e) => handleSlotSelection(slot.id, e.target.checked)}
                        className="mr-2"
                      />
                      <span>Select this slot</span>
                    </label>
                  </div>
                ))
              ) : (
                <p>No slots available for addition.</p>
              )}
            {  filteredSlots.length > 0 &&
              <button
                type="button"
                onClick={handleNewSlotSubmit}
                className="w-full bg-black text-white font-bold py-2 rounded hover:bg-gray-800 transition mt-4"
              >
                Submit New Slots
              </button>
            }
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <label className="block font-bold mb-2">Select Existing Slot</label>
                <select
                  value={selectedSlotId}
                  onChange={(e) => setSelectedSlotId(e.target.value)}
                  className="border border-[#e3c27e] rounded p-2 w-full"
                >
                  <option value="">Select a Slot</option>
                  {existingSlots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.slot_name} ({slot.slot_dimension})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block font-bold mb-2">Additional Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={additionalQuantity}
                  onChange={(e) => setAdditionalQuantity(Number(e.target.value))}
                  className="border border-[#e3c27e] rounded p-2 w-full"
                />
              </div>
              {existingSlots.length > 0 && 
              <button
                type="button"
                onClick={handleExistingSlotSubmit}
                className="w-full bg-black text-white font-bold py-2 rounded hover:bg-gray-800 transition mt-4"
              >
                Update Slot Count
              </button>
            }
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SlotRequest;
