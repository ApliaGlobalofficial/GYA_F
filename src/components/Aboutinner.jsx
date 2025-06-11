import React from "react";
import AboutBg from "../assets/16.jpg"; // Random image
import getYourArtsLogo from "../assets/getyourartslogo.jpg"; //logo image


const Aboutinner = () => {
  return (
    <div className="font-[Cinzel,sans-serif]">
      {/* Hero Section - Random Art Background */}
      <section
  className="relative w-full h-screen flex items-center justify-center bg-cover bg-center text-center text-gold"
  style={{ backgroundImage: `url(${AboutBg})` }}
>
  <h1 className="text-6xl text-[#e3c27e] font-bold">ABOUT</h1>
</section>


<section 
      className="flex flex-col md:flex-row items-center md:items-start p-10"
      style={{ backgroundColor: "#E0C884" }} // Applying the background color
    >
      {/* Left Side - Image */}
      <div className="md:w-[40%] w-full flex justify-center md:justify-start">
        <img
          src={getYourArtsLogo}
          alt="Get Your Arts Logo"
          className="w-[350px] md:w-[450px] h-[500px] object-cover shadow-lg"
        />
      </div>

      {/* Right Side - Text Content */}
      <div className="md:w-[75%] w-full p-5 text-[#000000] font-[Montserrat,sans-serif]">
        {/* Heading with Cinzel Font */}
        <h2 className="text-5xl font-bold mb-5 font-[Cinzel,sans-serif]">Get Your Arts</h2>

        {/* Paragraphs with Sans-serif Font */}
        <p className="text-lg leading-relaxed">
          Get Your Arts is designed to give all artists a chance to shine by
          offering access to premium locations throughout the city. Restaurants
          and bars, often located in prime areas, provide the perfect setting
          for this win-win collaboration.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          Our platform operates with a low-commission structure, ensuring that
          artists retain the majority of their asking price. Venues, in turn,
          add a markup for displaying the artwork, while customers benefit from
          access to affordable, high-quality pieces by emerging artists.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          The process is simple: restaurants choose from predefined canvas sizes
          and post available slots for their wall space. Artists can then browse
          these listings, select their preferred venue, and propose their
          artwork. Venues choose the pieces that best complement their ambiance
          and display them both in the venue and online once received.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          Patrons can browse available artwork by location or discover it while
          socializing.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          For more information, including our legal terms and conditions, please
          visit the Terms and Conditions section.
        </p>
      </div>
    </section>



      {/* Video Section */}
<section className="p-10 text-center">
  <h2 className="text-2xl font-bold font-[Cinzel]">
    INTRODUCTION VIDEO FROM ONE OF OUR CO-FOUNDERS MR. JUNAID SHAH
  </h2>
  <div className="mt-5 flex justify-center">
    
  <iframe
    width="660"
    height="840"
    src="https://www.youtube.com/embed/geQIWT1NLo4"
    title="YouTube video player"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen
    className="rounded-xl shadow-lg"
  ></iframe>

  </div>
</section>
    </div>
  );
};

export default Aboutinner;
