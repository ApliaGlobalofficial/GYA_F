import React, { useState } from "react";
import SignInCustomer from "../components/SignIn-Customer";
import SignInVenue from "../components/SignIn-Venue";
import SignInArtist from "../components/SignIn-Artist";

const SignIn = () => {
  const [activeTab, setActiveTab] = useState("customer"); // Default: Customer

  return (
    <div 
  className="min-h-screen flex flex-col items-center justify-center p-6 bg-cover bg-center"
  style={{ backgroundImage: "url('/src/assets/19.jpg')" }}
>
      {/* <h1 className="text-3xl text-[#b8860b] font-bold font-[Lato] mb-6">SIGN IN</h1> */}

      {/* Tabs */}
      <div className="flex space-x-10 mt-10">
        <button
          onClick={() => setActiveTab("customer")}
          className={`px-6 py-3 rounded-md mb-5 font-semibold ${
            activeTab === "customer" ? "bg-[#e3c27e] text-black" : "bg-black text-[#e3c27e]"
          }`}
        >
          Customer
        </button>
        <button
          onClick={() => setActiveTab("venue")}
          className={`px-6 py-3 rounded-md mb-5 font-semibold ${
            activeTab === "venue" ? "bg-[#e3c27e] text-black" : "bg-black text-[#e3c27e]"
          }`}
        >
          Venue
        </button>
        <button
          onClick={() => setActiveTab("artist")}
          className={`px-6 py-3 rounded-md mb-5 font-semibold ${
            activeTab === "artist" ? "bg-[#e3c27e] text-black" : "bg-black text-[#e3c27e]"
          }`}
        >
          Artist
        </button>
      </div>

      {/* Show Selected Form */}
      <div className="bg-gradient-to-b from-[#F8E7C2] to-[#FDF8EA] p-6 rounded-lg shadow-md w-full max-w-10xl">

        {activeTab === "customer" && <SignInCustomer />}
        {activeTab === "venue" && <SignInVenue />}
        {activeTab === "artist" && <SignInArtist />}
      </div>
    </div>
  );
};

export default SignIn;
