import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { MdDelete } from "react-icons/md";
import { fetchArtsByArtId, updateArtById } from "../services/ApiService";
import { showNotification } from "../utilities/Utility"; // ✅ Import notification utility

const EditArtwork = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState({ symbol: "$", currencyKey: "USD" });
  const [initialArtwork, setInitialArtwork] = useState(null);

  const [editedFields, setEditedFields] = useState([]);

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

  // 1. Token decoding and userId setting
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.user_id);
      } catch {
        showNotification({
          title: "Session Expired",
          message: "Please log in again.",
          type: "danger",
        });
        navigate("/login");
      }
    } else {
      showNotification({
        title: "Login Required",
        message: "Please log in to continue.",
        type: "warning",
      });
      navigate("/login");
    }
  }, [navigate]);

  // 2. Currency loading and trigger
  useEffect(() => {
    if (!localStorage.getItem("currency")) {
      window.dispatchEvent(new Event("triggerCountryDropdown")); // ✅ updated
      // navigate("/choose-country");
    } else {
      const currenc = JSON.parse(localStorage.getItem("currency"));
      setCurrency(currenc);
    }
  }, [navigate]);

  useEffect(() => {
    fetchArtsByArtId(id)
      .then((res) => {
        // store initial data for comparison
        if (res.data && res.data.id === parseInt(id)) {
          const art = res.data;
          setArtwork({
            title: art.title || "",
            category: art.category || "Uncategorized",
            price: art.price?.toString() || "",
            discountedPrice: art.discounted_price?.toString() || "",
            tags: art.tags || "",
            artistInfo: art.artist_info || "",
            description: art.art_description || "",
            file: null,
            coverImage: null,
          });
          setInitialArtwork({ ...art });
          if (art.cover_img) setPreviewImage(art.cover_img);
        }
        setLoading(false);
      })
      .catch(() => {
        /* error handling */
      });
  }, [id]);

  // Generic change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setArtwork((prev) => ({ ...prev, [name]: value }));

    // Determine the original key to compare
    const origKey =
      name === "discountedPrice"
        ? "discounted_price"
        : name === "artistInfo"
        ? "artist_info"
        : name === "description"
        ? "art_description"
        : name;

    // Compare with initial value to decide if edited
    if (initialArtwork) {
      const initialValue = initialArtwork[origKey]?.toString() || "";
      if (value !== initialValue && !editedFields.includes(origKey)) {
        setEditedFields((prev) => [...prev, origKey]);
      }
      if (value === initialValue && editedFields.includes(origKey)) {
        setEditedFields((prev) => prev.filter((f) => f !== origKey));
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setArtwork((prev) => ({ ...prev, file }));
    if (!editedFields.includes("file"))
      setEditedFields((prev) => [...prev, "file"]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setArtwork((prev) => ({ ...prev, coverImage: file }));
      if (!editedFields.includes("cover_img"))
        setEditedFields((prev) => [...prev, "cover_img"]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("currency_symbol", currency.symbol);
    formData.append("currency_key", currency.currencyKey);
    formData.append("art_status", 4);

    // Only append fields that were edited
    editedFields.forEach((key) => {
      if (key === "discounted_price") {
        formData.append("discounted_price", artwork.discountedPrice);
      } else if (key === "artist_info") {
        formData.append("artist_info", artwork.artistInfo);
      } else if (key === "art_description") {
        formData.append("art_description", artwork.description);
      } else if (["title", "category", "price", "tags"].includes(key)) {
        formData.append(key, artwork[key]);
      }
    });

    // Always include edited_fields array
    formData.append("edited_fields", JSON.stringify(editedFields));

    if (editedFields.includes("file") && artwork.file) {
      formData.append("file", artwork.file);
    }
    if (editedFields.includes("cover_img") && artwork.coverImage) {
      formData.append("cover_img", artwork.coverImage);
    }
    console.log("Submitting form data:", formData);
    

    try {
      await updateArtById(id, formData);
      showNotification({
        title: "Success",
        message: "Artwork updated successfully!",
        type: "success",
      });
      navigate("/artist-dashboard/artworks");
    } catch {
      showNotification({
        title: "Update Failed",
        message: "Something went wrong. Please try again.",
        type: "danger",
      });
    }
  };

  if (loading) return <div>Loading artwork...</div>;

  return (
    <div className="container mx-auto px-6 py-10 bg-white text-gray-800">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-[#2c3e50] hover:text-[#b8860b] mb-4"
      >
        <ArrowLeft className="mr-2" />
        Back
      </button>

      <h1 className="text-4xl font-[Cinzel] font-bold mb-8">EDIT PRODUCT</h1>

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
                <span className="px-3">{currency.symbol}</span>
                <input
                  type="number"
                  name="price"
                  value={artwork.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-l border-gray-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#2c3e50]">
                Discounted Price
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <span className="px-3">{currency.symbol}</span>
                <input
                  type="number"
                  name="discountedPrice"
                  value={artwork.discountedPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-l border-gray-300"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#2c3e50]">Tags</label>
            <input
              type="text"
              name="Short Description"
              value={artwork.tags}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
            />
          </div>
        </div>

        {/* Right Column - Cover Image Preview */}
        <div className="flex flex-col justify-start items-center border-2 border-dashed border-gray-300 rounded-md p-4 h-full w-full min-h-[200px] relative">
          {previewImage ? (
            <>
              <div className="w-full h-[240px] flex items-center justify-center relative">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded-md shadow-md"
                />
                {/* ✅ Delete Icon Button */}
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage(null);
                    setArtwork({ ...artwork, coverImage: null });
                  }}
                  className="absolute top-2 right-2 text-black hover:text-red-800 rounded-full p-1"
                  title="Remove image"
                >
                  <MdDelete size={20} />
                </button>
              </div>
            </>
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
              />
            </>
          )}
        </div>
      </form>

      {/* Artwork File Upload */}
      <div className="mt-8">
        <label className="block font-semibold text-[#2c3e50] mb-2">
          Change Artwork File
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
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
          Description
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
          className="px-8 py-3 bg-[#ffe974] font-bold text-black text-lg rounded transition shadow-lg transform hover:scale-105 rounded-md"
        >
          UPDATE PRODUCT
        </button>
      </div>
    </div>
  );
};

export default EditArtwork;
