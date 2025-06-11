import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateNews = () => {
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_API_URL}news`);
      setNewsList(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setYoutubeLink("");
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleYoutubeLinkChange = (e) => {
    const link = e.target.value;
    setYoutubeLink(link);
    setVideoFile(null);
    setVideoPreview(link);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!heading || !content) {
      alert("Please fill all fields!");
      return;
    }
    if (videoFile && youtubeLink) {
      alert("Either upload a video or paste a YouTube link, not both!");
      return;
    }

    const formData = new FormData();
    formData.append("heading", heading);
    formData.append("content", content);
    formData.append("is_active", 1);
    if (imageFile) formData.append("image", imageFile);
    if (videoFile) formData.append("video", videoFile);
    else if (youtubeLink) formData.append("youtube_link", youtubeLink);

    try {
      await axios.post(`${import.meta.env.VITE_SERVER_API_URL}news`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("News submitted successfully!");
      setHeading("");
      setContent("");
      setImageFile(null);
      setVideoFile(null);
      setYoutubeLink("");
      setImagePreview(null);
      setVideoPreview(null);
      fetchNews();
    } catch (error) {
      console.error("Error submitting news:", error);
      toast.error("Failed to submit news.");
    }
  };

  const handleDelete = (id) => {
    toast(
      ({ closeToast }) => (
        <div className="text-sm">
          <p className="mb-2 font-medium">
            Are you sure you want to delete this news?
          </p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  await axios.delete(`${import.meta.env.VITE_SERVER_API_URL}news/${id}`);
                  setNewsList((prev) => prev.filter((item) => item.id !== id));
                  toast.dismiss();
                  toast.success("News deleted successfully!");
                } catch (error) {
                  console.error(
                    "Delete failed:",
                    error.response?.data || error.message
                  );
                  toast.dismiss();
                  toast.error("Failed to delete: News not found.");
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => toast.dismiss()}
              className="bg-gray-300 hover:bg-gray-400 text-xs px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false }
    );
  };

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto mt-10 gap-8 px-4">
      {/* Existing News List */}
      <div className="w-full lg:w-1/3">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Existing News
        </h3>
        <div className="space-y-4">
          {newsList.length === 0 ? (
            <div className="text-sm text-gray-500 text-left p-4 border border-dashed border-black rounded-md">
              🚫 No news added yet. Start by posting a new headline on the
              right!
            </div>
          ) : (
            newsList.map((news) => (
              <div
                key={news.id}
                className="flex items-start bg-white border border-gray-300 rounded-md shadow-sm p-3 transition duration-200 hover:bg-[#fffcea]"
              >
                <button
                  onClick={() => handleDelete(news.id)}
                  className="text-red-500 hover:text-red-700 mr-3 mt-1"
                  title="Delete"
                >
                  <MdDelete size={20} />
                </button>
                <div>
                  <h4 className="font-bold text-sm text-gray-800">
                    #{news.id}: {news.heading}
                  </h4>
                  <p className="text-xs text-gray-600 truncate w-44">
                    {news.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Breaking News Form */}
      <div className="w-full lg:w-2/3 bg-[#fffcea] rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Add Breaking News
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Heading
            </label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Enter news heading..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write news content..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="5"
              required
            ></textarea>
          </div>

          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
            <FaCloudUploadAlt size={50} className="text-blue-400 mb-4" />
            <p className="text-gray-600 mb-4">Upload Image</p>
            <label className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded cursor-pointer mb-4">
              Choose Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-64 rounded shadow-md"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
            <FaCloudUploadAlt size={50} className="text-green-400 mb-4" />
            <p className="text-gray-600 mb-2">
              Upload Video or Paste YouTube Link
            </p>

            <label className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded cursor-pointer mb-2">
              Choose Video File
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoChange}
              />
            </label>

            <input
              type="text"
              value={youtubeLink}
              onChange={handleYoutubeLinkChange}
              placeholder="Paste YouTube link here"
              className="w-full p-3 border border-gray-300 rounded-md mt-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {videoPreview && (
              <div className="mt-4">
                {videoFile ? (
                  <video
                    src={videoPreview}
                    controls
                    className="w-64 rounded shadow-md"
                  />
                ) : (
                  <iframe
                    className="w-80 h-44 rounded shadow-md"
                    src={convertToEmbedUrl(videoPreview)}
                    title="YouTube Video Preview"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-md"
            >
              Post News
            </button>
          </div>
        </form>
      </div>

      <ToastContainer
        position="top-left"
        autoClose={false}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
      />
    </div>
  );
};

const convertToEmbedUrl = (url) => {
  if (!url) return "";
  const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
  return `https://www.youtube.com/embed/${videoId}`;
};

export default UpdateNews;
