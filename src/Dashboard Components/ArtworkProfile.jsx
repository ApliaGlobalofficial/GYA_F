import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineShoppingCart, MdChat } from "react-icons/md";

import { useLocation } from "react-router-dom";
import { fetchArtsByArtId,addReviews ,fetchReviews } from "../services/ApiService";
import { Tab } from "@headlessui/react";
import ReviewModal from "../Dashboard Components/ReviewModal";
import { showNotification } from "../utilities/Utility";
import {
  FaStar,
  FaUserAlt,
  FaLinkedin, FaInstagram, FaPinterest 
} from "react-icons/fa";
const ArtworkProfile = () => {
  const location = useLocation();
  const { artwork, artistData } = location.state || {}; // Get artistData from location state
  const artId = location.pathname.split("/").pop(); // Extract artId from URL path
  const [artworkData, setArtworkData] = useState({}); // Initialize artwork state
  const [artistDataProps, setArtistDataProps] = useState({}); // Initialize artistData state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewList, setReviewList] = useState([]); // Store reviews
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {

    const fetchReviewsHelper = async (artId) => {
      try {
        const listOfReviews = await fetchReviews(2, artId);
        console.log("Fetched review data:", listOfReviews);
        setReviewList(listOfReviews?.reviews);
      } catch (error) {
        console.error("Error fetching review data:", error);
      }
    };
    if (artwork === undefined) {
      if (!artId) {
        alert("No artwork found with this ID");
        navigate(-1);
        return;
      }

      fetchArtsByArtId(artId)
        .then((res) => {
          console.log("art data from api ", res.data);
          setArtworkData(res.data);
          setArtistDataProps(res.data.artist_details); // Assuming artist data is in res.data.artist
          fetchReviewsHelper(res.data.id);
        })
        .catch((err) => {
          alert("Error fetching data: ", err);
        });
    } else {
      console.log("art data", artwork);
      console.log("artist data", artistData);
      setArtworkData(artwork);
      setArtistDataProps(artistData); // Assuming artist data is in res.data.artist
    }

   
  }, [artId]);

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
    <div className="min-h-screen bg-white px-4 py-6">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Zoomable Artwork Image */}
        <div className="lg:w-1/2 w-full overflow-hidden rounded-lg shadow-md group relative">
          <img
            src={artworkData.file}
            alt={artworkData.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Artwork Info */}
        <div className="lg:w-1/2 w-full space-y-4">
          <p className="text-sm text-gray-400">{artworkData.category}</p>
          <h1 className="text-2xl font-semibold text-gray-800">
            {artworkData.title}
          </h1>
          <p className="text-xl font-bold">
            {artworkData.currency_symbol}
            {artworkData.discounted_price}
          </p>
          <p className="text-sm text-gray-600">{artworkData.art_description}</p>

          <div>
            <span className="font-semibold">Availability:</span>{" "}
            <span className="text-green-600">1 in stock</span>
          </div>

          {/* <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded font-medium w-full">
            Pay with Link
          </button> */}

          {/* <div className="flex items-center justify-center gap-4 text-gray-500">
            <span className="border-b border-gray-300 w-1/4"></span>
            <span className="text-sm">— OR —</span>
            <span className="border-b border-gray-300 w-1/4"></span>
          </div>

          <div className="flex gap-4">
            <button className="border px-4 py-2 rounded hover:bg-gray-100 text-sm flex items-center gap-1">
              <MdOutlineShoppingCart /> ADD TO CART
            </button>
            <button className="border px-4 py-2 rounded hover:bg-gray-100 text-sm flex items-center gap-1">
              <MdChat /> CHAT NOW
            </button>
          </div> */}

          {/* Artist Info */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-4">
              <img
                src={artistDataProps?.profile_img}
                alt={
                  artistDataProps?.user?.firstname +
                  " " +
                  artistDataProps?.user?.lastname
                }
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">
                  {artistDataProps?.user?.firstname +
                    " " +
                    artistDataProps?.user?.lastname}
                </p>
                <p className="text-xs text-gray-500">
                  {artistDataProps?.rating}
                </p>
              </div>
            </div>
          </div>

          {/* Contact & Info */}
          <div className="pt-6">
            <p className="text-sm text-gray-600">
              <strong>Location:</strong> {artistDataProps?.user?.address}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Contact:</strong> {artistDataProps?.user?.phone}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {artistDataProps?.user?.email}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Status:</strong>{" "}
              {artistDataProps?.user?.is_deleted == 1 ? "Closed" : "Open"}
            </p>
          </div>

          {/* WhatsApp Button */}
          <a
            // href={`https://wa.me/${artistData?.phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition"
          >
            <FaWhatsapp className="text-green-500 text-2xl" />
          </a>
        </div>
      </div>

      {/* Tabs below */}
      <div className="mt-12 border-t pt-6">
        <Tab.Group>
          <Tab.List className="flex justify-center gap-8 border-b py-3 bg-white text-md font-semibold">
            {[
              "Description",
              "Vendor Info",
              // "Shipping",
              "Reviews",
              // "More Products",
            ].map((tab) => (
              <Tab
                key={tab}
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

          <Tab.Panels className="mt-4 text-sm text-gray-700 px-4 text-center">
            <Tab.Panel>{artworkData.art_description}</Tab.Panel>
            
            <Tab.Panel>
                  <div className="bg-[#FFFDE6] border border-[#FFD580] rounded-2xl shadow-md p-6 space-y-4 text-[#2c3e50]">
                    <div className="flex items-center justify-between mb-4 border-b border-[#FFD580] pb-2">
                      <h2 className="text-2xl font-bold">
                        {"Artist Details"}
                      </h2>

                      <div className="flex space-x-4 text-2xl">
                        {artistDataProps.linkedin && (
                          <a
                            href={artistDataProps.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0077b5] hover:scale-110 transition-transform"
                            title="LinkedIn"
                          >
                            <FaLinkedin />
                          </a>
                        )}
                        {artistDataProps.instagram && (
                          <a
                            href={artistDataProps.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#C13584] hover:scale-110 transition-transform"
                            title="Instagram"
                          >
                            <FaInstagram />
                          </a>
                        )}
                        {artistDataProps.pinterest && (
                          <a
                            href={artistDataProps.pinterest}
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
                      <div>
                        <h4 className="font-semibold text-md">Owner</h4>
                        <p>{artistDataProps?.user?.firstname + " " + artistDataProps?.user?.lastname || "—"}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-md">Email</h4>
                        <p>{ artistDataProps?.user?.email || "—"}</p>
                      </div>
                
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="col-span-full">
                        <h4 className="font-semibold text-md">Artist Description</h4>
                        <p className="whitespace-pre-line">
                          {artistDataProps.about_artist || "—"}
                        </p>
                      </div>
  
                      <div className="col-span-full">
                        <h4 className="font-semibold text-md">Art Work</h4>
                        <p className="whitespace-pre-line">
                          {artistDataProps.about_artwork || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
               </Tab.Panel>
            {/* <Tab.Panel>Shipping details go here.</Tab.Panel> */}
            <Tab.Panel>
              {/* Write Review Button */}
              <div className="text-center mb-6">
                <button
                  onClick={() => setReviewModalOpen(true)}
                  className="bg-[#FFBB33] hover:bg-[#e3c27e] text-black px-6 py-2 rounded-full font-semibold"
                >
                  Write a Review
                </button>
              </div>

              {/* Existing Reviews Content */}
              <div className="flex flex-wrap gap-6 justify-center">
  {reviewList?.length > 0 ? (
    reviewList.map((review) => (
      <div
        key={review.id}
        className="w-80 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
      >
        <div className="p-5">
          {/* Reviewer Info */}
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white shadow-sm">
              <FaUserAlt className="text-md" />
            </div>
            <div className="ml-4">
              <h3 className="text-md font-semibold text-gray-800">
                {review.reviewBy?.firstname} {review.reviewBy?.lastname}
              </h3>
              <p className="text-sm text-gray-500">{review.reviewBy.role}</p>
            </div>
          </div>

          {/* Review Text */}
          <p className="text-gray-700 mb-3 text-sm italic leading-relaxed">
            “{review.review}”
          </p>

          {/* Star Rating */}
          <div className="flex items-center mb-2">
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

          {/* Timestamp */}
          <div className="text-xs text-gray-400 text-right">
            {new Date(review.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="col-span-full text-center text-gray-500 mt-4">
      No reviews available.
    </div>
  )}
</div>

            </Tab.Panel>

            {/* <Tab.Panel>More products from this vendor go here.</Tab.Panel> */}
          </Tab.Panels>
        </Tab.Group>

        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          itemName={artworkData.title || "Artwork"}
          onSubmit={async ({ rating, reviewText, name, email }) => {
           try{
                const loggedUser = localStorage.getItem("user");
                const reviewByUser = JSON.parse(loggedUser);


                  if(!reviewByUser){
                    showNotification({
                      title: "Unauthorized Review",
                      message: "Please login to add reviews",
                      type: "error",
                    });
                    return;
                  }

                  if( reviewByUser.id == artistDataProps.user.user_id){
                    showNotification({
                      title: "Unauthorized Review",
                      message: "You can not write a review to your arts",
                      type: "error",
                    });
                    return;
                  }
                  // Example pseudo-code to POST review
                  // await submitReviewApi({ venueId: venue.venue_id, rating, reviewText, name, email });
                  let reviewDetails = {
                    "review":reviewText,
                    "reviewBy": reviewByUser.id,
                    "noOfStar": rating,
                    "reviewStatus": 1,
                    "reviewType": 2,
                    "reviewTypeId": artworkData.id
                  }
                  console.log("Review Data:",reviewDetails);
                  
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
    </div>
  );
};

export default ArtworkProfile;
