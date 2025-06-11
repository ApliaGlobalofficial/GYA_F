import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  createSlotMaster,
  fetchSlots,
  deleteSlotMasterById,
  updateSlotMaster,
} from "../services/ApiService";

const SlotMaster = () => {
  const [slots, setSlots] = useState([]);
  const [formData, setFormData] = useState({ size: "", name: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSlots()
      .then((response) => {
        console.log("response is ", response.data);
        setSlots(response.data);
      })
      .catch((error) => {
        alert("Error in fetching slots", error);
        console.error("Error fetching slots:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!formData.size || !formData.name) return;

    try {
      createSlotMaster(formData)
        .then((res) => {
          const slotObject = {
            id: res.id,
            slot_dimension: res.slot_dimension,
            slot_name: res.slot_name,
          };
          setSlots([...slots, slotObject]);
          setFormData({ size: "", name: "" });
        })
        .catch((error) => {
          alert("Error in adding slot master", error);
        });
    } catch (error) {
      console.error("Failed to add slot:", error);
    }
  };

  const handleDelete = (id) => {
    setSlots(slots.filter((slot) => slot.id !== id));
    deleteSlotMasterById(id)
      .then(() => alert("Slot deleted successfully"))
      .catch((ex) => console.error(ex));
  };

  const handleEdit = (id) => {
    const slotToEdit = slots.find((slot) => slot.id === id);
    setEditIndex(id);
    setFormData({
      size: slotToEdit.slot_dimension,
      name: slotToEdit.slot_name,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleUpdateSlot = (e) => {
    e.preventDefault();
    const updatedSlots = slots.map((slot) =>
      slot.id === editIndex
        ? {
            ...slot,
            slot_dimension: formData.size,
            slot_name: formData.name,
          }
        : slot
    );
    setSlots(updatedSlots);
    setFormData({ size: "", name: "" });
    setIsEditing(false);
    setShowModal(false);
    const slotMasterPayload = {
      slot_name: formData.name,
      slot_dimension: formData.size,
    };
    updateSlotMaster(editIndex, slotMasterPayload)
      .then(() => alert("Slots updated successfully"))
      .catch((ex) => console.error(ex));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-8 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto mb-12 border rounded-xl shadow-lg bg-white overflow-hidden">
      {/* Form */}
      <form
        onSubmit={isEditing ? handleUpdateSlot : handleAddSlot}
        className="bg-white border border-[#e3c27e] p-6 rounded-lg shadow-lg mb-6"
      >
        <h2 className="text-2xl font-bold text-[#000000] mb-4 text-center">
          {isEditing ? "EDIT SLOT" : "ADD NEW SLOT"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="size"
            placeholder="Enter Slot Size"
            value={formData.size}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full"
          />
          <input
            type="text"
            name="name"
            placeholder="Enter Slot Name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="mt-6 w-full bg-black text-[#e3c27e] font-bold py-2 px-4 rounded transition"
        >
          {isEditing ? "Update Slot" : "Add Slot"}
        </button>
      </form>

      {/* Table */}
      <div className="bg-white p-6 shadow-lg border border-[#e3c27e] rounded-lg">
        <h3 className="text-xl font-bold mb-4 text-[#2c3e50]">Slot List</h3>
        {slots.length === 0 ? (
          <p className="text-gray-500 text-center">No slots added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white text-[#2c3e50]">
                  <th className="border border-[#e3c27e] px-6 py-3 text-sm font-bold uppercase">
                    Size
                  </th>
                  <th className="border border-[#e3c27e] px-6 py-3 text-sm font-bold uppercase">
                    Name of Slot
                  </th>
                  <th className="border border-[#e3c27e] px-6 py-3 text-sm font-bold uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr
                    key={slot.id}
                    className="text-[#2c3e50] bg-white hover:bg-[#f9f9f9] transition-colors duration-300"
                  >
                    <td className="border border-[#e3c27e] px-6 py-3">
                      {slot.slot_dimension}
                    </td>
                    <td className="border border-[#e3c27e] px-6 py-3">
                      {slot.slot_name}
                    </td>
                    <td className="border border-[#e3c27e] px-6 py-3">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(slot.id)}
                          className="flex items-center gap-1 px-3 py-1 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(slot.id)}
                          className="flex items-center gap-1 px-3 py-1 rounded-md text-white bg-red-600 hover:bg-red-700 transition"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} as={Fragment}>
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Dialog.Panel className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Edit Slot
            </Dialog.Title>
            <form onSubmit={handleUpdateSlot} className="space-y-4">
              <input
                type="text"
                name="size"
                placeholder="Slot Size"
                value={formData.size}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2 w-full"
              />
              <input
                type="text"
                name="name"
                placeholder="Slot Name"
                value={formData.name}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2 w-full"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 font-[Lato,sans-serif] font-semibold text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#e3c27e] font-[Lato,sans-serif] font-semibold text-black px-4 py-2 rounded hover:bg-[#c8a954]"
                >
                  Save
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
    </div>
  );
};

export default SlotMaster;
