import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const SignInVenue = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
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

      console.log("JWT Token:", token);
      console.log("Decoded User Data:", decoded);

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

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "You have successfully logged in.",
        confirmButtonColor: "#e3c27e",
      });
      if (decoded.role == "Venue") {
        navigate("/venue-dashboard");
      } else if (decoded.role == "Artist") {
        navigate("/artist-dashboard");
      } else {
        navigate("/shop-art");
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#F8E7C2] to-[#FDF8EA] p-6">
      <div className="relative w-full max-w-10xl h-[700px] bg-white shadow-2xl rounded-lg flex overflow-hidden p-10">
        {/* Left Image Section */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('/src/assets/getyourartslogo.jpg')" }}
        ></div>

        {/* Right Form Section */}
        <div className="w-full max-w-3xl md:w-full p-12 flex flex-col justify-center h-[300px] ml-12">
          <h2 className="text-3xl font-semibold mb-6">Secure Access Login</h2>
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex items-center border border-[#7a5c21] rounded-lg px-4 py-4">
              <span className="mr-3">📧</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full focus:outline-none"
              />
            </div>
            <div className="flex items-center border border-[#7a5c21] rounded-lg px-4 py-4">
              <span className="mr-3">🔑</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#e3c27e] text-black py-3 px-5 text-lg font-semibold hover:bg-yellow-600 transition duration-300 shadow-lg w-full mt-6 transform hover:scale-105"
            >
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </form>

          {/* Link to Register Page */}
          <p className="text-center mt-4 text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register-role"
              className="text-[#e3c27e] font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-3xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-black font-bold text-xl"
            >
              ×
            </button>

            {/* Your RegisterRole component inside the modal */}
            <RegisterRole />
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInVenue;
