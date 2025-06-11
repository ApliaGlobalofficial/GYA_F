import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import confetti from "canvas-confetti";

const PaymentSuccessModal = ({ isOpen, onClose }) => {
  const confettiFired = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && !confettiFired.current) {
      fireConfetti();
      confettiFired.current = true;
    }
  }, [isOpen]);

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleContinue = () => {
    onClose();
    navigate("/");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center px-4">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.6, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center relative"
      >
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-lg"
          onClick={onClose}
        >
          ✕
        </button>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="text-green-500 mb-5 flex justify-center"
        >
          <FaCheckCircle size={80} />
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-5">
          Your payment has been confirmed. Thank you!
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition"
          onClick={handleContinue}
        >
          Continue Browsing
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessModal;
