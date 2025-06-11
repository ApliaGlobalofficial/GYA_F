import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import News from "./News";
import { FaPaintBrush, FaBuilding, FaUser } from "react-icons/fa";

// Import images properly from src/assets/
import sunset from "../assets/16.jpg";
import city from "../assets/17.jpg";
import floating from "../assets/12.jpg";
import mystical from "../assets/11.jpg";
import cosmic from "../assets/1.jpg";
import inner1 from "../assets/13.jpg";
import inner2 from "../assets/10.jpg";

const Homeinner = () => {
  // Image list
  const images = [sunset, city, floating, mystical, cosmic, inner1, inner2];

  // Slider settings for slide-right transition
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Background Slideshow */}
      <div className="relative w-full">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index}>
              <div
                className="w-screen h-screen bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
              ></div>
            </div>
          ))}
        </Slider>

        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 bg-black/40">
          <h1 className="text-[80px] font-[600] font-[Cinzel,sans-serif] text-[#e3c27e] mb-6 drop-shadow-lg">
            Get Your Arts
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold font-[Cinzel] mb-6 drop-shadow-lg">
            EMPOWERING THE ARTS, ONE WALL AT A TIME.
          </h2>

          {/* Lowered Paragraph */}
          <p className="text-lg md:text-xl max-w-3xl leading-relaxed mt-6 mb-6 drop-shadow-md">
            <span className="font-semibold text-[#e3c27e]">Artists:</span>{" "}
            Display your work at top venues and keep most of your sales.
            <br />
            <span className="font-semibold text-[#e3c27e]">Venues:</span> Earn
            from your wall space while attracting art-loving customers.
            <br />
            <span className="font-semibold text-[#e3c27e]">
              Art Lovers:
            </span>{" "}
            Discover unique art at fair prices.
          </p>

          {/* Call-to-Action Button */}
          <button
            onClick={() => {
              const section = document.getElementById("signup-section");
              const yOffset = -100;
              const y =
                section.getBoundingClientRect().top + window.scrollY + yOffset;
              window.scrollTo({ top: y, behavior: "smooth" });
            }}
            className="bg-[#e3c27e] text-black py-2 px-6 rounded-full text-lg font-semibold hover:bg-yellow-600 transition duration-300 shadow-md"
          >
            Sign up for free
          </button>
        </div>
      </div>

      <main className="flex-grow font-[Lato,sans-serif] bg-white py-20 px-6 md:px-12 lg:px-24">
        {/* Heading */}
        <h2
          id="signup-section"
          className="text-[44px] font-bold font-[Cinzel,sans-serif] text-center text-black mb-14 max-w-2xl mx-auto leading-tight tracking-wide"
        >
          Heaven For Arts
          <div className="h-[1px] w-28 bg-[#c2a85b] mx-auto mt-4"></div>
        </h2>

        {/* 3-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left text-black">
          {[
            {
              title: "Artist",
              icon: <FaPaintBrush className="text-black text-2xl" />,
              points: [
                "Do you have a unique artistic expression and enthusiasm towards them?",
                "Want to showcase your work at prime venues without relying on traditional galleries?",
                "Prefer to keep most of the proceeds from your art sales?",
              ],
              userType: "artist",
              primaryCTA: "Register Now",
            },
            {
              title: "Venue",
              icon: <FaBuilding className="text-black text-2xl" />,
              points: [
                "Looking to keep your venue vibrant with fresh, captivating art?",
                "Want to attract new clientele with a passion for specific art genres?",
                "Interested in earning revenue from your wall space?",
              ],
              userType: "venue",
              primaryCTA: "Register Now",
            },
            {
              title: "Art Customers",
              icon: <FaUser className="text-black text-2xl" />,
              points: [
                "Love art but hesitant about online or gallery prices?",
                "Enjoy socializing in spaces filled with vibrant art by undiscovered artists?",
                "Seen something amazing on our site and want to view it before buying?",
              ],
              userType: "customer",
              primaryCTA: "Shop Now",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="space-y-4 bg-[#FFFFFF] hover:bg-[#fcf5e5] transition duration-300 p-8 rounded-lg shadow-md"
            >
              {/* Icon */}
              <div className="text-2xl">{item.icon}</div>

              {/* Heading */}
              <h3 className="text-lg font-semibold text-[#E0C884]">
                {item.title}
              </h3>

              {/* Bullet points */}
              <div className="space-y-2">
                {item.points.map((line, i) => (
                  <p
                    key={i}
                    className="text-[16px] leading-relaxed font-semibold"
                  >
                    {line}
                  </p>
                ))}
                <div className="flex flex-col items-start">
                  {/* Register Now Button */}
                  <a
                    href={
                      item.userType === "artist"
                        ? "/register-artist"
                        : item.userType === "venue"
                        ? "/register-venue"
                        : item.userType === "customer"
                        ? "/register-customer"
                        : "#"
                    }
                    className="bg-[#ffffff] text-black py-2 px-4 text-sm font-semibold hover:bg-[#E0C884] transition duration-300 border-b-[1.5px] border-black shadow-md mb-2"
                  >
                    Register as {item.userType}
                  </a>

                  {/* Sign In Button */}
                  <a
                    href={`/user-signin?tab=login&userType=${item.userType}`}
                    className="bg-[#ffffff] text-black py-2 px-4 text-sm font-semibold hover:bg-[#E0C884] transition duration-300 border-b-[1.5px] border-black shadow-md "
                  >
                    Sign In
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* News Section */}
        <div className="w-full py-20 bg-white">
          <h2 className="text-5xl font-semibold font-[Cinzel,sans-serif] text-center text-black mb-10">
            Latest News & Updates
          </h2>
          <News />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-black text-white py-6 text-center">
        <p>Copyright © 2025 Get Your Arts - All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default Homeinner;
