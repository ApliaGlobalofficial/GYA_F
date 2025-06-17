import React, { useState, useEffect, Fragment } from "react";
import { Tab, Dialog } from "@headlessui/react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
  fetchArtsByArtId,
  addReviews,
  fetchReviews,
} from "../services/ApiService";
import {
  getCurrencySymbolByCountry,
  addTwentyPercentInArtPriceForUser,
  convertCurrency,
} from "../utilities/Utility";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/dashboard.css";
import BookingModal from "./BookingModal";
import ReviewModal from "./ReviewModal";
import { FaStar, FaUserAlt, FaHeart, FaRegHeart } from "react-icons/fa";
//import QRCode from "react-qr-code";

import CheckoutButton from "../components/CheckoutButton";

const BuyArtwork = () => {
  const location = useLocation();
  const artId = location.pathname.split("/").pop(); // Extract artId from URL path
  const { routedPayload } = location.state || {};
  const [artwork, setArtwork] = useState({});
  const [currentUrl, setCurrentUrl] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewList, setReviewList] = useState([]); // Store reviews
  const [artPrice, setArtPrice] = useState(null);
  const [isMountConfirmed, setIsMountConfirmed] = useState(false);
  const [artCurrency, setArtCurrency] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [artCurrencySymbol, setArtCurrencySymbol] = useState(null);
  const [dateRange, setDateRange] = useState(() => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // Set end date to one month after start date
    return [startDate, endDate];
  });

  const [wishlist, setWishlist] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    return stored;
  });
  const navigate = useNavigate();


  const isWishlisted = wishlist.some((item) => item.id === artwork.id);

  const toggleWishlist = () => {
    let updatedWishlist;
    if (isWishlisted) {
      updatedWishlist = wishlist.filter((item) => item.id !== artwork.id);
    } else {
      updatedWishlist = [...wishlist, artwork];
    }
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  // Placeholder for showNotification if it's not passed as a prop or from context
  const showNotification = ({ title, message, type }) => {
    console.log(`Notification - ${type}: ${title} - ${message}`);
    // In a real app, this would trigger a visible notification (e.g., toast, modal)
    // For demonstration, you might display a simple div or use a library like react-toastify
  };

  useEffect(() => {
    if (!artId) {
      showNotification({
        title: "Artwork Not Found",
        message: "No artwork found with this ID.",
        type: "error",
      });
      navigate(-1);
      return;
    }
    if (!localStorage.getItem("currency")) {
      window.dispatchEvent(new Event("triggerCountryDropdown"));
    }

    let currenc = JSON.parse(localStorage.getItem("currency"));
    setCurrentUrl(window.location.href);
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setLoggedInUser(user);
    }
    const user = JSON.parse(loggedUser);
    const multiplier = !user || user.role === "Customer" ? 1 : undefined;

    const fetchReviewsHelper = async (artId) => {
      try {
        const listOfReviews = await fetchReviews(2, artId);
        setReviewList(listOfReviews?.reviews);
      } catch (error) {
        console.error("Error fetching review data:", error);
        showNotification({
          title: "Error",
          message: "Failed to fetch reviews.",
          type: "error",
        });
      }
    };

    fetchArtsByArtId(artId)
      .then(async (res) => {
        const formated_art_price = await convertCurrency(
          res.data.price,
          res.data.currency_key,
          currenc.currencyKey,
          res.data.currency_symbol, // base
          currenc.symbol,
          multiplier
        );
        const formated_art_discounted_price = await convertCurrency(
          res.data.discounted_price,
          res.data.currency_key,
          currenc.currencyKey,
          res.data.currency_symbol,
          currenc.symbol,
          multiplier
        );
        res.data.formated_art_price = formated_art_price;
        res.data.formated_art_discounted_price = formated_art_discounted_price;
        fetchReviewsHelper(res.data.id);

        setArtwork(res.data);

        const [currency, amountStr] = formated_art_discounted_price.split(" ");
        const amount = parseFloat(amountStr);
        setArtPrice(amount);
        setArtCurrencySymbol(currency);

        if (currency == res.data.currency_symbol)
          setArtCurrency(res.data.currency_key);
        else setArtCurrency(currenc.currencyKey);
      })
      .catch((err) => {
        console.error("Error fetching art data: ", err);
        showNotification({
          title: "Error",
          message: "Error fetching artwork data.",
          type: "error",
        });
      });
  }, [artId, navigate]); // Added navigate to dependency array

  const todayStr = new Date().toDateString();

  const handleConfirmClick = () => {
    setShowModal(true); // open modal
  };
  const handleFlyerDownload = async () => {
    const flyerElement = document.getElementById("flyer-capture");

    // Make sure it's off-screen but still rendered
    flyerElement.style.visibility = "visible";

    await new Promise((res) => setTimeout(res, 200));

    html2canvas(flyerElement, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${artwork.title || "flyer"}.pdf`);

      flyerElement.style.visibility = "hidden"; // Re-hide after download
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto bg-white px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Column 1: Artwork Image */}
      <div className="w-full h-[440px] flex items-center justify-center relative bg-gray-50 rounded-md p-4 cursor-pointer">
        <img
          src={artwork.file}
          alt={artwork.title}
          onClick={() => setShowImageModal(true)}
          className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105"
          title="Click to view full image"
        />
      </div>

      {/* Column 2: Artwork and Artist Info */}
      <div className="space-y-6">
        <p className="text-sm text-gray-500">Home / Art / {artwork.title}</p>
        <h2 className="text-3xl font-bold text-gray-800">{artwork.title}</h2>
        <p className="text-2xl font-semibold text-gray-800">
          {artwork.formated_art_discounted_price}
        </p>
        <p className="text-gray-600">{artwork.art_description}</p>

        {loggedInUser &&
        (loggedInUser.role === "Artist" ||
          loggedInUser.role === "Venue") ? null : (
          <>
            {artwork.art_status === 3 ? (
              <button
                className="bg-gray-400 text-white font-semibold px-6 py-2 rounded flex items-center justify-center w-60 cursor-not-allowed"
                disabled
              >
                Sold Out – This artwork is no longer available
              </button>
            ) : loggedInUser ? (
              <>
                <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded flex items-center justify-center space-x-2 w-60">
                  <CheckoutButton
                    amount={artPrice}
                    currency={artCurrency}
                    currencySymbol={artCurrencySymbol}
                    email={loggedInUser.email}
                    productname={artwork.title}
                    artId={artwork.id}
                    userId={loggedInUser.id}
                  />
                </button>
                <div className="mt-2">
                  <button
                    onClick={toggleWishlist}
                    className="flex items-center space-x-2 text-red-500 hover:text-red-600 font-medium"
                  >
                    {isWishlisted ? (
                      <FaHeart size={20} />
                    ) : (
                      <FaRegHeart size={20} />
                    )}
                    <span>
                      {isWishlisted
                        ? "Remove from Wishlist"
                        : "Add to Wishlist"}
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded flex items-center justify-center space-x-2 w-60"
                onClick={() => navigate("/user-signin")}
              >
                Sign in to proceed with payment
              </button>
            )}

            {/* <div className="text-gray-500 text-center">— OR —</div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded w-40">
              Add to cart
            </button> */}
          </>
        )}

        <p className="text-gray-600">
          Category: <span className="text-blue-600">{artwork.category}</span>
        </p>
      </div>

      {/* Column 3: QR and Calendar / Booking */}
      <div className="space-y-6">
        {loggedInUser && loggedInUser.role === "Artist" ? (
          <>
            <h3 className="text-lg ml-[70px] font-semibold">
              Schedule a Slot for Your Artwork
            </h3>

            {/* ✅ Required Mount Art Radio */}
            <div className="flex items-center space-x-3 ml-[70px] mt-3">
              <input
                type="radio"
                id="mount-art"
                checked={isMountConfirmed}
                onChange={() => setIsMountConfirmed(true)}
                className="accent-[#C8910B] scale-110"
              />
              <label htmlFor="mount-art" className="text-gray-800 font-medium">
                I confirm this will be a mounted artwork
              </label>
            </div>

            {/* ✅ Conditional Slot Button */}
            <button
              className={`mt-4 ml-[135px] ${
                isMountConfirmed
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white px-4 py-2 rounded`}
              onClick={handleConfirmClick}
              disabled={!isMountConfirmed}
            >
              Confirm Slot
            </button>

            <div style={containerStyle}>
              <style>{customStyles}</style>
              <Calendar
                onChange={setDateRange} // This now receives an array [startDate, endDate]
                value={dateRange} // The value is also an array [startDate, endDate]
                selectRange={true} // Enable range selection
                minDate={new Date()} // Still prevents selection of past dates
                tileClassName={({ date, view }) => {
                  // Apply 'today' class only to the current day in the month view
                  if (view === "month" && date.toDateString() === todayStr) {
                    return "today";
                  }
                  return null; // No custom class if not today
                }}
              />
              {console.log("Selected Date Range:", dateRange)}
            </div>
          </>
        ) : (
          <>
            <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
              <h3 className="text-lg font-semibold text-center mb-4">
                Product QR Code
              </h3>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?data=${currentUrl}&size=150x150`}
                alt="QR Code"
                className="mx-auto mb-4"
              />
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleFlyerDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Download Flyer
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="col-span-1 lg:col-span-2 mt-12">
        <Tab.Group>
          <Tab.List className="flex justify-center gap-8 border-b py-3 text-md font-semibold">
            {["Description", `Reviews (${reviewList.length})`].map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  selected
                    ? "px-4 py-2 border-b-2 text-[#e57373] border-[#e57373] outline-none"
                    : "px-4 py-2 border-b-2 text-gray-500 border-transparent hover:text-[#e57373] outline-none"
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels>
            {/* Description Panel */}
            <Tab.Panel>
              <p className="text-center text-gray-600 mt-4 px-6">
                {artwork.art_description}
              </p>
            </Tab.Panel>

            <Tab.Panel>
              <div className="text-center text-gray-600 mt-4">
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="my-4 bg-[#FFBB33] hover:bg-[#e3c27e] text-black font-semibold px-6 py-2 rounded-md"
                >
                  Write a Review
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reviewList.length > 0 ? (
                    reviewList.map((review) => (
                      <div
                        key={review.id}
                        className="bg-[#FFFDE6] border border-[#FFD580] rounded-xl p-5 shadow-xl text-center flex flex-col items-center"
                      >
                        <div className="w-12 h-12 bg-[#D9534F] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                          {review.reviewBy?.firstname.charAt(0).toUpperCase()}
                        </div>
                        <h4 className="mt-3 font-semibold text-[#2c3e50]">
                          {review.reviewBy.firstname} {review.reviewBy.lastname}{" "}
                          ({review.reviewBy.role})
                        </h4>
                        <p className="text-sm text-gray-500">
                          {review.reviewBy.country}
                        </p>
                        <div className="flex justify-center mt-2">
                          {Array.from({ length: 5 }, (_, index) => (
                            <FaStar
                              key={index}
                              className={`${
                                index < review.noOfStar
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="mt-2 text-sm text-gray-700">
                          {review.review}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 mt-4 col-span-full">
                      No reviews available.
                    </p>
                  )}
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        {showReviewModal && (
          <ReviewModal
            isOpen={showReviewModal}
            onClose={() => setShowReviewModal(false)}
            onSubmit={async ({ rating, reviewText, name, email }) => {
              try {
                const loggedUser = localStorage.getItem("user");
                const reviewByUser = JSON.parse(loggedUser);

                if (!reviewByUser) {
                  showNotification({
                    title: "Unauthorized Review",
                    message: "Please login to add reviews",
                    type: "error",
                  });
                  return;
                }

                if (reviewByUser.id == artwork.artist_details.artist_id) {
                  showNotification({
                    title: "Unauthorized Review",
                    message: "You cannot write a review for your own art.",
                    type: "error",
                  });
                  return;
                }
                // Example pseudo-code to POST review
                // await submitReviewApi({ venueId: venue.venue_id, rating, reviewText, name, email });
                let reviewDetails = {
                  review: reviewText,
                  reviewBy: reviewByUser.id,
                  noOfStar: rating,
                  reviewStatus: 1,
                  reviewType: 2,
                  reviewTypeId: artwork.id,
                };
                console.log("Review Data:", reviewDetails);

                const res = await addReviews(reviewDetails);

                showNotification({
                  title: "Review Submitted",
                  message: "Thanks for your feedback!",
                  type: "success",
                });

                setShowReviewModal(false); // Corrected this line
              } catch (error) {
                console.error(error);
                showNotification({
                  title: "Error",
                  message: "Failed to submit review. Try again.",
                  type: "danger",
                });
              }
            }}
            itemName={artwork.title || "Artwork"}
          />
        )}
      </div>
      {showModal && (
        <BookingModal
          isOpen={showModal}
          onClose={handleCloseModal}
          // Ensures selectedDate is always an array [startDate, endDate] for BookingModal
          selectedDate={
            Array.isArray(dateRange) ? dateRange : [dateRange, dateRange]
          }
          routedPayload={routedPayload}
          loggedInUser={loggedInUser}
        />
      )}
      <Dialog
        open={showImageModal}
        onClose={() => setShowImageModal(false)}
        as={Fragment}
      >
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-5xl">
            <div className="relative bg-white rounded-lg overflow-hidden">
              <img
                src={artwork.file}
                alt="Full Preview"
                className="w-full h-auto object-contain"
              />
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black px-3 py-1 rounded-full text-xl"
              >
                ✕
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <div
        id="flyer-capture"
        style={{
          visibility: "hidden",
          position: "absolute",
          left: "-9999px",
          top: "0",
        }}
        className="w-[500px] p-6 bg-white text-black border-2 border-dashed border-yellow-500 rounded-xl"
      >
        <img
          crossOrigin="anonymous"
          src={`https://api.qrserver.com/v1/create-qr-code/?data=${currentUrl}&size=150x150`}
          alt="QR Code"
          className="mx-auto mb-4"
        />

        <h2 className="text-2xl font-bold text-center mb-2">{artwork.title}</h2>
        <p className="text-center text-lg mb-2">
          {artCurrencySymbol}
          {artPrice} ({artCurrency})
        </p>
        <p className="text-center text-sm mb-4">{artwork.art_description}</p>
        <p className="text-center text-gray-700 font-medium">
          Artist: {artwork.artist_details?.name || "Unknown"}
        </p>
      </div>
    </div>
  );
};

export default BuyArtwork;

const containerStyle = {
  maxWidth: 500,
  margin: "auto",
  padding: 20,
  fontFamily: "Segoe UI, sans-serif",
};
const customStyles = `
    .react-calendar {
      border: none;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.07);
      background: white;
      padding: 10px;
    }

    .react-calendar__navigation {
      background-color: #001f3f;
      border-radius: 10px 10px 0 0;
      padding: 8px 0;
    }

    .react-calendar__navigation button {
      background: none !important;
      box-shadow: none !important;
      outline: none !important;
      border: none;
      color: white;
      font-weight: 500;
      font-size: 16px;
      transition: none;
    }

    .react-calendar__navigation button:hover,
    .react-calendar__navigation button:focus,
    .react-calendar__navigation button:active {
      background: none !important;
      box-shadow: none !important;
      outline: none !important;
    }

    .react-calendar__month-view__weekdays {
      text-align: center;
      font-weight: 600;
      color: #001f3f;
      text-transform: uppercase;
      font-size: 12px;
      background-color: #f7f9fc;
    }

    .react-calendar__month-view__weekdays__weekday {
      padding: 10px 0;
    }

    .react-calendar__tile {
      border-radius: 8px;
      padding: 12px 0;
      color: #333;
      transition: background-color 0.2s ease;
      font-size: 14px;
    }

    .react-calendar__tile:hover {
      background-color: #f0f8ff;
    }

    .react-calendar__tile--active {
      background-color: #007bff;
      color: white;
      font-weight: bold;
    }

    .today {
      background-color: #e6f7ff !important;
      font-weight: bold;
      color: #007bff;
    }

    .react-calendar__tile:disabled {
      color: #ccc;
      background-color: #f9f9f9;
      cursor: not-allowed;
    }
  `;
