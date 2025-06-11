import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showNotification } from "../utilities/Utility"; // ✅ Make sure this is correct path
import { FaUser, FaEnvelope, FaPhone, FaLock, FaGlobe } from "react-icons/fa";

const RegisterCustomer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "",
    consent: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phone,
      country,
    } = formData;

    if (
      !email ||
      !password ||
      !confirmPassword ||
      !firstName ||
      !lastName ||
      !phone ||
      !country
    ) {
      showNotification({
        title: "Missing Fields",
        message: "All fields are required!",
        type: "danger",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      showNotification({
        title: "Password Mismatch",
        message: "Passwords do not match!",
        type: "danger",
      });
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_SERVER_API_URL}users/register`, {
        email,
        password,
        firstname: firstName,
        lastname: lastName,
        phone,
        country,
        role: "Customer",
      });

      showNotification({
        title: "Registration Successful",
        message: "Redirecting to login...",
        type: "success",
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        country: "",
        consent: false,
      });

      setTimeout(() => navigate("/user-signin"), 2000);
    } catch (err) {
      showNotification({
        title: "Registration Failed",
        message: err.response?.data?.message || "Something went wrong!",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 rounded-lg shadow-lg w-4/5 mx-auto bg-white/80 backdrop-blur-md">
      <h2 className="text-3xl font-bold font-[Cinzel] text-black text-center mb-6">
        CUSTOMER REGISTRATION
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Field
          label="First Name"
          name="firstName"
          type="text"
          icon={<FaUser />}
          value={formData.firstName}
          handleChange={handleChange}
          required
        />
        <Field
          label="Last Name"
          name="lastName"
          type="text"
          icon={<FaUser />}
          value={formData.lastName}
          handleChange={handleChange}
          required
        />
        <Field
          label="Email"
          name="email"
          type="email"
          icon={<FaEnvelope />}
          value={formData.email}
          handleChange={handleChange}
          required
        />
        <Field
          label="Phone"
          name="phone"
          type="text"
          icon={<FaPhone />}
          value={formData.phone}
          handleChange={handleChange}
          required
        />
        <Field
          label="Country"
          name="country"
          type="text"
          icon={<FaGlobe />}
          value={formData.country}
          handleChange={handleChange}
          required
        />
        <Field
          label="Password"
          name="password"
          type="password"
          icon={<FaLock />}
          value={formData.password}
          handleChange={handleChange}
          required
        />
        <Field
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          icon={<FaLock />}
          value={formData.confirmPassword}
          handleChange={handleChange}
          required
        />

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

        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e3c27e] text-black font-bold py-3 rounded-lg hover:bg-[#d4b172] transition duration-300"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Field Component for Inputs
const Field = ({ label, name, type, icon, value, handleChange, required }) => (
  <div className="relative">
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
      />
    </div>
  </div>
);

export default RegisterCustomer;
