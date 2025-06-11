import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaUser, FaKey } from "react-icons/fa";

const SignInCustomer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    setIsSignUp(tab === "signup");
  }, [location.search]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setLoginSuccess(false);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}users/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const token = response.data.data.token;
      const decoded = jwtDecode(token);

      if (decoded.role !== "Customer") {
        Swal.fire({
          icon: "error",
          title: "Access Denied!",
          text: "Only Customers can log in here.",
          confirmButtonColor: "#e3c27e",
        });
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: decoded.sub,
          firstName: decoded.firstname,
          lastName: decoded.lastname,
          email: decoded.email,
          role: decoded.role,
          status: decoded.status,
          country: decoded.country,
          phone: decoded.phone,
        })
      );

      setLoginSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
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
      setError("All fields are required!");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
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

      alert("Registration successful ✅");
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        phone: "",
        country: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2] px-4 py-12">
      <div className="bg-white w-full max-w-6xl shadow-lg flex rounded-md overflow-hidden">
        {/* Left: Login / SignUp Form */}
        <div className="w-full md:w-1/2 p-10">
          <div className="flex mb-6">
            <button
              className={`w-1/2 text-center py-3 font-semibold rounded-l-md ${
                !isSignUp ? "bg-black text-white" : "bg-gray-100 text-black"
              }`}
              onClick={() => setIsSignUp(false)}
            >
              Login
            </button>
            <button
              className={`w-1/2 text-center py-3 font-semibold rounded-r-md ${
                isSignUp ? "bg-black text-white" : "bg-gray-100 text-black"
              }`}
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </button>
          </div>

          {loginSuccess && (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm mb-4">
              ✅ Login successful
            </div>
          )}

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          {!isSignUp ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="flex items-center bg-[#e8f0fe] rounded-md px-4 py-3">
                <FaUser className="text-gray-600 mr-3" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>
              <div className="flex items-center bg-[#e8f0fe] rounded-md px-4 py-3">
                <FaKey className="text-gray-600 mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-transparent w-full focus:outline-none"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 cursor-pointer text-gray-600"
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" /> Remember me
                </label>
                <a href="#" className="text-blue-600 hover:underline">
                  Forgot Password?
                </a>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white w-full py-3 rounded-md font-semibold hover:opacity-90 transition"
              >
                {loading ? "Logging in..." : "Sign in"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="flex items-center bg-[#e8f0fe] rounded-md px-4 py-3">
                <FaUser className="text-gray-600 mr-3" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="bg-[#e8f0fe] px-4 py-3 rounded-md w-1/2 focus:outline-none"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="bg-[#e8f0fe] px-4 py-3 rounded-md w-1/2 focus:outline-none"
                />
              </div>
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="bg-[#e8f0fe] px-4 py-3 rounded-md w-full focus:outline-none"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                required
                className="bg-[#e8f0fe] px-4 py-3 rounded-md w-full focus:outline-none"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-[#e8f0fe] px-4 py-3 rounded-md w-full focus:outline-none"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="bg-[#e8f0fe] px-4 py-3 rounded-md w-full focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white w-full py-3 rounded-md font-semibold hover:opacity-90 transition"
              >
                {loading ? "Registering..." : "Sign Up"}
              </button>
            </form>
          )}
        </div>

        {/* Right: Artwork Image */}
        <div className="hidden md:block md:w-1/2 relative">
          <img
            src="/src/assets/getyourartslogo.jpg"
            alt="Login Art"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default SignInCustomer;
