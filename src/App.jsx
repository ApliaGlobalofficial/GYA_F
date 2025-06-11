import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Contact from "./Pages/Contact";
import SignIn from "./Pages/SignIn";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import ChooseCountry from "./Pages/ChooseCountry";
import ShopArt from "./Pages/ShopArt";
import ArtistDashboard from "./Pages/ArtistDashboard";
import VenueDashboard from "./Pages/VenueDashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import CustomerDashboard from "./Pages/CustomerDashboard";
import AddArtwork from "./Dashboard Components/AddArtwork";
import AddSlots from "./Dashboard Components/AddSlots";

import RegisterRole from "./Pages/RegisterRole";
import Artworks from "./Dashboard Components/Artworks";
import EditArtwork from "./Dashboard Components/EditArtwork";
import FindArtwork from "./Dashboard Components/FindArtwork";
import FindVenue from "./Dashboard Components/FindVenue";
import BookingRequest from "./Dashboard Components/BookingRequest";
import Products from "./Dashboard Components/Products";
import Slots from "./Dashboard Components/Slots";
import SignInCustomer from "./components/SignIn-Customer";
import SignInVenue from "./components/SignIn-Venue";
import SignInArtist from "./components/SignIn-Artist";
import RegisterArtist from "./components/RegisterArtist";
import RegisterVenue from "./components/RegisterVenue";
import RegisterCustomer from "./components/RegisterCustomer";
import "./index.css";
import ArtistProfiles from "./Dashboard Components/ArtistProfiles";
import ArtworkProfile from "./Dashboard Components/ArtworkProfile";
import ArtistBanner from "./Dashboard Components/ArtistBanner";
import VenueProfiles from "./Dashboard Components/VenueProfiles";
import TNCPlatform from "./Pages/TNCPlatform";
import BuyArtwork from "./Dashboard Components/BuyArtwork";
import UserSignIn from "./components/UserSignIn";
import UpdateNews from "./Dashboard Components/UpdateNews";
import SlotRequest from "./Dashboard Components/SlotRequest";
import PaymentSuccess from "./Dashboard Components/PaymentSuccess";
import ResetPassword from "./components/ResetPassword";
import ArtistSettings from "./Dashboard Components/ArtistSettings";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import RoleProtectedRoute from "./guard/RoleProtectedRoute";
import Unauthorized from "./Pages/Unauthorized";
import { getLocationData } from "./services/ApiService";
function AppContent() {
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [userCountry, setUserCountry] = useState(
    localStorage.getItem("selectedCountry") || ""
  );

  useEffect(() => {
    if (
      !localStorage.getItem("selectedCountry") &&
      !localStorage.getItem("locationAccess")
    ) {
      setShowPopup(true);
    }
  }, []);

  // const requestLocation = () => {
  //   try {
  //     navigator.geolocation.getCurrentPosition(
  //       async (position) => {
  //         const { latitude, longitude } = position.coords;
  //         let apiUrl = `${
  //           import.meta.env.VITE_GEOLOCATION_API_URL
  //         }reverse?lat=${latitude}&lon=${longitude}&format=json`;
  //         let userLocationData = await getLocationData(apiUrl);
  //         if (userLocationData?.address.country) {
  //           setUserCountry(userLocationData?.address.country);
  //           localStorage.setItem(
  //             "selectedCountry",
  //             userLocationData?.address.country
  //           );
  //         }
  //         localStorage.setItem("locationAccess", "granted");
  //         setShowPopup(false);
  //       },
  //       (err) => {
  //         console.error("Geolocation Error:", err);
  //         setUserCountry("Location Not Allowed");
  //         setShowPopup(false);
  //       }
  //     );
  //   } catch (error) {
  //     console.warn("Geolocation error:", error);
  //     localStorage.setItem("locationAccess", "denied");
  //     setShowPopup(false);
  //   }
  //   setShowPopup(false);
  // };

  const hideNavbarFooter = location.pathname.startsWith("/admin-dashboard");

  const hideFooterOnAddArtwork =
    location.pathname === "/artist-dashboard/artworks/add-artwork";

  return (
    <div
      className={`flex flex-col min-h-screen bg-gray-100 ${
        !hideNavbarFooter ? "pt-[120px]" : "pt-0"
      }`}
    >
      <ReactNotifications />
      <ToastContainer position="top-center" />
      {!hideNavbarFooter && (
        <Navbar userCountry={userCountry} setShowPopup={setShowPopup} />
      )}
      {/* ✅ Location access popup
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4">
              Enable Location for Personalized Content
            </h2>
            <button
              onClick={requestLocation}
              className="bg-[#e3c27e] text-black px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Enable Location
            </button>
          </div>
        </div>
      )} */}
      {/* ✅ Page Routing */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route
          path="/choose-country"
          element={<ChooseCountry setUserCountry={setUserCountry} />}
        />
        <Route path="/shop-art" element={<ShopArt />} />
        <Route path="/useof-platform" element={<TNCPlatform />} />
        <Route
          path="/update-news"
          element={
            <RoleProtectedRoute allowedRoles={["Admin"]}>
              <UpdateNews />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/artist-dashboard/*"
          element={
            <RoleProtectedRoute allowedRoles={["Artist"]}>
              <ArtistDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/artist-dashboard/artworks/editartwork/:id"
          element={
            <RoleProtectedRoute allowedRoles={["Artist"]}>
              <EditArtwork />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <RoleProtectedRoute allowedRoles={["Artist"]}>
              <ArtistSettings />
            </RoleProtectedRoute>
          }
        />
        {/* <Route path="/find-venue" element={<FindVenue />} /> */}
        <Route
          path="/find-artwork"
          element={
            <RoleProtectedRoute allowedRoles={["Venue"]}>
              <FindArtwork />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/artist-profiles"
          element={
            <RoleProtectedRoute allowedRoles={["Artist", "Venue"]}>
              <ArtistProfiles />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/artwork-profile/:id"
          element={
            <RoleProtectedRoute allowedRoles={["Artist", "Venue"]}>
              <ArtworkProfile />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/artist-banner"
          element={
            <RoleProtectedRoute allowedRoles={["Artist"]}>
              <ArtistBanner />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/venue-dashboard/*"
          element={
            <RoleProtectedRoute allowedRoles={["Venue"]}>
              <VenueDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/booking-request"
          element={
            <RoleProtectedRoute allowedRoles={["Venue"]}>
              <BookingRequest />
            </RoleProtectedRoute>
          }
        />
        <Route path="/slot-request" element={<SlotRequest />} />
        <Route path="/venue-profiles" element={<VenueProfiles />} />
        <Route
          path="/slots"
          element={
            <RoleProtectedRoute allowedRoles={["Venue"]}>
              <Slots />
            </RoleProtectedRoute>
          }
        />
        <Route path="/buy-artwork/:artId" element={<BuyArtwork />} />
        <Route
          path="/admin-dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />

        {/* ✅ Customer Dashboard */}
        <Route
          path="/customer-dashboard/*"
          element={
            <RoleProtectedRoute allowedRoles={["Customer"]}>
              <CustomerDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route path="/signin-customer" element={<SignInCustomer />} />
        <Route path="/signin" element={<SignInVenue />} />
        <Route path="/signin-artist" element={<SignInArtist />} />
        <Route path="/user-signin" element={<UserSignIn />} />
        <Route path="/register-role" element={<RegisterRole />} />
        <Route path="/register-artist" element={<RegisterArtist />} />
        <Route path="/register-venue" element={<RegisterVenue />} />
        <Route path="/register-customer" element={<RegisterCustomer />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
      {/* ✅ Conditionally render Footer */}
      {!hideNavbarFooter && !hideFooterOnAddArtwork && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
