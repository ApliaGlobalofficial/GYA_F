// src/pages/PaymentSuccess.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Fire confetti once
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 to-white px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-xl p-10 max-w-md w-full text-center"
      >
        <div className="text-green-500 flex justify-center mb-5">
          <FaCheckCircle size={90} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your transaction was completed
          successfully.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition"
        >
          Back to Home
        </button>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
