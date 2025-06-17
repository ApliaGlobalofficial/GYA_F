import React, { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaStar,
  FaUserAlt,
  FaLinkedin,
  FaInstagram,
  FaPinterest,
} from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import { IoChatbubblesSharp } from "react-icons/io5";
import { IoIosReturnLeft } from "react-icons/io";

import {
  fetchArtsByUserId,
  fetchReviews,
  getArtistDataByUserId,
  addReviews,
} from "../services/ApiService"; // Import the API service to fetch artist data
import { createPayloadSchema } from "../utilities/Utility"; // Import the utility function for payload creation
import ReviewModal from "../Dashboard Components/ReviewModal";
import { showNotification } from "../utilities/Utility"; // for success toast
import { X } from "lucide-react";
import ArtistBanner from "./ArtistBanner";

export default function ArtistProfiles() {
  const navigate = useNavigate();
  const location = useLocation();
  const { artistData } = location.state || {}; // Get artistData from location state
  const [artworks, setArtworks] = useState([]); // Store fetched artworks
  const [filteredArtWorks, setFilteredArtWorks] = useState([]); // Store filtered artworks
  const [selectedSorting, setSelectedSorting] = useState(1);
  const [reviewList, setReviewList] = useState([]); // Store reviews
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [finalArtistData, setFinalArtistData] = useState([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [selectedArt, setSelectedArt] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  function handleOpenModal(artItem) {
    setSelectedArt(artItem);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setSelectedArt(null);
    setModalOpen(false);
  }
  // const handleProductClick = (product) => {
  //   console.log("Product clicked:", product); // Log the clicked product
  //   navigate(`/artwork-profile/${product.id}`, { state: { artwork: product, artistData: artistData } });
  // };
  const handleSortingChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedSorting(selectedOption);

    switch (parseInt(selectedOption)) {
      case 1:
        setFilteredArtWorks(artworks);
        break;
      case 2:
        setFilteredArtWorks([...artworks].sort((a, b) => a.price - b.price));
        break;
      case 3:
        setFilteredArtWorks([...artworks].sort((a, b) => b.price - a.price));
        break;
      default:
        setFilteredArtWorks(artworks);
    }
  };
  useEffect(() => {
    console.log("Artist data from location state:", artistData);

    const loggedUser = localStorage.getItem("user");

    console.log('logged user', loggedUser);
    

    const fetchReviewsHelper = async (artistId) => {
      try {
        console.log("review data", artistId);
        const listOfReviews = await fetchReviews(1, artistId);
        console.log("Fetched review data:", listOfReviews);
        setReviewList(listOfReviews?.reviews);
      } catch (error) {
        console.error("Error fetching review data:", error);
      }
    };

    const fetchArtistData = async (userId) => {
      try {
        console.log("Fetching artist data for userId:", userId);
        const response = await fetchArtsByUserId(userId);
        console.log("Fetched art data:", response);
        setArtworks(response);
        setFilteredArtWorks(response);
      } catch (error) {
        console.error("Error fetching artist data:", error);
        alert("Error fetching artist data. Please try again later.");
      }
    };

    const initializeData = async () => {
      let userId = null;

      // Case 1: If artistData is not passed via location
      if (!artistData) {
        if (!loggedUser) {
          navigate("/find-artwork");
          return;
        }

        const user = JSON.parse(loggedUser);
        setLoggedInUser(user);

        if (user.role === "Artist") {
          userId = user.id;
          try {
            const res = await getArtistDataByUserId(userId);
            console.log("Artist data from API:", res);
            setFinalArtistData(res);
            await fetchReviewsHelper(res.artist_id);
          } catch (error) {
            console.error("Error fetching artist data by user ID:", error);
            navigate("/find-artwork");
            return;
          }
        }
      }
      // Case 2: If artistData is passed via location
      else {
        console.log("artist data from location", artistData);
        userId = artistData.user?.user_id;
        setFinalArtistData(artistData);
        await fetchReviewsHelper(artistData.artist_id);
      }

      if (!userId) {
        navigate("/find-artwork");
        return;
      }
      await fetchArtistData(userId);
    };

    initializeData();
  }, [artistData, navigate]);

  const handleSearch = (searchTerm) => {
    const filteredArtworks = artworks.filter((artwork) =>
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (searchTerm === "") {
      setFilteredArtWorks(artworks);
    }
    setFilteredArtWorks(filteredArtworks);
  };
  const slotBooking = (product) => {
    let routedPayload = createPayloadSchema(product.id);
    console.log("routedPayload from artist profile", routedPayload);
    navigate(`/shop-art`, { state: { routedPayload: routedPayload } });
  };

  useEffect(() => {
    if (reviewList && reviewList.length > 0) {
      const validStars = reviewList
        .map((review) => parseInt(review.noOfStar))
        .filter((star) => !isNaN(star));

      const total = validStars.reduce((sum, star) => sum + star, 0);
      const average = total / validStars.length;

      setAverageRating(average.toFixed(1)); // rounded to 1 decimal place
    }
  }, [reviewList]);
  return (
    <>
      {/* Floating Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-[150px] left-4 z-50 bg-white shadow-md hover:bg-[#ffe974] text-black px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold transition"
      >
        <IoIosReturnLeft className="text-lg text-bold" />
        Back
      </button>

      <div className="px-4 sm:px-6 lg:px-12 py-8 bg-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto mb-12 border rounded-xl shadow-lg bg-white overflow-hidden">
          {finalArtistData ? (
            <div
              key={finalArtistData?.artist_id}
              className="mb-12 border rounded-xl shadow-lg bg-white overflow-hidden"
            >
              {/* Banner */}
              <div className="relative h-60">
                <img
                  src={finalArtistData?.background_img || "/default-banner.jpg"} // Fallback image if no background image
                  alt="banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex items-center px-8 py-6 text-white">
                  <img
                    src={finalArtistData?.profile_img || "/default-profile.jpg"} // Fallback profile image
                    alt="profile"
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                  <div className="ml-6 space-y-1">
                    <h2 className="text-2xl font-bold font-[Cinzel]">
                      {finalArtistData?.user?.firstname +
                        " " +
                        finalArtistData?.user?.lastname || "Artist Name"}
                    </h2>
                    <div className="flex items-center gap-2 text-sm">
                      <FaMapMarkerAlt />{" "}
                      {finalArtistData?.user?.address || "Not Provided"}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FaPhoneAlt />{" "}
                      {finalArtistData?.user?.phone || "Not Provided"}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FaEnvelope />{" "}
                      {finalArtistData?.user?.email || "Not Provided"}
                    </div>
                    <div className="text-sm mt-1">
                      <FaStar className="inline mr-1 text-yellow-400" />{" "}
                      {averageRating || "No rating"}
                    </div>
                  </div>
                  <div className="ml-auto space-x-3">
                    <button className="bg-[#FFBB33] text-black px-4 py-2 rounded-full hover:bg-[#e3c27e] flex items-center gap-2 shadow-md">
                      <IoChatbubblesSharp /> Chat Now
                    </button>
                    <a
                      href={finalArtistData.instagram}
                      className="text-white underline flex items-center hover:text-[#e3c27e]"
                    >
                      Share <BsInstagram className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tab.Group>
                <Tab.List className="flex justify-center gap-8 border-b py-3 bg-white text-md font-semibold">
                  {["Products", "Reviews", "Vendor Biography","Profile"].map((tab, i) => (
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
                  ))}
                </Tab.List>

                <Tab.Panels className="p-6 bg-white">
                  {/* Products Panel */}
                  <Tab.Panel>
                    <div className="flex flex-col md:flex-row justify-between items-center bg-[#FFFDE6] p-4 rounded-lg shadow-md mb-6">
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="border border-[#FFD580] px-4 py-2 rounded w-full md:w-2/3 mb-2 md:mb-0 bg-white"
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                      <select
                        className="border border-[#FFD580] px-4 py-2 rounded md:ml-4 w-full md:w-1/3 bg-white"
                        value={selectedSorting}
                        onChange={handleSortingChange}
                      >
                        <option value="1">Default sorting</option>
                        <option value="2">Price: low to high</option>
                        <option value="3">Price: high to low</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {filteredArtWorks?.length > 0 ? (
                        filteredArtWorks.map((product, i) => (
                          <div
                            key={i}
                            className="cursor-pointer bg-[#FAF3DD] border border-[#FFD580] rounded-xl p-4 text-center shadow-xl hover:shadow-2xl transition-all duration-300"
                          >
                            <img
                              src={product.cover_img}
                              alt={product.title}
                              className="h-40 w-full object-cover rounded-md mb-3"
                            />
                            <h4 className="mt-1 font-semibold text-[#2c3e50] text-md">
                              {product.title}
                            </h4>
                            <p className="text-[#e3c27e] font-bold text-sm">
                              {product.currency_symbol} {product.price}
                            </p>

                            {loggedInUser?.role === "Artist" ? (
                              product.art_status === 3 ? (
                                <button
                                  className="bg-gray-400 mt-3  text-white px-4 py-1 rounded-full text-sm cursor-not-allowed"
                                  disabled
                                >
                                  Sold Out
                                </button>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <button
                                    onClick={() => slotBooking(product)}
                                    className="mt-3 bg-black text-white px-4 py-1 rounded-full text-sm"
                                  >
                                    Book a Slot
                                  </button>
                                  <button
                                    onClick={() => handleOpenModal(product)}
                                    className="mt-3  text-black px-4 py-1 rounded-full border border-black  text-sm"
                                  >
                                    View
                                  </button>
                                </div>
                              )
                            ) : (
                              <>
                                <button
                                  className="mt-3 bg-gray-300 mx-2 text-gray-700 px-4 py-1 rounded-full text-sm cursor-not-allowed"
                                  disabled
                                >
                                  Notify Artist
                                </button>
                                <a
                                  href={`/artwork-profile/${product.id}`}
                                  className="mt-3 inline-block bg-green-500 text-white px-4 py-1 rounded-full text-sm"
                                >
                                  See More
                                </a>
                              </>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center text-gray-500 mt-4">
                          No products available.
                        </div>
                      )}
                    </div>
                  </Tab.Panel>

                  {/* Reviews Panel */}
                  <Tab.Panel>
                    <div className=" py-2">
                      <div className="max-w-7xl mx-auto p-2">
                        <div className="text-center mb-6">
                          <button
                            onClick={() => setReviewModalOpen(true)}
                            className="bg-[#FFBB33] hover:bg-[#e3c27e] text-black px-6 py-2 rounded-full font-semibold"
                          >
                            Write a Review
                          </button>
                        </div>

                        {/* Review List */}
                        <div className="flex flex-wrap  gap-6">
                          {reviewList?.length > 0 &&
                            reviewList.map((review) => (
                              <div
                                key={review.id}
                                className="w-72  rounded-lg shadow-md overflow-hidden"
                              >
                                <div className="p-6">
                                  {/* Review By */}
                                  <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white">
                                      <FaUserAlt className="text-xl" />
                                    </div>
                                    <div className="ml-4">
                                      <h3 className="text-lg font-semibold text-gray-800">
                                        User #
                                        {review.reviewBy?.firstname +
                                          " " +
                                          review.reviewBy?.lastname}
                                      </h3>
                                    </div>
                                  </div>

                                  {/* Review Text */}
                                  <p className="text-gray-700 mb-4">
                                    {review.review}
                                  </p>

                                  {/* Stars */}
                                  <div className="flex items-center mb-4">
                                    {Array.from({ length: 5 }, (_, index) => (
                                      <FaStar
                                        key={index}
                                        className={`h-5 w-5 ${
                                          index < review.noOfStar
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>

                                  {/* Review Status */}
                                  <div className="text-sm text-gray-500">
                                    <span className="text-green-500">
                                      Reviewer Role: {review.reviewBy.role}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          {reviewList?.length === 0 && (
                            <div className="col-span-full text-center text-gray-500 mt-4">
                              No reviews available.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Tab.Panel>

                  {/* Biography Panel */}
                  <Tab.Panel>
                    <div className="bg-[#FFFDE6] border border-[#FFD580] rounded-2xl shadow-md p-6 space-y-4 text-[#2c3e50]">
                      <div className="flex items-center justify-between mb-4 border-b border-[#FFD580] pb-2">
                        <h2 className="text-2xl font-bold">
                          {finalArtistData?.user?.firstname + "'s Biography"}
                        </h2>
                        <div className="flex space-x-4 text-2xl">
                          {finalArtistData.linkedin && (
                            <a
                              href={finalArtistData.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0077b5] hover:scale-110 transition-transform"
                              title="LinkedIn"
                            >
                              <FaLinkedin />
                            </a>
                          )}
                          {finalArtistData.instagram && (
                            <a
                              href={finalArtistData.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#C13584] hover:scale-110 transition-transform"
                              title="Instagram"
                            >
                              <FaInstagram />
                            </a>
                          )}
                          {finalArtistData.pinterest && (
                            <a
                              href={finalArtistData.pinterest}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#E60023] hover:scale-110 transition-transform"
                              title="Pinterest"
                            >
                              <FaPinterest />
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="col-span-full">
                          <h4 className="font-semibold text-md">
                            Artist Description
                          </h4>
                          <p className="whitespace-pre-line">
                            {finalArtistData.about_artist || "—"}
                          </p>
                        </div>

                        <div className="col-span-full">
                          <h4 className="font-semibold text-md">Art Work</h4>
                          <p className="whitespace-pre-line">
                            {finalArtistData.about_artwork || "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Tab.Panel>
                  {/* Profile panel*/}
                  <Tab.Panel>
                  <ArtistBanner/>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              Loading artist details...
            </div>
          )}

          <ReviewModal
            isOpen={reviewModalOpen}
            onClose={() => setReviewModalOpen(false)}
            itemName={
              finalArtistData?.user?.firstname +
                " " +
                finalArtistData?.user?.lastname || "Artist"
            }
            onSubmit={async ({ rating, reviewText }) => {
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

                if (reviewByUser.id == finalArtistData.user.user_id) {
                  showNotification({
                    title: "Unauthorized Review",
                    message: "You can not write a review to yourself.",
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
                  reviewType: 1,
                  reviewTypeId: finalArtistData.artist_id,
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
        </div>
        {/* Pass selected data into Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data={selectedArt || {}}
        />
      </div>
    </>
  );
}

function Modal({ isOpen, onClose, data }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-200"
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden transform transition-transform duration-200 scale-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Art Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 font-medium">Title</p>
              <p className="mt-1 text-gray-800">{data.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Category</p>
              <p className="mt-1 text-gray-800">{data.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Price</p>
              <p className="mt-1 text-gray-800">
                {data.currency_symbol}{data.price}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Tags</p>
              <p className="mt-1 text-gray-800 flex flex-wrap gap-2">
                {data?.tags}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm text-gray-600 font-medium">Description</p>
            <p className="mt-1 text-gray-800 whitespace-pre-line">
              {data.art_description}
            </p>
          </div>

          {/* Image */}
          {data.cover_img && (
            <div>
              <img
                src={data.cover_img}
                alt={data.title}
                className="w-full max-h-64 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700 focus:outline-none transition-colors duration-150"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
