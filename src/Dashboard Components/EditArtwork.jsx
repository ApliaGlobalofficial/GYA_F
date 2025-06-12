import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MdDelete } from "react-icons/md";
import {jwtDecode} from "jwt-decode";
import { fetchArtsByArtId, updateArtById } from "../services/ApiService";
import { showNotification } from "../utilities/Utility";

const EditArtwork = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState({ symbol: "₨", currencyKey: "INR" });
  const [initialArtwork, setInitialArtwork] = useState(null);
  const [editedFields, setEditedFields] = useState([]);
  const [filePreview, setFilePreview] = useState(null);
  // const [coverPreview, setCoverPreview] = useState(null);

  const [artwork, setArtwork] = useState({
    title: "",
    category: "Uncategorized",
    price: "",
    discountedPrice: "",
    tags: "",
    artistInfo: "",
    description: "",
    file: null,
    // cover_img: null,
  });

  // Verify token & set userId
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      showNotification({
        title: "Login Required",
        message: "Please log in.",
        type: "warning",
      });
      return navigate("/login");
    }
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
  }, [navigate]);

  // Load currency or trigger selector
  useEffect(() => {
    const stored = localStorage.getItem("currency");
    if (stored) setCurrency(JSON.parse(stored));
    else window.dispatchEvent(new Event("triggerCountryDropdown"));
  }, []);

  // Fetch existing artwork
  useEffect(() => {
    fetchArtsByArtId(id)
      .then(({ data }) => {
        setInitialArtwork(data);
        setArtwork({
          title: data.title || "",
          category: data.category || "Uncategorized",
          price: data.price?.toString() || "",
          discountedPrice: data.discounted_price?.toString() || "",
          tags: data.tags || "",
          artistInfo: data.artist_info || "",
          description: data.art_description || "",
          file: null,
          // cover_img: null,
        });
        setFilePreview(data.file);
        // setCoverPreview(data.cover_img);
      })
      .catch(() => {
        showNotification({
          title: "Error",
          message: "Failed to load artwork.",
          type: "danger",
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Generic change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setArtwork((prev) => ({ ...prev, [name]: value }));

    if (!initialArtwork) return;
    let origKey = name;
    if (name === "discountedPrice") origKey = "discounted_price";
    if (name === "artistInfo") origKey = "artist_info";
    if (name === "description") origKey = "art_description";
    const initialValue = String(initialArtwork[origKey] ?? "");
    if (value !== initialValue && !editedFields.includes(origKey)) {
      setEditedFields((prev) => [...prev, origKey]);
    }
    if (value === initialValue && editedFields.includes(origKey)) {
      setEditedFields((prev) => prev.filter((f) => f !== origKey));
    }
  };

  // File upload handlers
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArtwork((prev) => ({ ...prev, file }));
      setFilePreview(URL.createObjectURL(file));
      if (!editedFields.includes("file"))
        setEditedFields((prev) => [...prev, "file"]);
    }
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArtwork((prev) => ({ ...prev, cover_img: file }));
      // setCoverPreview(URL.createObjectURL(file));
      if (!editedFields.includes("cover_img"))
        setEditedFields((prev) => [...prev, "cover_img"]);
    }
  };

  // Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId)
      return showNotification({
        title: "Missing User",
        message: "Please log in.",
        type: "danger",
      });

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("currency_symbol", currency.symbol);
    formData.append("currency_key", currency.currencyKey);
    formData.append("art_status", 4);
    formData.append("edited_fields", JSON.stringify(editedFields));

    editedFields.forEach((key) => {
      switch (key) {
        case "title":
        case "category":
        case "price":
        case "tags":
          formData.append(key, artwork[key]);
          break;
        case "discounted_price":
          formData.append("discounted_price", artwork.discountedPrice);
          break;
        case "artist_info":
          formData.append("artist_info", artwork.artistInfo);
          break;
        case "art_description":
          formData.append("art_description", artwork.description);
          break;
        case "file":
          formData.append("file", artwork.file);
          break;
        // case "cover_img":
        //   formData.append("cover_img", artwork.cover_img);
        //   break;
      }
    });

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
        message: "Please try again.",
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
        <ArrowLeft className="mr-2" /> Back
      </button>
      <h1 className="text-4xl font-[Cinzel] font-bold mb-8">EDIT PRODUCT</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/** Title **/}
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

            {/** Category **/}
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

            {/** Price & Discount **/}
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
                    className="w-full px-4 py-2 border-l focus:outline-none rounded-r-md"
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
                    className="w-full px-4 py-2 border-l focus:outline-none rounded-r-md"
                  />
                </div>
              </div>
            </div>

            {/** Tags **/}
            <div>
              <label className="block font-semibold text-[#2c3e50]">Tags</label>
              <input
                type="text"
                name="tags"
                value={artwork.tags}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md"
              />
            </div>
          </div>

          {/* Right Column - Artwork & Cover Uploads */}
          <div className="flex flex-col items-center border-dashed border-2 rounded-md p-4 space-y-4">
            {/* Artwork File */}
            <div className="w-full text-center">
              {filePreview ? (
                <div className="relative">
                  <img
                    src={filePreview}
                    alt="Artwork"
                    className="max-h-60 mx-auto rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFilePreview(null);
                      setArtwork((prev) => ({ ...prev, file: null }));
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full hover:text-red-700 bg-white"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <label className="block font-semibold text-[#2c3e50] mb-2">
                    Change Artwork File
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </>
              )}
            </div>

            {/* Cover Image */}
            {/* <div className="w-full text-center">
              {coverPreview ? (
                <div className="relative">
                  <img
                    src={coverPreview}
                    alt="Cover"
                    className="max-h-60 mx-auto rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverPreview(null);
                      setArtwork((prev) => ({ ...prev, cover_img: null }));
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full hover:text-red-700 bg-white"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <label className="block font-semibold text-[#2c3e50] mb-2">
                    Change Cover Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                  />
                </>
              )}
            </div> */}
          </div>
        </div>

        {/* Artist Info */}
        <div>
          <label className="block font-semibold text-[#2c3e50] mb-2">
            Artist Info
          </label>
          <textarea
            name="artistInfo"
            value={artwork.artistInfo}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md h-32"
          />
        </div>

        {/* Description */}
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

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-[#ffe974] font-bold text-black text-lg rounded-md shadow hover:scale-105 transition"
          >
            UPDATE PRODUCT
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArtwork;
