import React, { useState } from "react";

const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_API_URL}users/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to send reset link.");
      }

      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center text-[#000000]">
          Reset Your Password
        </h2>

        {!sent ? (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-[#e3c27e] rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#ffe974]"
              placeholder="Enter your registered email"
              required
            />
            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-[#ffe974] font-bold text-black text-lg rounded transition shadow-lg transform hover:scale-105"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </>
        ) : (
          <p className="text-center text-green-600 font-medium">
            ✅ Reset link has been sent to your email.
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
