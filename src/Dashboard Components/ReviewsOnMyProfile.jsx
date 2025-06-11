import { useEffect, useState } from "react";
import {
  fetchReviews,
  getArtistDataByUserId,
  fetchVenueByUserId,
} from "../services/ApiService";
import { jwtDecode } from "jwt-decode";
import { FaUserAlt, FaStar } from "react-icons/fa";

const ReviewsOnMyProfile = ({ profileType = "artist" }) => {
  const [reviewList, setReviewList] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [entityData, setEntityData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const userId = decoded.user_id;

    const fetchOwnReviews = async () => {
      try {
        let entityRes, reviewType, reviewTypeId;

        if (profileType === "artist") {
          entityRes = await getArtistDataByUserId(userId);
          reviewType = 1;
          reviewTypeId = entityRes.artist_id;
        } else if (profileType === "venue") {
          entityRes = await fetchVenueByUserId(userId);
          reviewType = 3;
          reviewTypeId = entityRes.venue_id;
        }

        setEntityData(entityRes);

        const reviewRes = await fetchReviews(reviewType, reviewTypeId);
        setReviewList(reviewRes.reviews || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchOwnReviews();
  }, [profileType]);

  useEffect(() => {
    if (reviewList.length > 0) {
      const total = reviewList
        .map((r) => parseInt(r.noOfStar))
        .filter((star) => !isNaN(star))
        .reduce((sum, star) => sum + star, 0);

      const avg = total / reviewList.length;
      setAverageRating(avg.toFixed(1));
    }
  }, [reviewList]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Profile Reviews</h2>
      <div className="text-lg font-semibold mb-4">
        Average Rating:{" "}
        <span className="text-yellow-500">{averageRating || "No rating"}</span>
      </div>

      <div className="flex flex-wrap gap-6">
        {reviewList.length > 0 ? (
          reviewList.map((review) => (
            <div
              key={review.id}
              className="w-72 rounded-lg shadow-md overflow-hidden border border-gray-200 bg-white"
            >
              <div className="p-6">
                {/* Reviewer Info */}
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white">
                    <FaUserAlt className="text-xl" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {review.reviewBy?.firstname +
                        " " +
                        review.reviewBy?.lastname || "User"}
                    </h3>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{review.review}</p>

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

                <div className="text-sm text-gray-500">
                  <span className="text-green-500">
                    Reviewer Role: {review.reviewBy?.role}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 mt-4">No reviews found.</div>
        )}
      </div>
    </div>
  );
};

export default ReviewsOnMyProfile;
