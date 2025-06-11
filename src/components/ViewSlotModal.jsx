import React from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import wallPreview from "../assets/noslotfound.jpg";

const ViewSlotModal = ({ isOpen, onClose, slot }) => {
  if (!slot) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-4 shadow-2xl relative">
          {/* X Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-700 hover:text-red-600"
            title="Close"
          >
            <X size={24} />
          </button>

          {/* Left: Static Image */}
          <div className="w-full h-64 md:h-full overflow-hidden rounded-lg">
            <img
            src={
                slot.slot_bg
                  ? (import.meta.env.VITE_SERVER_API_URL + slot.slot_bg).replace(/\\/g, "/")
                  : wallPreview
              }
                            alt="Slot Preview"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: Slot Info */}
          <div className="space-y-3 text-[#2c3e50]">
            <h2 className="text-2xl font-bold">
              {slot.slot_name || "Untitled Slot"}
            </h2>
            <p>
              <strong>Dimensions:</strong> {slot.slot_dimension || "—"}
            </p>
            <p>
              <strong>Price:</strong> {slot.formated_currency || "—"}
            </p>
            <p>
              <strong>Available Slots:</strong> {slot.slot_count}/
              {slot.total_slot_count}
            </p>

            <button
              onClick={() => {
                onClose(); // Optionally replace with your book handler
              }}
              className="mt-4 bg-[#f4511e] text-white px-6 py-2 rounded-full hover:bg-[#e64000] transition"
            >
              Book Now
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ViewSlotModal;
