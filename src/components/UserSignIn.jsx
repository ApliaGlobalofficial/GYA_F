import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ReactNotifications } from "react-notifications-component";
import { showNotification } from "../utilities/Utility";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaUser, FaKey } from "react-icons/fa";
import logo from "../assets/getyourartslogo.jpg";
import ForgotPasswordModal from "../components/ForgotPasswordModal";

const UserSignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [roleMessage, setRoleMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoginSuccess(false);
    setLoading(true);

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

      showNotification({
        title: "Login Successful",
        message: `Welcome, ${decoded.firstname}!`,
        type: "success",
      });

      setLoginSuccess(true);
      setRoleMessage(`✅ Logged in as ${decoded.role}`);

      if (decoded.role === "Venue") {
        navigate("/venue-dashboard");
      } else if (decoded.role === "Artist") {
        navigate("/artist-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login Error:", err);

      if (err.response) {
        // Server responded but with error code (401/403 etc)
        setError(err.response.data.message || "Login failed!");
        showNotification({
          title: "Invalid Credentials",
          message:
            err.response.data.message || "Email or password is incorrect.",
          type: "danger",
        });
      } else if (err.request) {
        // No response from server
        setError("Server not responding. Try again later.");
        showNotification({
          title: "Server Error",
          message: "Server not responding. Please try again later.",
          type: "danger",
        });
      } else {
        // Other error
        setError("Something went wrong. Please try again.");
        showNotification({
          title: "Error",
          message: "Something went wrong. Please try again.",
          type: "danger",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2] px-4 py-12">
        <div className="bg-white w-full max-w-6xl shadow-lg flex rounded-md overflow-hidden">
          {/* Left: Login Form */}
          <div className="w-full md:w-1/2 p-10">
            <div className="flex mb-6">
              <button className="w-full text-center py-3 font-semibold bg-black text-white cursor-default">
                Login
              </button>
            </div>

            {loginSuccess && (
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm mb-4">
                {roleMessage}
              </div>
            )}

            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

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
                <span
                  onClick={() => setShowForgotModal(true)}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white w-full py-3 font-semibold hover:opacity-90 transition"
              >
                {loading ? "Logging in..." : "Sign in"}
              </button>
            </form>

            {/* Role-Based Registration Options */}
            <div className="mt-10 text-center">
              <p className="text-sm text-gray-700 font-medium mb-3">
                Don't have an account? Register as:
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate("/register-artist")}
                  className="bg-black text-[#e3c27e] hover:text-white font-bold py-2 px-4 rounded transition w-1/3"
                >
                  Artist
                </button>
                <button
                  onClick={() => navigate("/register-venue")}
                  className="bg-black text-[#e3c27e] hover:text-white font-bold py-2 px-4 rounded transition w-1/3"
                >
                  Venue
                </button>
                <button
                  onClick={() => navigate("/register-customer")}
                  className="bg-black text-[#e3c27e] hover:text-white font-bold py-2 px-4 rounded transition w-1/3"
                >
                  Customer
                </button>
              </div>
            </div>
          </div>

          {/* Right: Artwork Image */}
          <div className="hidden md:block md:w-1/2 relative">
            <img src={logo} alt="Logo" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
      {showForgotModal && (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
      )}
    </>
  );
};

export default UserSignIn;
