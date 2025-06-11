import { useEffect, useState } from "react";
import axios from "axios";

const News = () => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const baseurl = import.meta.env.VITE_SERVER_API_URL;
    axios
      .get(`${baseurl}news`)
      .then((response) => setNews(response.data))
      .catch((error) => {
        console.error("Error fetching news:", error);
        setError(true);
      });
  }, []);

  const extractYoutubeId = (url) => {
    if (!url) return "";
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : "";
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* PLEASE NOTE Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold uppercase text-center mb-2">
          Please Note:
        </h3>
        <p className="text-center text-gray-600">
          Art sales will be collection only during the initial phase. We may
          introduce delivery options in future based on demand.
        </p>
        <hr className="my-6 border-gray-400" />
      </div>

      {/* News Section */}
      {error && (
        <div className="text-center text-lg text-red-500">
          📢 Failed to load news. Try again later.
        </div>
      )}

      {!error && news.length === 0 && (
        <div className="text-center text-lg text-gray-500 p-4 bg-gray-100 rounded-lg">
          No news available at the moment.
        </div>
      )}

      {!error &&
        news.map((item) => (
          <div key={item.id} className="mb-16">
            {/* News Heading */}
            <h2 className="text-3xl font-bold uppercase text-gray-800 mb-2 text-center">
              {item.heading}
            </h2>

            {/* Author and Date */}
            <p className="text-center text-blue-600 text-sm mb-4">
              By admin /{" "}
              {new Date(item.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            {/* News Content */}
            <p className="text-justify text-gray-700 mb-6 leading-relaxed">
              {item.content}
            </p>

            {/* News Image */}
            {item.image_path && (
              <div className="flex justify-center">
                <img
                  src={item.image_path}
                  alt="News"
                  className="rounded-lg shadow-md w-auto max-w-2xl"
                />
              </div>
            )}

            {/* News Video or YouTube Embed */}
            {item.youtube_link ? (
              <div className="flex justify-center mt-6">
                <iframe
                  src={`https://www.youtube.com/embed/${extractYoutubeId(
                    item.youtube_link
                  )}`}
                  className="rounded-lg shadow-lg w-full max-w-4xl h-[500px]"
                  allowFullScreen
                  title="YouTube Video"
                />
              </div>
            ) : item.video_path ? (
              <div className="flex justify-center mt-6">
                <video
                  controls
                  className="rounded-lg shadow-md w-full max-w-2xl"
                >
                  <source src={item.video_path} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : null}

            <hr className="mt-10 border-gray-300" />
          </div>
        ))}
    </div>
  );
};

export default News;
