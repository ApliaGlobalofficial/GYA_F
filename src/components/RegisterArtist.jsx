import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showNotification } from "../utilities/Utility"; // ✅ Do not modify
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
  FaCheckCircle,
} from "react-icons/fa";

const API_BASE_URL = `${import.meta.env.VITE_SERVER_API_URL}artist`;

const RegisterArtist = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    zip: "",
    country: "",
    address: "",
    website: "",
    about_artwork: "",
    about_artist: "",
    referral_source: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [consent, setConsent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let errors = {};

    if (!formData.username.trim()) errors.username = "Username is required";
    if (!formData.firstname.trim()) errors.firstname = "First name is required";
    if (!formData.lastname.trim()) errors.lastname = "Last name is required";

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.password.trim()) errors.password = "Password is required";

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Invalid phone number (10 digits required)";
    }

    if (!formData.country.trim()) errors.country = "Country is required";

    if (!consent)
      errors.consent = "You must agree to the terms and conditions.";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification({
        title: "Form Error",
        message: "Please correct all highlighted errors.",
        type: "danger",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}`, formData);

      showNotification({
        title: "Registration Successful",
        message: "Welcome Artist! Redirecting to Sign In...",
        type: "success",
      });

      setTimeout(() => navigate("/user-signin"), 2000);
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Registration Failed",
        message:
          error.response?.data?.message ||
          "Something went wrong. Try again later!",
        type: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-10 rounded-lg shadow-lg w-4/5 mx-auto bg-white/80 backdrop-blur-md">
      <h2 className="text-3xl font-bold font-[Cinzel] text-black text-center mb-6">
        ARTIST REGISTRATION
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          icon={<FaUser />}
          name="username"
          placeholder="Username *"
          value={formData.username}
          handleChange={handleChange}
          error={errors.username}
        />

        <div className="flex space-x-4">
          <InputField
            name="firstname"
            placeholder="First Name *"
            value={formData.firstname}
            handleChange={handleChange}
            error={errors.firstname}
          />
          <InputField
            name="lastname"
            placeholder="Last Name *"
            value={formData.lastname}
            handleChange={handleChange}
            error={errors.lastname}
          />
        </div>

        <InputField
          icon={<FaEnvelope />}
          type="email"
          name="email"
          placeholder="Email *"
          value={formData.email}
          handleChange={handleChange}
          error={errors.email}
        />

        <InputField
          icon={<FaLock />}
          type="password"
          name="password"
          placeholder="Password *"
          value={formData.password}
          handleChange={handleChange}
          error={errors.password}
        />

        <InputField
          icon={<FaPhone />}
          name="phone"
          placeholder="Phone Number *"
          value={formData.phone}
          handleChange={handleChange}
          error={errors.phone}
        />

        <div className="flex space-x-4">
          <InputField
            name="country"
            placeholder="Country *"
            value={formData.country}
            handleChange={handleChange}
            error={errors.country}
          />
          <InputField
            name="zip"
            placeholder="ZIP / Postal Code"
            value={formData.zip}
            handleChange={handleChange}
          />
        </div>

        <InputField
          icon={<FaMapMarkerAlt />}
          name="address"
          placeholder="Address (Optional)"
          value={formData.address}
          handleChange={handleChange}
        />

        <InputField
          icon={<FaGlobe />}
          name="website"
          placeholder="Website (Optional)"
          value={formData.website}
          handleChange={handleChange}
        />

        <TextAreaField
          icon={<FaPaintBrush />}
          name="about_artwork"
          placeholder="Tell us about your artwork"
          value={formData.about_artwork}
          handleChange={handleChange}
        />

        <TextAreaField
          name="about_artist"
          placeholder="Tell us a bit About You"
          value={formData.about_artist}
          handleChange={handleChange}
        />

        <InputField
          icon={<FaImage />}
          name="referral_source"
          placeholder="How did you hear about us?"
          value={formData.referral_source}
          handleChange={handleChange}
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            id="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="w-5 h-5 text-[#e3c27e] border-gray-300 rounded focus:ring-[#e3c27e]"
          />
          <label htmlFor="consent" className="ml-2 text-black">
            Yes, I have read the{" "}
            <a href="/useof-platform" className="text-[#e3c27e] underline">
              terms and conditions
            </a>{" "}
            and I agree.
          </label>
        </div>
        {errors.consent && (
          <p className="text-red-500 text-sm">{errors.consent}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#e3c27e] hover:bg-[#c9a55e] text-black py-3 rounded-md font-bold flex justify-center items-center"
        >
          {isLoading ? (
            <FaCheckCircle className="animate-spin" size={20} />
          ) : (
            "Register"
          )}
        </button>
      </form>
    </div>
  );
};

// Reusable InputField Component
const InputField = ({
  icon,
  name,
  placeholder,
  value,
  handleChange,
  error,
  type = "text",
}) => (
  <div className="relative w-full">
    {icon && <div className="absolute left-3 top-3 text-gray-500">{icon}</div>}
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      className={`w-full ${
        icon ? "pl-10" : "pl-3"
      } p-3 border border-gray-300 rounded-md`}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

// Reusable TextAreaField Component
const TextAreaField = ({ icon, name, placeholder, value, handleChange }) => (
  <div className="relative">
    {icon && <div className="absolute left-3 top-3 text-gray-500">{icon}</div>}
    <textarea
      name={name}
      placeholder={placeholder}
      rows="3"
      value={value}
      onChange={handleChange}
      className={`w-full ${
        icon ? "pl-10" : "pl-3"
      } p-3 border border-gray-300 rounded-md`}
    ></textarea>
  </div>
);

export default RegisterArtist;
