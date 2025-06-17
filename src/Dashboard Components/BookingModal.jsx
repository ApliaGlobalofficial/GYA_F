import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  mapRoutePayloadToSlotRequest,
  getCurrencySymbolByCountry,
  showNotification, // ✅ Import showNotification
} from "../utilities/Utility";
import { makeSlotRequest, paymentForSlotReq } from "../services/ApiService";

export default function BookingModal({
  isOpen,
  onClose,
  selectedDate:dateRange, 
  routedPayload,
  loggedInUser,
}) {
  const { artDetails, venueDetails, slotDetails } = routedPayload;
console.log("date range in model ", dateRange);

  useEffect(() => {
    // Add event listener for Escape key to close the modal
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    // Cleanup the event listener when the component unmounts or onClose changes
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  /**
   * Handles the booking confirmation process.
   * This includes mapping the payload for the slot request,
   * making the slot request, initiating payment, and redirecting.
   */
  const handleBookingConfirmation = async () => {
    // Check if the user is logged in
    if (!loggedInUser || !loggedInUser.id) {
      showNotification({
        title: "Authentication Error",
        message: "You must be logged in to confirm a booking.",
        type: "danger",
      });
      return;
    }

    // Ensure dateRange is valid before proceeding
    // if (!dateRange || dateRange.length < 2 || !dateRange[0] || !dateRange[1]) {
    if (!dateRange) {
      showNotification({
        title: "Date Selection Error",
        message: "Please select a valid date range to proceed.",
        type: "danger",
      });
      return;
    }

    let userId = loggedInUser?.id;
    // Map the routed payload to the slot request format, including the dateRange
    let meta = mapRoutePayloadToSlotRequest(routedPayload, userId, dateRange); // ✅ Pass dateRange here

    console.log("Routed Payload:", routedPayload); // Log the routed payload for debugging

    try {
      // Calculate the total amount
      let amount =
        Number(import.meta.env.VITE_SERVICE_EXTRAS || 0) + // Use 0 as fallback for env variable
        Number(slotDetails.slot_price || 0);

      // Extract necessary payment details
      let currency = slotDetails.currency_key;
      let customerEmail = loggedInUser.email;
      let productname = venueDetails.venue_name + " : " + slotDetails.slot_name;
      let slotId = slotDetails.id;
      // userId already declared above.
      let currencySymbol = slotDetails.currency_symbol;

      // Make the slot request to the API
      await makeSlotRequest(meta); // Wait for the result of the slot request

      // Initiate the payment process
      const res = await paymentForSlotReq({
        amount,
        currency,
        customerEmail,
        productname,
        slotId,
        userId,
        currencySymbol,
        meta, // Pass the meta object to the payment request
      });

      console.log("Response after payment:", res); // Log the payment response

      // Redirect to the payment URL provided by the API
      if (res?.data?.url) {
        window.location.href = res.data.url;
      } else {
        showNotification({
          title: "Payment Redirection Error",
          message: "No valid payment URL received.",
          type: "danger",
        });
      }

      onClose(); // Close the modal after successful initiation of payment
    } catch (ex) {
      console.error("Error while registering slot or processing payment:", ex);
      // Show an error notification to the user
      showNotification({
        title: "Payment Error",
        message: ex.message || "An unexpected error occurred during booking.",
        type: "danger",
      });
    }
  };

  // Determine if a date range has been selected for conditional rendering
  const isDateRangeSelected =
    // dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1];
    !!dateRange;
  console.log("Date Range Selected:", isDateRangeSelected); // Log the date range selection status
  console.log("Date Range:", dateRange); // Log the actual date range for debugging

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Close modal when clicking outside
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg max-w-3xl w-full overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
          >
            {!isDateRangeSelected ? ( // Conditional rendering based on date selection
              <>
                <div className="bg-red-500 text-white px-6 py-3 flex justify-between items-center">
                  <h2 className="text-lg font-bold">Warning</h2>
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
                  {/* Venue Details Section */}
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

                  {/* Slot Details Section */}
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
                      {/* Displaying the selected date range */}
                      <p>
                        <strong>From Date:</strong>{" "}
                        {new Date(dateRange[0]).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>End Date:</strong>{" "}
                        {new Date(dateRange[1]).toLocaleDateString()}
                      </p>
                    </div>
                  </section>

                  {/* Pricing Summary Section */}
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
                        {Number(import.meta.env.VITE_SERVICE_EXTRAS || 0) +
                          Number(slotDetails.slot_price || 0)}
                      </p>
                    </div>
                  </section>

                  {/* Confirm Booking Button */}
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
