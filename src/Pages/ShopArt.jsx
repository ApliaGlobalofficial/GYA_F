import React from "react";
import VenueList from "../components/VenueList"; // Import VenueList
import { useLocation } from "react-router-dom";

const ShopArt = () => {
  const location = useLocation(); 
  const {routedPayload} = location.state || {};
  return (
    <div className="min-h-screen bg-white py-10">
      <VenueList routedPayload={routedPayload}/> {/* Rendering VenueList inside ShopArt */}
    </div>
  );
};

export default ShopArt;

