import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  mapRoutePayloadToSlotRequest,
  getCurrencySymbolByCountry,
} from "../utilities/Utility";
import { makeSlotRequest, paymentForSlotReq } from "../services/ApiService";
import { showNotification } from "../utilities/Utility"; // ✅ Import showNotification

export default function BookingModal({
  isOpen,
  onClose,
  selectedDate,
  routedPayload,
  loggedInUser,
}) {
  const { artDetails, venueDetails, slotDetails } = routedPayload;

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleBookingConfirmation = async () => {
    let userId = loggedInUser?.id;
    let meta = mapRoutePayloadToSlotRequest(routedPayload, userId);
    console.log("routed payload", routedPayload);
    try {
      let amount =
        Number(import.meta.env.VITE_SERVICE_EXTRAS) +
        Number(slotDetails.slot_price);
      let currency = slotDetails.currency_key;
      let customerEmail = loggedInUser.email;
      let productname = venueDetails.venue_name + " : " + slotDetails.slot_name;
      let slotId = slotDetails.id;
      let userId = loggedInUser.id;
      let currencySymbol = slotDetails.currency_symbol;

      await makeSlotRequest(meta); // Wait for the result
      const res = await paymentForSlotReq({
        amount,
        currency,
        customerEmail,
        productname,
        slotId,
        userId,
        currencySymbol,
        meta,
      });

      // alert("slot registered successfully");
      console.log("res after payment", res);
      window.location.href = res.data.url;
      onClose();
    } catch (ex) {
      console.error("error while registering slot", ex);
      showNotification({
        title: "Payment Error",
        message: ex.message,
        type: "danger",
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg max-w-3xl w-full overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {!selectedDate ? (
              <>
                <div className="bg-red-500 text-white px-6 py-3 flex justify-between items-center">
                  <h2 className="text-lg font-bold"> Warning</h2>
                  <button
                    className="text-white text-2xl font-bold focus:outline-none"
                    onClick={onClose}
                  >
                    ×
                  </button>
                </div>
                <div className="p-6 text-center">
                  <p className="text-gray-700 text-lg">
                    Please select a date to proceed with slot booking.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-[#ffe974] text-black px-6 py-3 flex justify-between items-center border border-black">
                  <h2 className="text-lg font-bold">Booking Summary</h2>
                  <button
                    className="text-black text-2xl font-bold focus:outline-none"
                    onClick={onClose}
                  >
                    ×
                  </button>
                </div>

                <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
                  <section>
                    <h2 className="text-xl font-semibold border-b pb-2 mb-4">
                      Venue Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                      <p>
                        <strong>Venue Name:</strong> {venueDetails.venue_name}
                      </p>
                      <p>
                        <strong>Address:</strong>{" "}
                        {venueDetails.registered_address}
                      </p>
                      <p>
                        <strong>Location:</strong>{" "}
                        {venueDetails?.location?.location},{" "}
                        {venueDetails?.location?.country_name_caps}
                      </p>
                      <p>
                        <strong>Owner:</strong> {venueDetails.owner.firstname} (
                        {venueDetails.owner.email})
                      </p>
                      <p>
                        <strong>Contact:</strong> {venueDetails.owner.phone}
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold border-b pb-2 mb-4">
                      Slot Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                      <p>
                        <strong>Slot Name:</strong> {slotDetails.slot_name}
                      </p>
                      <p>
                        <strong>Slot Dimension:</strong>{" "}
                        {slotDetails.slot_dimension}
                      </p>
                      <p>
                        <strong>Selected Date:</strong>{" "}
                        {new Date(selectedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold border-b pb-2 mb-4">
                      Pricing Summary for Art{" "}
                      <span className="text-green-600">{artDetails.title}</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                      <p>
                        <strong>Art Price:</strong>{" "}
                        {getCurrencySymbolByCountry(
                          venueDetails?.owner.country
                        )}{" "}
                        {artDetails.price}
                      </p>
                      <p>
                        <strong>Discounted Price:</strong>{" "}
                        {getCurrencySymbolByCountry(
                          venueDetails?.owner.country
                        )}{" "}
                        {artDetails.discounted_price}
                      </p>
                      <p>
                        <strong>Slot Price:</strong>{" "}
                        {getCurrencySymbolByCountry(
                          venueDetails?.owner.country
                        )}
                        {slotDetails.slot_price}
                      </p>
                      <p>
                        <strong>Handling Charge:</strong>{" "}
                        {getCurrencySymbolByCountry(
                          venueDetails?.owner.country
                        )}{" "}
                        {import.meta.env.VITE_SERVICE_EXTRAS}
                      </p>
                      <p className="text-lg font-bold text-blue-600">
                        <strong>Payable Price :</strong>{" "}
                        {getCurrencySymbolByCountry(
                          venueDetails?.owner.country
                        )}
                        {Number(import.meta.env.VITE_SERVICE_EXTRAS) +
                          Number(slotDetails.slot_price)}
                      </p>
                    </div>
                  </section>

                  <div className="flex justify-end mt-6">
                    <button
                      className="px-8 py-3 bg-[#ffe974] font-bold text-black text-lg rounded transition shadow-lg transform hover:scale-105"
                      onClick={handleBookingConfirmation}
                    >
                      Confirm Booking
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
