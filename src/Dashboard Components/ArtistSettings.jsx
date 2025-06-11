import React, { useState } from "react";
import ArtistResetModal from "../Dashboard Components/ResetPasswordModal";

const ArtistSettings = () => {
  const [showResetModal, setShowResetModal] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f9f9f9]">
      {/* Sidebar
      <div className="w-64 bg-[#fff] shadow-lg p-4">
        <h2 className="text-xl font-bold mb-6">Settings</h2>
        <ul className="space-y-4">
          <li className="text-black font-medium border-l-4 border-[#ffe974] pl-2">
            Security Settings
          </li>
        </ul>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 p-10">
        <div className="bg-white shadow-md rounded-lg p-6 border border-[#e3c27e]">
          <h3 className="text-lg font-semibold text-black mb-4">
            Security Settings
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Last Login: 2025/04/25 | Your tag(s): OFF
          </p>
          <button
            className="bg-[#ffe974] text-black font-bold px-6 py-2 rounded shadow hover:scale-105 transition"
            onClick={() => setShowResetModal(true)}
          >
            Update Security
          </button>
        </div>
      </div>

      {showResetModal && (
        <ArtistResetModal onClose={() => setShowResetModal(false)} />
      )}
    </div>
  );
};

export default ArtistSettings;
