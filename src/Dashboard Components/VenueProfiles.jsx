import React, { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { FaPhoneAlt, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import { IoChatbubblesSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import ViewSlotModal from "../components/ViewSlotModal";
import Swal from "sweetalert2";
import {
  fetchArtsByVenueId,
  fetchReviews,
  fetchAvailableSlotsByVenueId,
  addReviews,
} from "../services/ApiService";
import ArtsModal from "./ArtsModal";
import { use } from "react";
import {
  createPayloadSchema,
  getCountryNameByUserId,
  convertCurrency,
} from "../utilities/Utility";
import ReviewModal from "../Dashboard Components/ReviewModal";
import { showNotification } from "../utilities/Utility";

const slotImagePaths = [
  // "/src/assets/slotimgs/image1.jpg",
  // "/src/assets/slotimgs/image2.jpg",
  // "/src/assets/slotimgs/slotimage2.jpg",
  // "/src/assets/slotimgs/slotimage3.jpg",
  // "/src/assets/slotimgs/image5.jpg",
  // "/src/assets/slotimgs/image6.jpg",
];
export default function VenueProfiles() {
  const location = useLocation();
  const { venue, routedPayload } = location.state || {};
  const [registeredArts, setRegisteredArts] = useState([]);
  const [sortBy, setSortBy] = useState("0");
  const [searchQuery, setSearchQuery] = useState("");
  const [ogRegisteredArts, setOgRegisteredArts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [modifiedRoutePayload, setModifiedRoutePayload] = useState(null);
  const [userCountries, setUserCountries] = useState({});
  const [currency, setCurrency] = useState({ symbol: "$", currencyKey: "USD" });
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [viewSlot, setViewSlot] = useState(null);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === "") {
      setRegisteredArts(ogRegisteredArts); // Reset to all venues if search is empty
      return;
    }
    const filtered = ogRegisteredArts.filter((art) =>
      art.art?.title.toLowerCase().includes(query)
    );
    setRegisteredArts(filtered);
  };
  useEffect(() => {
    if (!localStorage.getItem("currency")) {
      window.dispatchEvent(new Event("triggerCountryDropdown")); // ✅ updated
      Swal.fire({
        title: "Please select a country",
        text: "You need to select a country to proceed.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    let currenc = JSON.parse(localStorage.getItem("currency"));
    setCurrency(currenc);
    if (venue) {
      console.log("venue details", venue);
      fetchArtsByVenueId(venue.venue_id)
        .then(async (res) => {
          const formattedArts = await Promise.all(
            res.data.map(async (slot) => {
              const formated_currency_art_price = await convertCurrency(
                slot.art.price,
                slot.art.currency_key,
                currenc.currencyKey,
                slot.art.currency_symbol,
                currenc.symbol,
                1
              );

              const formated_currency_art_discount_price =
                await convertCurrency(
                  slot.art.discounted_price,
                  slot.art.currency_key,
                  currenc.currencyKey,
                  slot.art.currency_symbol,
                  currenc.symbol,
                  1
                );

              return {
                ...slot,
                art: {
                  ...slot.art,
                  formated_currency_art_price,
                  formated_currency_art_discount_price,
                },
              };
            })
          );

          setRegisteredArts(formattedArts);
          setOgRegisteredArts(formattedArts);
        })
        .catch((err) => {
          alert("Error fetching data: ", err);
        });

      fetchReviews(3, venue.venue_id)
        .then((res) => {
          console.log("reviews", res.reviews);
          setReviews(res.reviews);
        })
        .catch((err) => {
          alert("Error fetching data: ", err);
        });
    }
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setLoggedInUser(user); // ✅ Set user role based on login

      if (user.role == "Artist") {
        fetchAvailableSlotsByVenueId(venue.venue_id)
          .then(async (res) => {
            const formattedSlots = await Promise.all(
              res.map(async (slot) => {
                const formated_currency = await convertCurrency(
                  slot.slot_price,
                  slot.currency_key,
                  currenc.currencyKey,
                  slot.currency_symbol,
                  currenc.symbol
                );

                return {
                  ...slot,
                  formated_currency,
                };
              })
            );

            setAvailableSlots(formattedSlots);
          })
          .catch((err) => {
            console.log("Error fetching slots data: ", err);
          });
      }
    }
  }, [venue]);

  const handleSortChange = (e) => {
    const sortOption = e.target.value;
    setSortBy(sortOption);

    switch (sortOption) {
      case "1":
        setRegisteredArts(
          registeredArts
            .filter((art) => art.art !== null)
            .sort((a, b) => a.art.price - b.art.price)
        );
        break;
      case "2":
        setRegisteredArts(
          registeredArts
            .filter((art) => art.art !== null)
            .sort((a, b) => b.art.price - a.art.price)
        );
        break;
      default:
        setRegisteredArts(registeredArts.sort((a, b) => a.art.id - b.art.id));
        break;
    }
  };
  const handleCardClick = (service) => {
    console.log("Selected art's details:", service);
    navigate(`/buy-artwork/${service.art.id}`);
  };

  const handleSlotClick = (slot) => {
    console.log("slot clicked", slot);
    if (!routedPayload) {
      alert("Please select a venue before booking a slot.");
      return;
    }
    setModifiedRoutePayload(
      createPayloadSchema(
        routedPayload.artId,
        routedPayload.artDetails,
        routedPayload.venueDetails,
        slot
      )
    );

    setOpen(true);
  };

  useEffect(() => {
    const fetchAllCountries = async () => {
      const countryMap = { ...userCountries };

      await Promise.all(
        registeredArts.map(async (service) => {
          const userId = service?.art.user_id || service.user_id;
          if (userId && !countryMap[userId]) {
            const country = await getCountryNameByUserId(userId);
            countryMap[userId] = country;
          }
        })
      );

      setUserCountries(countryMap);
    };

    if (registeredArts?.length > 0) {
      fetchAllCountries();
    }
  }, [registeredArts]);
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-12 py-8 bg-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto mb-12 border rounded-xl shadow-lg bg-white overflow-hidden">
          {/* Banner */}
          <div className="relative w-full h-[300px] overflow-hidden rounded-t-xl">
            <img
              src={venue?.venue_photo}
              alt="banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center px-10 py-6 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                {/* Logo Circle */}
                <div className="flex-shrink-0">
                  <img
                    src={
                      venue?.location_photo ||
                      "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    alt="venue"
                    className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover"
                  />
                </div>

                {/* Text Info */}
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-bold font-[Cinzel] text-white">
                    {venue?.venue_name}
                  </h2>
                  <p className="flex items-center gap-2 text-sm text-[#f5deb3]">
                    <FaMapMarkerAlt /> {venue?.owner.address}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-[#f5deb3]">
                    <FaPhoneAlt /> {venue?.owner.phone}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-[#f5deb3]">
                    <FaStar className="text-yellow-400" />{" "}
                    {venue?.average_rating
                      ? venue?.average_rating
                      : "No ratings found!"}
                  </p>
                </div>
              </div>

              {/* Right action buttons */}
              <div className="ml-auto space-x-4 hidden sm:flex">
                <button className="bg-[#FFBB33] text-black px-4 py-2 rounded-full hover:bg-[#e3c27e] flex items-center gap-2 shadow-md">
                  <IoChatbubblesSharp /> Chat Now
                </button>
                <a
                  href="#"
                  className="text-white underline flex items-center hover:text-[#e3c27e]"
                >
                  Share <BsInstagram className="ml-1" />
                </a>
              </div>
            </div>
          </div>

          <Tab.Group>
            <Tab.List className="flex justify-center gap-8 border-b py-3 bg-white text-md font-semibold">
              {loggedInUser?.role === "Artist" && (
                <Tab
                  key={3}
                  className={({ selected }) =>
                    selected
                      ? "px-4 py-2 border-b-2 text-[#e57373] border-[#e57373]"
                      : "px-4 py-2 border-b-2 text-gray-500 border-transparent hover:text-[#e57373]"
                  }
                >
                  Slots
                </Tab>
              )}
              {["Artworks", "Reviews", "Venue Description"].map((tab, i) => {
                // Conditionally skip rendering the first tab for "Artist" role
                if (i === 0 && loggedInUser?.role === "Artist") return null;

                return (
                  <Tab
                    key={i}
                    className={({ selected }) =>
                      selected
                        ? "px-4 py-2 border-b-2 text-[#e57373] border-[#e57373]"
                        : "px-4 py-2 border-b-2 text-gray-500 border-transparent hover:text-[#e57373]"
                    }
                  >
                    {tab}
                  </Tab>
                );
              })}
            </Tab.List>

            {loggedInUser?.role === "Artist" && (
              <Tab.Panel className="bg-transparent">
                <div className="bg-white rounded-2xl shadow-md p-6 mx-4 sm:mx-8 md:mx-12 lg:mx-20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="relative bg-[#D9534F] border border-[#FFE6A7] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-transform transform hover:scale-[1.03] flex flex-col items-center text-center"
                          style={{
                            backgroundImage: `url(${
                              slotImagePaths[
                                Math.floor(
                                  Math.random() * slotImagePaths.length
                                )
                              ]
                            })`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            height: "300px",
                            width: "100%",
                            maxWidth: "300px",
                            margin: "0 auto",
                          }}
                        >
                          <div className="bg-white bg-opacity-90 w-full h-full p-4 flex flex-col justify-center rounded-2xl text-[#2c3e50]">
                            <h4 className="text-lg font-bold mb-1">
                              {slot.slot_name}
                            </h4>
                            <p className="text-sm mb-1">
                              Dimensions: {slot.slot_dimension}
                            </p>
                            <p className="text-md font-semibold mb-1">
                              Price: {slot.formated_currency}
                            </p>
                            {/* <p className="text-sm mb-4 text-gray-700">
                              Available Slots:{" "}
                              <span className="font-medium text-[#f4511e]">
                                {slot.slot_count}/{slot.total_slot_count}
                              </span>
                            </p> */}
                            <button
                              onClick={() => handleSlotClick(slot)}
                              className="bg-[#f4511e] text-white px-4 py-2 rounded-full hover:bg-[#e64000] transition-all"
                            >
                              Book Now
                            </button>

                            <button
                              onClick={() => setViewSlot(slot)} // 👈 Set selected slot
                              className="mt-2 bg-[#2c3e50] text-white px-4 py-2 rounded-full hover:bg-[#1a1a1a] transition-all"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 mt-4 col-span-full">
                        No Slots available.
                      </p>
                    )}
                  </div>
                </div>
              </Tab.Panel>
            )}
            <Tab.Panels className="p-6 bg-white">
              {/* Artworks Tab */}
              {(!loggedInUser || loggedInUser?.role !== "Artist") && (
                <Tab.Panel>
                  <div className="flex flex-col md:flex-row justify-between items-center bg-[#FFFDE6] p-4 rounded-lg shadow-md mb-6">
                    <input
                      type="text"
                      placeholder="Search Artworks..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="border border-[#FFD580] px-4 py-2 rounded w-full md:w-2/3 mb-2 md:mb-0 bg-white"
                    />
                    <select
                      className="border border-[#FFD580] px-4 py-2 rounded md:ml-4 w-full md:w-1/3 bg-white"
                      onChange={handleSortChange}
                      value={sortBy}
                    >
                      <option value="0">Default sorting</option>
                      <option value="1">Price: low to high</option>
                      <option value="2">Price: high to low</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {registeredArts
                      .filter((service) => service.art !== null)
                      .map((service, i) => (
                        <div
                          key={i}
                          onClick={() => handleCardClick(service)}
                          className="cursor-pointer bg-[#FAF3DD] border border-[#FFD580] rounded-xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300"
                        >
                          <img
                            src={service.art?.cover_img}
                            alt={service.art?.title}
                            className="h-40 w-full object-cover rounded-md mb-3"
                          />
                          <h4 className="font-semibold text-[#2c3e50] text-md mb-1">
                            {service.art?.title}
                          </h4>
                          <p className="text-[#e3c27e] font-bold text-sm mb-2">
                            {service.art.formated_currency_art_discount_price}
                          </p>
                          <button className="bg-black text-white px-4 py-1 rounded-full text-sm">
                            Add to Cart
                          </button>
                        </div>
                      ))}
                  </div>
                </Tab.Panel>
              )}

              {/* Reviews Tab */}
              <Tab.Panel>
                {/* ✅ Write a Review Button */}
                <div className="text-center mb-6">
                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="bg-[#FFBB33] hover:bg-[#e3c27e] text-black px-6 py-2 rounded-full font-semibold"
                  >
                    Write a Review
                  </button>
                </div>

                {/* ✅ Existing reviews list */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
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
              </Tab.Panel>
              {/* Venue Description Tab */}
              <Tab.Panel>
                <div className="bg-[#FFFDE6] border border-[#FFD580] rounded-2xl shadow-md p-6 space-y-4 text-[#2c3e50]">
                  <h2 className="text-2xl font-bold mb-4 border-b border-[#FFD580] pb-2">
                    {venue.venue_name}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-md">Owner</h4>
                      <p>
                        {venue.owner.firstname + " " + venue.owner.lastname ||
                          "—"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-md">Email</h4>
                      <p>{venue.owner.email || "—"}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-md">Location</h4>
                      <p>{venue.location.display_name || "—"}</p>
                    </div>

                    <div className="col-span-full">
                      <h4 className="font-semibold text-md">Description</h4>
                      <p className="whitespace-pre-line">
                        {venue.venue_desc || "—"}
                      </p>
                    </div>

                    {venue.website && (
                      <div className="col-span-full">
                        <h4 className="font-semibold text-md">Website</h4>
                        <a
                          href={venue.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {venue.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
      {loggedInUser?.role == "Artist" && (
        <ArtsModal
          isOpen={open}
          onClose={() => setOpen(false)}
          routedPayload={modifiedRoutePayload}
        />
      )}
      ;
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        itemName={venue?.venue_name || "Venue"}
        onSubmit={async ({ rating, reviewText }) => {
          try {
            // Here you will call your API to POST the review
            if (!loggedInUser) {
              showNotification({
                title: "Unauthorized Review",
                message: "Please login to add reviews",
                type: "error",
              });
              return;
            }
            // Example pseudo-code to POST review
            // await submitReviewApi({ venueId: venue.venue_id, rating, reviewText, name, email });
            let reviewDetails = {
              review: reviewText,
              reviewBy: loggedInUser.id,
              noOfStar: rating,
              reviewStatus: 1,
              reviewType: 3,
              reviewTypeId: venue.venue_id,
            };
            console.log("Review Data:", reviewDetails);

            const res = await addReviews(reviewDetails);

            showNotification({
              title: "Review Submitted",
              message: "Thanks for your feedback!",
              type: "success",
            });

            setReviewModalOpen(false); // Close modal
          } catch (error) {
            console.error(error);
            showNotification({
              title: "Error",
              message: "Failed to submit review. Try again.",
              type: "danger",
            });
          }
        }}
      />
      <ViewSlotModal
        isOpen={!!viewSlot}
        onClose={() => setViewSlot(null)}
        slot={viewSlot}
      />
    </>
  );
}
