import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { FaUser, FaKey } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const SignInArtist = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

      if (decoded.role !== "Artist") {
        Swal.fire({
          icon: "error",
          title: "Access Denied!",
          text: "Only Artist's can log in here.",
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
      setTimeout(() => navigate("/artist-dashboard"), 1500);
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2] px-4 py-12">
      <div className="bg-white w-full max-w-6xl shadow-lg flex rounded-md overflow-hidden">
        {/* Left: Login Form */}
        <div className="w-full md:w-1/2 p-10">
          {/* Don’t have an account message above tab */}
          <div className="text-sm text-center text-gray-600 mb-3">
            Don’t have an account?{" "}
            <Link
              to="/register-artist"
              className="text-[#e3c27e] font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </div>
          {/* Tabs */}
          <div className="flex mb-6">
            <button className="w-1/2 text-center py-3 bg-black text-white font-semibold rounded-l-md">
              Login
            </button>
            <Link
              to="/register-artist"
              className="w-1/2 text-center py-3 bg-gray-100 text-black font-semibold rounded-r-md hover:bg-gray-200"
            >
              Sign Up
            </Link>
          </div>

          {/* Login success */}
          {loginSuccess && (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm mb-4">
              ✅ Login successful
            </div>
          )}
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="flex items-center bg-[#e8f0fe] rounded-md px-4 py-3 mb-5">
              <FaUser className="text-gray-600 mr-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="yourmailaddress@gmail.com"
                className="bg-transparent w-full focus:outline-none"
                required
              />
            </div>

            <div className="flex items-center bg-[#e8f0fe] rounded-md px-4 py-3 mb-5">
              <FaKey className="text-gray-600 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="bg-transparent w-full focus:outline-none"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 cursor-pointer text-gray-600"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white w-full py-3 rounded-md font-semibold hover:opacity-90 transition"
            >
              {loading ? "Logging in..." : "Sign in"}
            </button>
          </form>
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

export default SignInArtist;
