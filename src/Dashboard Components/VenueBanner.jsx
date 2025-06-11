import React, { useState, Fragment } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaInstagram,
  FaGlobe,
} from "react-icons/fa";
import { IoMdChatbubbles } from "react-icons/io";
import { FiShare2 } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
// import { updateVenueProfile } from "../services/ApiService";
import {
  //   mapUpdatedProfileDataToDto,
  showNotification,
} from "../utilities/Utility";

const VenueBanner = () => {
  const [formData, setFormData] = useState({
    venue_name: "",
    phone: "",
    email: "",
    address: "",
    website: "",
    linkedin: "",
    instagram: "",
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
      [e.target.name]: e.target.value,
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
    if (!loggedInUser) return;

    const user = JSON.parse(loggedInUser);
    const payload = mapUpdatedProfileDataToDto(
      formData,
      bgImgfile,
      profileImgfile,
      user.id
    );

    updateVenueProfile(payload)
      .then(() => {
        showNotification({
          title: "Banner Updated",
          message: "Your venue banner has been updated successfully.",
          type: "success",
        });
        setFormData({
          venue_name: "",
          phone: "",
          email: "",
          address: "",
          website: "",
          linkedin: "",
          instagram: "",
        });
        setBackgroundImg(null);
        setProfileImg(null);
        setBgImgFile(null);
        setProfileImgFile(null);
        document
          .querySelectorAll('input[type="file"]')
          .forEach((input) => (input.value = ""));
        document
          .querySelectorAll('input[type="text"]')
          .forEach((input) => (input.value = ""));
      })
      .catch((err) => {
        console.error(err);
        showNotification({
          title: "Update Failed",
          message: "Something went wrong while updating the banner.",
          type: "danger",
        });
      });
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImageUpload(e, setBackgroundImg, setBgImgFile)
              }
              className="border p-2 w-full"
              placeholder="Background"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImageUpload(e, setProfileImg, setProfileImgFile)
              }
              className="border p-2 w-full"
              placeholder="Profile"
            />
            <input
              type="text"
              name="venue_name"
              onChange={handleChange}
              className="border p-2 w-full"
              placeholder="Venue Name"
            />
            <input
              type="text"
              name="phone"
              onChange={handleChange}
              className="border p-2 w-full"
              placeholder="Phone"
            />
          </div>

          <div className="space-y-4">
            <input
              type="text"
              name="email"
              onChange={handleChange}
              className="border p-2 w-full"
              placeholder="Email"
            />
            <input
              type="text"
              name="address"
              onChange={handleChange}
              className="border p-2 w-full"
              placeholder="Address"
            />
            <input
              type="text"
              name="website"
              onChange={handleChange}
              className="border p-2 w-full"
              placeholder="Website"
            />
            <input
              type="text"
              name="linkedin"
              onChange={handleChange}
              className="border p-2 w-full"
              placeholder="LinkedIn"
            />
            <input
              type="text"
              name="instagram"
              onChange={handleChange}
              className="border p-2 w-full"
              placeholder="Instagram"
            />
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

      <Dialog open={showBanner} onClose={handleEdit} as={Fragment}>
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl relative">
            <div className="relative h-60 w-full">
              {backgroundImg && (
                <img
                  src={backgroundImg}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex items-center px-8 py-6 text-white">
                {profileImg && (
                  <img
                    src={profileImg}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                )}

                <div className="ml-6 space-y-1">
                  <h2 className="text-2xl font-bold font-[Cinzel]">
                    {formData.venue_name}
                  </h2>
                  <div className="flex items-center gap-2 text-sm">
                    <FaMapMarkerAlt /> {formData.address}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaPhone /> {formData.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaEnvelope /> {formData.email}
                  </div>
                </div>

                <div className="ml-auto text-right">
                  <div className="flex flex-col items-end gap-2">
                    <button className="bg-[#e57373] text-white px-4 py-2 rounded-full hover:bg-[#d16262] flex items-center gap-2 shadow">
                      <IoMdChatbubbles /> Contact
                    </button>
                    <a
                      href="#"
                      className="text-white underline flex items-center hover:text-[#e3c27e]"
                    >
                      Share <FiShare2 className="ml-1" />
                    </a>
                  </div>

                  <div className="flex gap-3 mt-2 justify-end text-xl">
                    {formData.website && (
                      <a
                        href={formData.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white hover:text-yellow-300"
                      >
                        <FaGlobe />
                      </a>
                    )}
                    {formData.linkedin && (
                      <a
                        href={formData.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white hover:text-blue-400"
                      >
                        <FaLinkedin />
                      </a>
                    )}
                    {formData.instagram && (
                      <a
                        href={formData.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white hover:text-pink-400"
                      >
                        <FaInstagram />
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

export default VenueBanner;
