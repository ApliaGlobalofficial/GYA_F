import React, { useState, useEffect } from "react";
import { fetchVenueLocations, getLocationData } from "../services/ApiService";
import {
  registerVenue,
  fetchAllSlotsMaster,
  getCurrenyDetailsByCountryName,
} from "../services/ApiService";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaImage,
  FaPaintBrush,
  FaGlobe,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { mapFormDataToRegisterVenueEntity } from "../utilities/Utility";
import Swal from "sweetalert2";
import { showNotification } from "../utilities/Utility"; // ✅ Import notification utility

const RegisterVenue = () => {
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();
  const [slotsData, setSlotsData] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    password: "",
    phoneNumber: "",
    venueName: "",
    venueAddress: "",
    registeredCompanyName: "",
    registeredAddress: "",
    venueLocation: "",
    companyType: "",
    venuePhoto: null,
    locationPhoto: null,
    slots: [],
    artType: "",
    displayConsiderations: "",
    website: "",
    establishedDate: "",
    tradingSince: "",
    venueType: "",
    venueTheme: "",
    venueDescription: "",
    referralSource: "",
    newsletter: false,
    consent: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };
  const [slotsMaster, setSlotsMaster] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const handleSlotChange = (index, field, value) => {
    const updatedInputs = [...slotsData];
    updatedInputs[index][field] = value;
    setSlotsData(updatedInputs);
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let errors = {};

    if (!formData.firstName.trim()) errors.firstName = "Owner name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.password.trim()) errors.password = "Password is required";

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Invalid phone number (10 digits required)";
    }

    if (!formData.venueName.trim()) errors.venueName = "Venue name is required";
    if (!formData.venueAddress.trim())
      errors.venueAddress = "Venue address is required";
    if (!formData.venueLocation.trim())
      errors.venueLocation = "Venue location is required";

    if (!formData.consent)
      errors.consent = "You must agree to the terms and conditions.";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification({
        title: "Validation Error",
        message: "Please fix the errors in the form.",
        type: "danger",
      });
      return;
    }
    let currency = await getCurrenyDetailsByCountryName(selectedCountry);
    slotsData.forEach((obj) => {
      obj["currency_symbol"] = currency.symbol;
      obj["currency_key"] = currency.currencyKey;
    });
    let updatedSlotsData = slotsData.filter((slot) => slot.slot_count);
    const venueRegisterDto = mapFormDataToRegisterVenueEntity(
      formData,
      updatedSlotsData,
      selectedCountry,
      selectedSuggestion
    );
    registerVenue(venueRegisterDto)
      .then((response) => {
        showNotification({
          title: "Venue Registration Successful",
          message: "Venue successfully registered!",
          type: "success",
        });

        setFormData({
          firstName: "",
          email: "",
          password: "",
          phoneNumber: "",
          venueName: "",
          venueAddress: "",
          registeredCompanyName: "",
          registeredAddress: "",
          venueLocation: "",
          companyType: "",
          venuePhoto: null,
          locationPhoto: null,
          slots: [],
          artType: "",
          displayConsiderations: "",
          website: "",
          establishedDate: "",
          tradingSince: "",
          venueType: "",
          venueTheme: "",
          venueDescription: "",
          referralSource: "",
          newsletter: false,
          consent: false,
        });
        const updatedSlots = slotsMaster.map((slot) => ({
          ...slot,
          slot_count: 0,
          slot_price: 0,
        }));
        setSlotsData(updatedSlots);
        setTimeout(() => navigate("/user-signin"), 2000);
      })
      .catch((error) => {
        // Handle error
        console.error("Error registering venue:", error);
        showNotification({
          title: "Registration Failed",
          message: error?.response?.data?.message || "Something went wrong!",
          type: "danger",
        });
      });
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    // Define the async function to fetch the location
    const fetchLocation = async () => {
      try {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            let apiUrl = `${
              import.meta.env.VITE_GEOLOCATION_API_URL
            }reverse?lat=${latitude}&lon=${longitude}&format=json`;
            let userLocationData = await getLocationData(apiUrl);
            console.log("userLocationData", userLocationData);
            setSelectedSuggestion(userLocationData);
            setFormData({
              ...formData,
              venueLocation: userLocationData.address.county,
              venueAddress: userLocationData.display_name,
            });
          },
          (err) => {
            console.error("Error getting location:", err);
            Swal.fire({
              icon: "error",
              title: "Location Access Unsuccessful",
              text: "Your location services are disabled. Please enter venue city name manually.",
              confirmButtonColor: "#e3c27e",
            });
          }
        );
      } catch (error) {
        console.error("Error in fetching location data:", error);
      }
    };

    fetchLocation();

    // const countryName = localStorage.getItem("selectedCountry");
    // if (!countryName) {
    //   navigate("/choose-country");
    // }
    //setSelectedCountry(countryName);
    // fetchVenueLocations(countryName).then((backendResponse) => {
    //   console.log("response is ,", backendResponse);
    //   const transformedLocations = backendResponse.map((item) => ({
    //     id: item.id,
    //     location: item.location,
    //   }));
    //   setLocations(transformedLocations);
    // });

    fetchAllSlotsMaster().then((response) => {
      setSlotsMaster(response);
      setSlotsData(
        response.map((slot) => ({
          slot_name: slot.slot_name,
          slot_dimension: slot.slot_dimension,
          slot_price: 0,
          slot_count: 0,
        }))
      );
    });
  }, []);
  const fetchCoordinates = async (cityName) => {
    try {
      console.log("cityname", cityName);
      let apiUrl = `${
        import.meta.env.VITE_GEOLOCATION_API_URL
      }/search?format=json&q=${encodeURIComponent(cityName)}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  return (
    <div className="p-10 rounded-lg shadow-lg w-4/5 mx-auto bg-white/80 backdrop-blur-md">
      <h2 className="text-3xl font-bold font-[Cinzel] text-black text-center mb-6">
        VENUE REGISTRATION
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="relative w-full ">
          <Field
            // className="w-full"
            label="Venue City"
            name="venueLocation"
            type="text"
            icon={<FaMapMarkerAlt />}
            value={formData.venueLocation}
            handleChange={handleChange}
            handleBlur={() => fetchCoordinates(formData.venueLocation)}
            errors={errors}
          />

          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-md max-h-60 overflow-auto mt-1">
              {suggestions.map((item, idx) => (
                <li
                  key={idx}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 transition duration-150 ease-in-out"
                  onClick={() => {
                    const fullAddress = item.display_name;
                    const country = fullAddress.split(",").pop().trim(); // ✅ Extract country
                    setSelectedCountry(country); // ✅ Save extracted country
                    setFormData({
                      ...formData,
                      venueLocation: fullAddress,
                    });
                    setSelectedSuggestion(item);
                    setSuggestions([]);
                  }}
                >
                  {item.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* First Name */}
        <Field
          label="Owner Name"
          name="firstName"
          type="text"
          icon={<FaUser />}
          value={formData.firstName}
          handleChange={handleChange}
          required
          errors={errors}
        />

        {/* Email */}
        <Field
          label="Email"
          name="email"
          type="email"
          icon={<FaEnvelope />}
          value={formData.email}
          handleChange={handleChange}
          required
          errors={errors}
        />

        {/* Password */}
        <Field
          label="Password"
          name="password"
          type="password"
          icon={<FaLock />}
          value={formData.password}
          handleChange={handleChange}
          required
          errors={errors}
        />

        {/* Phone Number */}
        <Field
          label="Phone Number"
          name="phoneNumber"
          type="text"
          icon={<FaPhone />}
          value={formData.phoneNumber}
          handleChange={handleChange}
          required
          errors={errors}
        />

        {/* Venue Name */}
        <Field
          label="Venue Name"
          name="venueName"
          type="text"
          icon={<FaBuilding />}
          value={formData.venueName}
          handleChange={handleChange}
          required
          errors={errors}
        />

        {/* Venue Address */}
        <Field
          label="Venue Address"
          name="venueAddress"
          type="text"
          icon={<FaMapMarkerAlt />}
          value={formData.venueAddress}
          handleChange={handleChange}
          required
          errors={errors}
        />

        {/* Registered Company Name */}
        <Field
          label="Registered Company Name"
          name="registeredCompanyName"
          type="text"
          icon={<FaBuilding />}
          value={formData.registeredCompanyName}
          handleChange={handleChange}
          errors={errors}
        />

        {/* Registered Address */}
        <Field
          label="Registered Address"
          name="registeredAddress"
          type="text"
          icon={<FaMapMarkerAlt />}
          value={formData.registeredAddress}
          handleChange={handleChange}
          errors={errors}
        />

        {/* Venue Location */}
        {/* <LocationDropdown
          label="Venue Location"
          name="venueLocation"
          value={formData.venueLocation}
          handleChange={handleChange}
          options={locations}
          required
        /> */}

        {/* Company Type */}
        <Dropdown
          label="Company Type"
          name="companyType"
          value={formData.companyType}
          handleChange={handleChange}
          options={["Private", "Public"]}
          required
          errors={errors}
        />

        {/* Venue Photo */}
        <FileUpload
          label="Upload Venue Photo"
          name="venuePhoto"
          handleChange={handleChange}
          errors={errors}
        />

        {/* Location Photo */}
        <FileUpload
          label="Upload Your Logo"
          name="locationPhoto"
          handleChange={handleChange}
          errors={errors}
        />

        {/* Slots */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Available Slots ( Not Mandatory)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {slotsData.map((slot, index) => (
              <div key={index} className="mb-4">
                {/* Slot Name (Static, from Master Data) */}
                {/* <label className="block text-sm font-semibold text-gray-700"></label> */}

                {/* Slot Dimension (Static, from Master Data) */}
                {/* <label className="block text-sm font-semibold text-gray-700">{slot.slot_dimension}</label> */}

                {/* Slot Count */}
                <label className="block text-sm font-semibold text-gray-700">
                  {slot.slot_name} Count
                </label>
                <input
                  type="number"
                  name={`slot_count_${index}`}
                  value={slot.slot_count}
                  onChange={(e) =>
                    handleSlotChange(index, "slot_count", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded"
                />

                {/* Slot Price */}
                <label className="block text-sm font-semibold text-gray-700">
                  {slot.slot_name} Price
                </label>
                <input
                  type="number"
                  name={`slot_price_${index}`}
                  value={slot.slot_price || ""}
                  onChange={(e) =>
                    handleSlotChange(index, "slot_price", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Art Type */}
        <Field
          label="Art Type"
          name="artType"
          type="text"
          icon={<FaPaintBrush />}
          value={formData.artType}
          handleChange={handleChange}
          required
          errors={errors}
        />

        {/* Display Considerations */}
        <Field
          label="Display Considerations"
          name="displayConsiderations"
          type="text"
          icon={<FaPaintBrush />}
          value={formData.displayConsiderations}
          handleChange={handleChange}
          required
          errors={errors}
        />

        {/* Website */}
        <Field
          label="Website"
          name="website"
          type="text"
          icon={<FaGlobe />}
          value={formData.website}
          handleChange={handleChange}
          errors={errors}
        />

        {/* Established Date */}
        <Field
          label="Established Date"
          name="establishedDate"
          type="date"
          icon={<FaCalendarAlt />}
          value={formData.establishedDate}
          handleChange={handleChange}
          required
          errors={errors}
        />

        {/* Trading Since */}
        <Field
          label="Company Trading Since"
          name="tradingSince"
          type="date"
          icon={<FaCalendarAlt />}
          value={formData.tradingSince}
          handleChange={handleChange}
          required
          errors={errors}
        />

        {/* Venue Type */}
        <Field
          label="Venue Type"
          name="venueType"
          type="text"
          icon={<FaBuilding />}
          value={formData.venueType}
          handleChange={handleChange}
          required
          errors={errors}
        />

        {/* Venue Theme */}
        <Field
          label="Venue Theme"
          name="venueTheme"
          type="text"
          icon={<FaPaintBrush />}
          value={formData.venueTheme}
          handleChange={handleChange}
          required
          errors={errors}
        />

        {/* Venue Description */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Venue Description *
          </label>
          <textarea
            name="venueDescription"
            rows="4"
            value={formData.venueDescription}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e3c27e] bg-white"
            placeholder="Please provide details about your venue"
            required
          ></textarea>
        </div>

        {/* Referral Source */}
        <Field
          label="How did you hear about us?"
          name="referralSource"
          type="text"
          icon={<FaGlobe />}
          value={formData.referralSource}
          handleChange={handleChange}
          required
          errors={errors}
        />

        {/* Newsletter Signup */}
        <Dropdown
          label="Sign Up for Newsletter"
          name="newsletter"
          value={formData.newsletter ? "yes" : "no"}
          handleChange={(e) =>
            setFormData({ ...formData, newsletter: e.target.value === "yes" })
          }
          options={["Yes", "No"]}
        />

        {/* Consent */}
        <div className="flex items-start gap-2 col-span-1 md:col-span-2">
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            className="mt-1"
          />
          <label htmlFor="consent" className="ml-2 text-black">
            Yes, I have read the{" "}
            <a href="/useof-platform" className="text-[#e3c27e] underline">
              terms and conditions
            </a>{" "}
            and I agree.
          </label>
        </div>

        {/* Submit Button */}
        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            className="w-full bg-[#e3c27e] text-black font-bold py-3 rounded-lg hover:bg-[#d4b172] transition duration-300"
          >
            Register Venue
          </button>
        </div>
      </form>
    </div>
  );
};

// Icon Input Field
const Field = ({
  label,
  name,
  type,
  icon,
  value,
  handleChange,
  required,
  handleBlur,
  errors, // ✅ Add this
}) => (
  <div className="relative mb-1">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && "*"}
    </label>
    <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3">
      <span className="text-gray-500 mr-2">{icon}</span>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={handleChange}
        placeholder={label}
        className="w-full py-2 px-1 outline-none bg-transparent"
        required={required}
        onBlur={handleBlur}
      />
    </div>
    {errors?.[name] && ( // ✅ Safe access with optional chaining
      <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
    )}
  </div>
);

// Dropdown Select Field
const Dropdown = ({
  label,
  name,
  value,
  handleChange,
  options = [],
  required,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && "*"}
    </label>
    <select
      name={name}
      value={value}
      onChange={handleChange}
      required={required}
      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#e3c27e]"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt.toLowerCase()}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
const LocationDropdown = ({
  label,
  name,
  value,
  handleChange,
  options = [],
  required,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && "*"}
    </label>
    <select
      name={name}
      value={value}
      onChange={handleChange}
      required={required}
      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#e3c27e]"
    >
      <option value="">Select {label}</option>
      {options.map((opt, index) => (
        <option key={index} value={opt.id}>
          {opt.location}
        </option>
      ))}
    </select>
  </div>
);
// File Upload Field
const FileUpload = ({ label, name, handleChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} *
    </label>
    <input
      type="file"
      name={name}
      onChange={handleChange}
      className="w-full p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-[#e3c27e] file:text-black hover:file:bg-[#d4b172]"
      required
    />
  </div>
);

export default RegisterVenue;
