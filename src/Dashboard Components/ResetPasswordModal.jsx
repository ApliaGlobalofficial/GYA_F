import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const ResetPasswordModal = ({ onClose, userRole = "User" }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    setMessage("");
    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !user.id || !token) {
      setMessage("❌ User not logged in.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_API_URL}users/update-password/${
          user.id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            newPassword: newPassword,
            oldPassword: oldPassword,
            confirmPassword: confirmPassword,
          }), // Update only password field
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update password.");
      }

      setMessage("✅ Password updated successfully.");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
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
          {userRole} Password Reset
        </h2>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Old Password"
            className="w-full p-2 border border-[#e3c27e] rounded focus:ring-2 focus:ring-[#ffe974]"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 border border-[#e3c27e] rounded focus:ring-2 focus:ring-[#ffe974]"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full p-2 border border-[#e3c27e] rounded focus:ring-2 focus:ring-[#ffe974]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {message && (
          <p className="mt-4 text-sm text-center text-green-600">{message}</p>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={handleReset}
            className="px-8 py-2 bg-[#ffe974] text-black font-bold rounded hover:scale-105 shadow"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
