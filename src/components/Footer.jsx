import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import logo from "../assets/getyourartslogo.jpg";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white pt-8 pb-4 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Stay Tuned Section */}
        <div>
          <h2 className="text-2xl font-semibold font-[Cinzel] mb-3">
            STAY TUNED
          </h2>
          <div className="flex mb-4">
            <input
              type="email"
              placeholder="Your Email Address..."
              className="px-4 py-2 w-full max-w-xs text-black"
            />
            <button className="bg-[#e3c27e] text-black px-6 py-2 font-semibold hover:bg-yellow-600 transition">
              Submit
            </button>
          </div>

          <h2 className="text-2xl font-semibold font-[Cinzel] mb-2">
            CONNECT WITH US
          </h2>
          <div className="flex space-x-3">
            <a
              href="https://www.facebook.com/profile.php?id=61573136079594"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white text-black hover:bg-[#e3c27e] rounded transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com" // Replace with actual Twitter link if available
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white text-black hover:bg-[#e3c27e] rounded transition"
            >
              <FaTwitter />
            </a>
            <a
              href="https://youtube.com/@getyourarts?si=X7u6DTo0XKPLOCsJ"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white text-black hover:bg-[#e3c27e] rounded transition"
            >
              <FaYoutube />
            </a>
            <a
              href="https://www.instagram.com/getyourartsofficial/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white text-black hover:bg-[#e3c27e] rounded transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/company/106575341/admin/dashboard/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white text-black hover:bg-[#e3c27e] rounded transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Navigation Links - Left Column */}
        <div className="space-y-2 text-left mt-1">
          <a href="#" className="block hover:text-[#e3c27e] transition">
            Home
          </a>
          <a href="/about" className="block hover:text-[#e3c27e] transition">
            About
          </a>
          <a href="/contact" className="block hover:text-[#e3c27e] transition">
            Contact
          </a>
        </div>

        {/* Navigation Links - Right Column */}
        <div className="space-y-2 text-left mt-1">
          <a
            href="/privacy-policy"
            className="block hover:text-[#e3c27e] transition"
          >
            Privacy Policy
          </a>
          <a
            href="/useof-platform"
            className="block hover:text-[#e3c27e] transition"
          >
            Terms & Conditions
          </a>
        </div>

        {/* Image & Text */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right">
          <img src={logo} alt="Logo" className="w-full max-w-[220px]" />
          <p className="mt-2 font-semibold text-sm text-white">
            Art is for everyone, Promote it anywhere!
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="w-full bg-[#1f1f1f] mt-8 py-3 text-center text-sm border-t border-gray-700">
        <p>
          Copyright © 2025 Get Your Arts - A Chance at Fame While You’re Still
          Living | Powered by Get Your Arts
        </p>
      </div>
    </footer>
  );
};

export default Footer;
