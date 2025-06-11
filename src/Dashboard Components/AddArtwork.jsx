import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, ArrowLeft, Edit2 } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { showNotification } from "../utilities/Utility";
import { MdDelete } from "react-icons/md";

const AddArtwork = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [currency, setCurrency] = useState({ symbol: "$", currencyKey: "USD" });
  const [artwork, setArtwork] = useState({
    title: "",
    category: "Uncategorized",
    price: "",
    discountedPrice: "",
    tags: "",
    artistInfo: "",
    description: "",
    file: null,
    coverImage: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.user_id) {
          setUserId(decodedToken.user_id);
        } else {
          showNotification({
            title: "Invalid Token",
            message: "User ID not found. Please login again.",
            type: "danger",
          });
          navigate("/login");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        showNotification({
          title: "Session Expired",
          message: "Please log in again.",
          type: "danger",
        });
        navigate("/login");
      }

      if (!localStorage.getItem("currency")) {
        window.dispatchEvent(new Event("triggerCountryDropdown"));
      }

      const currenc = JSON.parse(localStorage.getItem("currency"));
      setCurrency(currenc);
    } else {
      showNotification({
        title: "Not Logged In",
        message: "Please log in first.",
        type: "warning",
      });
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setArtwork({ ...artwork, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setArtwork({ ...artwork, file });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
      setArtwork({ ...artwork, coverImage: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      showNotification({
        title: "Missing User ID",
        message: "Please log in again.",
        type: "danger",
      });
      return;
    }

    if (!artwork.file || !artwork.coverImage) {
      showNotification({
        title: "Missing Files",
        message: "Both artwork file and cover image are required!",
        type: "warning",
      });
      return;
    }

    if (
      artwork.discountedPrice &&
      parseFloat(artwork.discountedPrice) > parseFloat(artwork.price)
    ) {
      showNotification({
        title: "Invalid Price",
        message: "Discounted price cannot be greater than actual price.",
        type: "warning",
      });
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("title", artwork.title);
    formData.append("category", artwork.category);
    formData.append("price", artwork.price);
    formData.append("discounted_price", artwork.discountedPrice);
    formData.append("tags", artwork.tags);
    formData.append("artist_info", artwork.artistInfo);
    formData.append("art_description", artwork.description);
    formData.append("file", artwork.file);
    formData.append("cover_img", artwork.coverImage);
    formData.append("currency_symbol", currency?.symbol);
    formData.append("currency_key", currency?.currencyKey);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}art`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Upload Success:", response.data);
      showNotification({
        title: "Success",
        message: "Artwork uploaded successfully!",
        type: "success",
      });
      navigate("/artist-dashboard/artworks");
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
      showNotification({
        title: "Upload Failed",
        message: "Something went wrong. Please try again.",
        type: "danger",
      });
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 bg-white text-gray-800">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-[#2c3e50] hover:text-[#b8860b] mb-4"
      >
        <ArrowLeft className="mr-2" />
        Back
      </button>

      <h1 className="text-4xl font-[Cinzel] font-bold mb-8">ADD NEW PRODUCT</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
      >
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-[#2c3e50]">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Product name.."
              value={artwork.title}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-[#2c3e50]">
              Category
            </label>
            <select
              name="category"
              value={artwork.category}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
            >
              <option value="Uncategorized">Uncategorized</option>
              <option value="Acrylic on canvas">Acrylic on canvas</option>
              <option value="Acrylic on paper">Acrylic on paper</option>
              <option value="Oil on canvas">Oil on canvas</option>
              <option value="Water Colour">Water Colour</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#2c3e50]">
                Price{" "}
                {/* <span className="text-sm text-gray-500">(You Earn: £0.00)</span> */}
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <span className="px-3">{currency?.symbol}</span>
                <input
                  type="number"
                  name="price"
                  value={artwork.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-l border-gray-300 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#2c3e50]">
                Discounted Price
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <span className="px-3">{currency?.symbol}</span>
                <input
                  type="number"
                  name="discountedPrice"
                  value={artwork.discountedPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-l border-gray-300 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#2c3e50]">Short Description</label>
            <input
              type="text"
              name="tags"
              placeholder="Select product tags"
              value={artwork.tags}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
            />
          </div>
        </div>

        {/* Right Column - Cover Image Upload with Preview */}
        <div className="flex flex-col justify-start items-center border-2 border-dashed border-gray-300 rounded-md p-4 h-full w-full min-h-[200px]">
          {coverPreview ? (
            <div className="relative w-full h-[300px] flex items-center justify-center">
              <img
                src={coverPreview}
                alt="Preview"
                className="max-w-full max-h-full object-contain rounded-md"
              />
              <button
                type="button"
                onClick={() => {
                  setCoverPreview(null);
                  setArtwork((prev) => ({ ...prev, coverImage: null }));
                }}
                className="absolute top-2 right-2 text-black hover:text-red-800 rounded-full p-1"
                title="Remove image"
              >
                <MdDelete size={20} />
              </button>
            </div>
          ) : (
            <>
              <label className="block font-semibold text-[#2c3e50] mb-2 text-center">
                Upload a product cover image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="cursor-pointer"
                required
              />
            </>
          )}
        </div>
      </form>

      {/* Artwork File Upload */}
      <div className="mt-8">
        <label className="block font-semibold text-[#2c3e50] mb-2">
          Upload Artwork File
        </label>
        <div className="inline-flex items-center border border-gray-300 rounded-md px-2 py-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="text-sm"
            style={{ width: "180px" }}
            required={!artwork.file}
          />
          {artwork.file && (
            <button
              type="button"
              onClick={() => setArtwork((prev) => ({ ...prev, file: null }))}
              className="text-black hover:text-red-800 ml-2"
              title="Remove file"
            >
              <MdDelete size={16} />
            </button>
          )}
        </div>

        {artwork.file && (
          <p className="text-sm text-gray-500 mt-1">
            Selected: {artwork.file.name}
          </p>
        )}
      </div>

      {/* Artist Info */}
      <div className="mt-8">
        <label className="block font-semibold text-[#2c3e50] mb-2">
          Artist Info
        </label>
        <textarea
          name="artistInfo"
          value={artwork.artistInfo}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-md h-32"
        ></textarea>
      </div>

      {/* Description */}
      <div className="mt-6">
        <label className="block font-semibold text-[#2c3e50] mb-2">
          Art Description
        </label>
        <textarea
          name="description"
          value={artwork.description}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-md h-32"
        ></textarea>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-8 py-3 bg-[#ffe974] font-bold text-black text-lg  transition shadow-lg transform hover:scale-105 rounded-md"
        >
          SAVE PRODUCT
        </button>
      </div>
    </div>
  );
};

export default AddArtwork;
