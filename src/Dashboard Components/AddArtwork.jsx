import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { showNotification } from "../utilities/Utility";
import { MdDelete } from "react-icons/md";
import { de } from "date-fns/locale/de";

const AddArtwork = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
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
  });

  const token = localStorage.getItem("token");

  const getArtistInfo = async (userId) => {
    try {
      const data = await axios.get(
        `${import.meta.env.VITE_SERVER_API_URL}artist/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Artist Info:", data.data);
      setUserData(data.data);
    } catch (err) {
      console.error("Error fetching artist info:", err);
      showNotification({
        title: "Error",
        message: "Failed to fetch artist information.",
        type: "danger",
      });
    }
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded Token:", decoded);
        getArtistInfo(decoded.user_id);

        if (decoded.user_id) setUserId(decoded.user_id);
        else throw new Error();
      } catch {
        showNotification({
          title: "Session Expired",
          message: "Please log in again.",
          type: "danger",
        });
        navigate("/login");
      }
      if (!localStorage.getItem("currency"))
        window.dispatchEvent(new Event("triggerCountryDropdown"));
      setCurrency(JSON.parse(localStorage.getItem("currency")));
    } else {
      showNotification({
        title: "Not Logged In",
        message: "Please log in first.",
        type: "warning",
      });
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) =>
    setArtwork({ ...artwork, [e.target.name]: e.target.value });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFilePreview(URL.createObjectURL(file));
      setArtwork((prev) => ({ ...prev, file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId)
      return showNotification({
        title: "Missing User ID",
        message: "Please log in again.",
        type: "danger",
      });
    if (!artwork.file)
      return showNotification({
        title: "Missing File",
        message: "Please upload an artwork file.",
        type: "warning",
      });
    if (
      artwork.discountedPrice &&
      parseFloat(artwork.discountedPrice) > parseFloat(artwork.price)
    ) {
      return showNotification({
        title: "Invalid Price",
        message: "Discounted price cannot exceed actual price.",
        type: "warning",
      });
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
    formData.append("currency_symbol", currency.symbol);
    formData.append("currency_key", currency.currencyKey);

    try {
      await axios.post(`${import.meta.env.VITE_SERVER_API_URL}art`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showNotification({
        title: "Success",
        message: "Artwork uploaded successfully!",
        type: "success",
      });
      navigate("/artist-dashboard/artworks");
    } catch {
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
        <ArrowLeft className="mr-2" /> Back
      </button>
      <h1 className="text-4xl font-[Cinzel] font-bold mb-8">ADD NEW PRODUCT</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-[#2c3e50]">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={artwork.title}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md"
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
                className="w-full border px-4 py-2 rounded-md"
              >
                <option>Uncategorized</option>
                <option>Acrylic on canvas</option>
                <option>Acrylic on paper</option>
                <option>Oil on canvas</option>
                <option>Water Colour</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#2c3e50]">
                  Price
                </label>
                <div className="flex items-center border rounded-md">
                  <span className="px-3">{currency.symbol}</span>
                  <input
                    type="number"
                    name="price"
                    value={artwork.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-l focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-[#2c3e50]">
                  Discounted Price
                </label>
                <div className="flex items-center border rounded-md">
                  <span className="px-3">{currency.symbol}</span>
                  <input
                    type="number"
                    name="discountedPrice"
                    value={artwork.discountedPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-l focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-[#2c3e50]">
                Short Description
              </label>
              <input
                type="text"
                name="tags"
                value={artwork.tags}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md"
              />
            </div>
          </div>
          {/* Single File Upload */}
          <div className="flex flex-col items-center border-2 border-dashed rounded-md p-4 w-full min-h-[200px]">
            {filePreview ? (
              <div className="relative w-full h-[300px] flex items-center justify-center">
                <img
                  src={filePreview}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFilePreview(null);
                    setArtwork((p) => ({ ...p, file: null }));
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full hover:text-red-800"
                  title="Remove image"
                >
                  <MdDelete size={20} />
                </button>
              </div>
            ) : (
              <>
                <label className="block font-semibold text-[#2c3e50] mb-2 text-center">
                  Upload Artwork File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                  required
                />
              </>
            )}
          </div>
        </div>
        {/* Artist Info & Description */}
        <div className="space-y-6">
          <div>
            <label className="block font-semibold text-[#2c3e50] mb-2">
              Artist Info
            </label>
            <textarea
              name="artistInfo"
              value={userData?.about_artist || artwork.artistInfo || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md h-32 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label className="block font-semibold text-[#2c3e50] mb-2">
              Art Description
            </label>
            <textarea
              name="description"
              value={artwork.description}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md h-32"
            />
          </div>
        </div>
        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-[#ffe974] font-bold text-black text-lg shadow-lg hover:scale-105 transition rounded-md"
          >
            SAVE PRODUCT
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddArtwork;
