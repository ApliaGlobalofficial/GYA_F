import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const ArtistResetModal = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = () => {
    if (newPassword !== confirmPassword) {
      setMessage("❌ New passwords do not match.");
      return;
    }

    // TODO: Hook up API logic here
    setMessage("✅ Password updated successfully.");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-xl p-6 rounded-xl shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-semibold text-black mb-6">
          Security Settings
        </h2>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Old Password"
            className="w-full p-2 border border-[#e3c27e] rounded focus:outline-none focus:ring-2 focus:ring-[#ffe974]"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 border border-[#e3c27e] rounded focus:outline-none focus:ring-2 focus:ring-[#ffe974]"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full p-2 border border-[#e3c27e] rounded focus:outline-none focus:ring-2 focus:ring-[#ffe974]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {message && (
          <p className="mt-4 text-sm text-center text-green-600">{message}</p>
        )}

        <div className="flex justify-center mt-6">
          <button
            className="bg-[#ffe974] text-black font-bold px-8 py-2 rounded shadow hover:scale-105 transition"
            onClick={handleUpdate}
          >
            Update Security
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistResetModal;
