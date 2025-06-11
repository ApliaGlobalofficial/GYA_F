import { Routes, Route } from "react-router-dom";
import ArtistSidebar from "../components/ArtistSidebar";
import Adashinner from "../components/Adashinner";
import Artworks from "../Dashboard Components/Artworks"; // ✅ Import Artworks
import AddArtwork from "../Dashboard Components/AddArtwork"; // ✅ Import AddArtwork
import ArtistBanner from "../Dashboard Components/ArtistBanner";
import ArtistSettings from "../Dashboard Components/ArtistSettings";
import ReviewsOnMyProfile from "../Dashboard Components/ReviewsOnMyProfile";
import ArtistCoupons from "../Dashboard Components/ArtistCoupons";
import ArtistReports from "../Dashboard Components/ArtistReports";
import ArtistAnnouncements from "../Dashboard Components/ArtistAnnouncements";

const ArtistDashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Sticky */}
      <div className="sticky top-0 h-screen bg-gradient-to-b from-[#F8E7C2] to-[#FDF8EA]">
        <ArtistSidebar activePage="dashboard" />
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto bg-white p-6">
        <Routes>
          <Route path="/" element={<Adashinner />} />
          <Route path="/artworks/*" element={<Artworks />} />
          <Route path="/artworks/add-artwork" element={<AddArtwork />} />
          <Route path="/reviews" element={<ReviewsOnMyProfile />} />
          <Route path="/artist-banner" element={<ArtistBanner />} />
          <Route path="/settings" element={<ArtistSettings />} />
          <Route path="/coupons" element={<ArtistCoupons />} />
          <Route path="/reports" element={<ArtistReports />} />
          <Route path="/announcements" element={<ArtistAnnouncements />} />
        </Routes>
      </div>
    </div>
  );
};

export default ArtistDashboard;
