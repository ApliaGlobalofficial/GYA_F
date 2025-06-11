import React, { useState } from "react";
import ResetPasswordModal from "../Dashboard Components/ResetPasswordModal";
import VenueBanner from "../Dashboard Components/VenueBanner";
import { showNotification } from "../utilities/Utility";

const VenueSettings = () => {
  const [showModal, setShowModal] = useState(false);

  const handlePasswordUpdate = () => {
    setShowModal(false);
    showNotification({
      title: "Password Updated",
      message: "Your password has been updated successfully.",
      type: "success",
    });
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow space-y-10">
      {/* Security Section with golden border */}
      <div className="rounded-2xl border-2 border-[#e3c27e] p-6 shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Security Settings
        </h2>
        <p className="mb-4 text-gray-600">
          Manage your account security. You can reset your password below.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#C8910B] text-white px-6 py-2 rounded shadow hover:bg-[#a67809]"
        >
          Reset Password
        </button>

        {showModal && (
          <ResetPasswordModal onClose={handlePasswordUpdate} userRole="Venue" />
        )}
      </div>

      {/* Venue Banner Section with golden border */}
      <div className="rounded-2xl border-2 border-[#e3c27e] p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Venue Banner Settings
        </h2>
        <VenueBanner />
      </div>
    </div>
  );
};

export default VenueSettings;
