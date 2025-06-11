import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { MdDelete } from "react-icons/md";
import { showNotification } from "../utilities/Utility";
import { venueslotRegister, fetchVenueByUserId } from "../services/ApiService";
const AddSlots = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [customCategory, setCustomCategory] = useState(""); // ✅ New state for custom input
  const [currency, setCurrency] = useState({ symbol: "₹", currencyKey: "INR" });

  const [slot, setSlot] = useState({
    title: "",
    category: "30x40",
    price: "",
    file: null,
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

        const currencyData = JSON.parse(localStorage.getItem("currency"));
        if (currencyData) setCurrency(currencyData);
        else {
          window.dispatchEvent(new Event("triggerCountryDropdown"));
        }

        //else navigate("/choose-country");
      } catch (error) {
        showNotification({
          title: "Session Expired",
          message: "Please log in again.",
          type: "danger",
        });
        navigate("/login");
      }
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
    setSlot({ ...slot, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory =
      slot.category === "Custom" ? customCategory.trim() : slot.category;

    if (!userId) {
      showNotification({
        title: "Missing User ID",
        message: "Please log in again.",
        type: "danger",
      });
      return;
    }

    if (!slot.file) {
      showNotification({
        title: "Missing File",
        message: "Please upload a file for the slot.",
        type: "warning",
      });
      return;
    }

    if (slot.category === "Custom" && !customCategory.trim()) {
      showNotification({
        title: "Missing Custom Dimension",
        message: "Please enter your custom dimensions.",
        type: "warning",
      });
      return;
    }

    // Submit object
    const slotToSubmit = {
      ...slot,
      category: finalCategory,
    };
   
    console.log("Slot ready to be submitted:", slotToSubmit);
    if (!localStorage.getItem("currency")) {
      window.dispatchEvent(new Event("triggerCountryDropdown"));
    }

    const currenc = JSON.parse(localStorage.getItem("currency"));

    const venueData = await  fetchVenueByUserId(userId);
    const slotPayload ={
      venue : venueData.venue_id,
      slot_name: slotToSubmit.title,
      slot_dimension: slotToSubmit.category,
      slot_price: slotToSubmit.price,
      slot_bg: slotToSubmit.file,
      currency_key: currenc.currencyKey,
      currency_symbol: currenc.symbol,
      user_id: userId,
    };
    console.log("Slot Payload:", slotPayload);
    venueslotRegister(slotPayload).then((response) => {
    
        showNotification({
          title: "Success",
          message: "Slot saved successfully.",
          type: "success",
        });
        navigate("/venue-dashboard/slots"); 

    }).catch((error) => {
      console.error("Error saving slot:", error);
      showNotification({
        title: "Error",
        message: "Failed to save slot.",
        type: "danger",
      });
    });


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

      <h1 className="text-4xl font-[Cinzel] font-bold mb-8">ADD NEW SLOT</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
      >
        {/* Title */}
        <div>
          <label className="block font-semibold text-[#2c3e50]">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter slot title..."
            value={slot.title}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
            required
          />
        </div>

        {/* Category with Custom Option */}
        <div>
          <label className="block font-semibold text-[#2c3e50]">
            Dimensions
          </label>
          <select
            name="category"
            value={slot.category}
            onChange={(e) => {
              setSlot({ ...slot, category: e.target.value });
              if (e.target.value !== "Custom") {
                setCustomCategory(""); // Clear custom if not selected
              }
            }}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          >
            <option value="Custom">Custom</option>
            <option value="30x40">30x40</option>
            <option value="40x60">40x60</option>
            <option value="50x50">50x50</option>
            <option value="70x30">70x30</option>
            <option value="60x30">60x30</option>
          </select>

          {slot.category === "Custom" && (
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter custom dimensions (e.g. 65x45)"
              className="mt-2 w-full border border-gray-300 px-4 py-2 rounded-md text-black font-semibold"
            />
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block font-semibold text-[#2c3e50]">Price</label>
          <div className="flex items-center border border-gray-300 rounded-md">
            <span className="px-3">{currency.symbol}</span>
            <input
              type="number"
              name="price"
              value={slot.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border-l border-gray-300 focus:outline-none"
              required
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
                  setSlot((prev) => ({ ...prev, file: null }));
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
                Upload Slot Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setCoverPreview(URL.createObjectURL(file));
                    setSlot({ ...slot, file });
                  }
                }}
                className="cursor-pointer"
                required
              />
            </>
          )}
        </div>
      </form>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-8 py-3 bg-[#ffe974] font-bold text-black text-lg rounded transition shadow-lg transform hover:scale-105 rounded-md"
        >
          SAVE SLOT
        </button>
      </div>
    </div>
  );
};

export default AddSlots;
