import { Routes, Route } from "react-router-dom";
import VenueSidebar from "../components/VenueSidebar";
import Vdashinner from "../components/Vdashinner";
import BookingRequest from "../Dashboard Components/BookingRequest";
import Slots from "../Dashboard Components/Slots";
import SlotRequest from "../Dashboard Components/SlotRequest";
import VenueSettings from "../Dashboard Components/VenueSettings";
import AddSlots from "../Dashboard Components/AddSlots";
import Products from "../Dashboard Components/Products";
import EditSlots from "../Dashboard Components/EditSlots";
import ReviewsOnMyProfile from "../Dashboard Components/ReviewsOnMyProfile"; // ✅ Reuse for venue
import VenueCoupons from "../Dashboard Components/VenueCoupons";
import VenueReports from "../Dashboard Components/VenueReports";
import VenueAnnouncements from "../Dashboard Components/VenueAnnouncements";
import VenueProfile from "../Dashboard Components/VenueProfile";

const VenueDashboard = () => {
  return (
    <div className="flex h-screen bg-white">
      <VenueSidebar activePage="dashboard" />
      <div className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Vdashinner />} />
          <Route path="/booking-request" element={<BookingRequest />} />
          <Route path="/slot-request" element={<SlotRequest />} />
          <Route path="/slots" element={<Slots />} />
          <Route path="/slots/add-slot" element={<AddSlots />} />
          <Route path="/slots/edit-slot/:id" element={<EditSlots />} />
          <Route path="/products" element={<Products />} />
          <Route path="/settings" element={<VenueSettings />} />
          <Route path="/coupons" element={<VenueCoupons />} />
          <Route path="/reports" element={<VenueReports />} />
          <Route path="/announcements" element={<VenueAnnouncements />} />
          <Route path="/profile" element={<VenueProfile />} />
          <Route
            path="/reviews"
            element={<ReviewsOnMyProfile profileType="venue" />}
          />{" "}
        </Routes>
      </div>
    </div>
  );
};

export default VenueDashboard;
