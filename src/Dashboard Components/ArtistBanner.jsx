import React, { useState, Fragment } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaInstagram,
  FaPinterest,
  FaStar
} from "react-icons/fa";
import { IoMdChatbubbles } from "react-icons/io";
import { FiShare2 } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import { updateArtistProfile } from "../services/ApiService";
import { mapUpdatedProfileDataToDto } from "../utilities/Utility";

const ArtistBanner = () => {
  const [formData, setFormData] = useState({
    phone: "",
    linkedin: "",
    instagram: "",
    pinterest: ""
  });

  const [backgroundImg, setBackgroundImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [bgImgfile, setBgImgFile] = useState(null);
  const [profileImgfile, setProfileImgFile] = useState(null);

  const handleImageUpload = (e, setter, fileSetter) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setter(imageURL);
      fileSetter(file);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowBanner(true);
  };

  const handleEdit = () => {
    setShowBanner(false);
  };
  const updateProfileSubmit = () => {

   
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      navigate("/login");
    }

    const user = JSON.parse(loggedInUser);
    let payload = mapUpdatedProfileDataToDto(formData,bgImgfile,profileImgfile,user.id);  
    console.log("payload",payload)
    updateArtistProfile(payload).then((res)=>{
      alert("Profile updated successfully", res);
      setFormData({
        phone: "",
        linkedin: "",
        instagram: "",
        pinterest: ""
      });
      setProfileImgFile(null);
      setBgImgFile(null);
      setBackgroundImg(null);
      setProfileImg(null);
      document.querySelectorAll('input[type="file"]').forEach(input => input.value = "");
      document.querySelectorAll('input[type="text"]').forEach(input => input.value = "");
    }).catch((err) => {
      console.error(err);
      alert("something went wrong...")
    });
  }
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* FORM SECTION */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[#2c3e50]">
          Create Your Artist Banner
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Background Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setBackgroundImg , setBgImgFile)}
                className="border border-gray-300 rounded w-full p-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setProfileImg, setProfileImgFile)}
                className="border border-gray-300 rounded w-full p-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Instagram
              </label>
              <input
                type="text"
                name="instagram"
                onChange={handleChange}
                className="border border-gray-300 rounded w-full p-2"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                onChange={handleChange}
                className="border border-gray-300 rounded w-full p-2"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                LinkedIn
              </label>
              <input
                type="text"
                name="linkedin"
                onChange={handleChange}
                className="border border-gray-300 rounded w-full p-2"
              />
            </div>
           
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Pinterest
              </label>
              <input
                type="text"
                name="pinterest"
                onChange={handleChange}
                className="border border-gray-300 rounded w-full p-2"
              />
            </div>
          </div>
        </div>
    <div className="flex justify-between mt-6">
      <button
        type="submit"
        className="w-1/2 bg-[#e3c27e] hover:bg-[#c8a954] text-white font-bold py-2 px-4 rounded mr-4"
      >
        Preview Banner
      </button>
      <button
      onClick={updateProfileSubmit}        
        className="w-1/2 bg-[#4CAF79] hover:bg-[#45A049] text-white font-bold py-2 px-4 rounded"
        >
       Update Profile
      </button>
    </div>
        
      </form>

      {/* MODAL PREVIEW */}
      <Dialog open={showBanner} onClose={handleEdit} as={Fragment}>
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl relative">
            <div className="relative h-60 w-full">
              {/* Background Image */}
              {backgroundImg && (
                <img
                  src={backgroundImg}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              )}

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex items-center px-8 py-6 text-white">
                {/* Profile Image */}
                {profileImg && (
                  <img
                    src={profileImg}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                )}

                {/* Info */}
                <div className="ml-6 space-y-1">
                  <h2 className="text-2xl font-bold font-[Cinzel]">{formData.name}</h2>
                  <div className="flex items-center gap-2 text-sm">
                    <FaMapMarkerAlt /> {formData.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaPhone /> {formData.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaEnvelope /> {formData.email}
                  </div>
                </div>

                {/* Actions & Socials */}
                <div className="ml-auto text-right">
                  <div className="flex flex-col items-end gap-2">
                    <button className="bg-[#e57373] text-white px-4 py-2 rounded-full hover:bg-[#d16262] flex items-center gap-2 shadow">
                      <IoMdChatbubbles /> Chat Now
                    </button>
                    <a
                      href="#"
                      className="text-white underline flex items-center hover:text-[#e3c27e]"
                    >
                      Share <FiShare2 className="ml-1" />
                    </a>
                  </div>
                  <div className="flex gap-3 mt-2 justify-end text-xl">
                    {formData.linkedin && (
                      <a
                        href={formData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-blue-400"
                      >
                        <FaLinkedin />
                      </a>
                    )}
                    {formData.instagram && (
                      <a
                        href={formData.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-pink-400"
                      >
                        <FaInstagram />
                      </a>
                    )}
                    {formData.pinterest && (
                      <a
                        href={formData.pinterest}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-red-400"
                      >
                        <FaPinterest />
                      </a>
                    )}
                  </div>
                  <button
                    onClick={handleEdit}
                    className="text-white underline mt-2 text-sm"
                  >
                    Edit Banner
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleEdit}
                className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/70 px-3 py-1 rounded"
              >
                ✕
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ArtistBanner;
