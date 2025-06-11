import React, { useState } from "react";
import ResetPasswordModal from "../Dashboard Components/ResetPasswordModal"; // Adjust path if needed

const CustomerSettings = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
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
        <ResetPasswordModal
          onClose={() => setShowModal(false)}
          userRole="Customer"
        />
      )}
    </div>
  );
};

export default CustomerSettings;
