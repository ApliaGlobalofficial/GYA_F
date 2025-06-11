import React, { useState } from "react";
//import RegisterCustomer from "../components/RegisterCustomer";
import RegisterVenue from "../components/RegisterVenue";
import RegisterArtist from "../components/RegisterArtist";

const RegisterRole = () => {
  const [activeTab, setActiveTab] = useState("customer"); // Default: Customer

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: "url('/src/assets/19.jpg')" }}
    >
      {/* Role Selection Tabs */}
      <div className="flex space-x-8 mt-15 ml-5">
        <button
          onClick={() => setActiveTab("customer")}
          className={`px-5 py-3 rounded-md mb-5 font-semibold ${
            activeTab === "customer" ? "bg-[#e3c27e] text-black" : "bg-black text-[#e3c27e]"
          }`}
        >
          Register as Customer
        </button>
        <button
          onClick={() => setActiveTab("venue")}
          className={`px-5 py-3 rounded-md mb-5 font-semibold ${
            activeTab === "venue" ? "bg-[#e3c27e] text-black" : "bg-black text-[#e3c27e]"
          }`}
        >
          Register as Venue
        </button>
        <button
          onClick={() => setActiveTab("artist")}
          className={`px-5 py-3 rounded-md mb-5 font-semibold ${
            activeTab === "artist" ? "bg-[#e3c27e] text-black" : "bg-black text-[#e3c27e]"
          }`}
        >
          Register as Artist
        </button>
      </div>

      {/* Show Selected Registration Form */}
      {/* <div className="bg-gradient-to-b from-[#F8E7C2] to-[#FDF8EA] p-6 rounded-lg shadow-md w-full max-w-10xl"> */}
        {/* {activeTab === "customer" && <RegisterCustomer />} */}
        {activeTab === "venue" && <RegisterVenue />}
        {activeTab === "artist" && <RegisterArtist />}
      </div>
    // </div>
  );
};

export default RegisterRole;
