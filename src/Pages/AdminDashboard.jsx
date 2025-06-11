import React, { useState, useEffect } from "react";
import { SlotGridForAdmin } from "../Dashboard Components/SlotGridForAdmin";
import { VenueGridForAdmin } from "../Dashboard Components/VenueGridForAdmin";
import { ArtGridForAdmin } from "../Dashboard Components/ArtGridForAdmin";
import SlotMaster from "../Dashboard Components/SlotMaster";
import AdminSidebar from "../components/AdminSidebar";
import OurPolicies from "../Dashboard Components/OurPolicies";
import OurTNCPlatform from "../Dashboard Components/OurTNCPlatform";
import UpdateNews from "../Dashboard Components/UpdateNews";
import CountryMaster from "../Dashboard Components/CountryMaster";
import SlotRequestForAdmin from "../Dashboard Components/SlotRequestForAdmin";
import ArtsRequestForAdmin from "../Dashboard Components/ArtsRequestForAdmin";
import AdminTickets from "../Dashboard Components/AdminTickets";
import {
  getSlotHeadersForAdmin,
  getVenueHeadersForAdmin,
  getArtsHeadersForAdmin,
} from "../utilities/Utility";

const AdminDashboard = () => {
  const [selectedComponent, setSelectedComponent] = useState("arts");
  const [gridColumns, setGridColumns] = useState([]);

  useEffect(() => {
    switch (selectedComponent) {
      case "arts":
        setGridColumns(getArtsHeadersForAdmin());
        break;
      case "slot":
        setGridColumns(getSlotHeadersForAdmin());
        break;
      case "venue":
        setGridColumns(getVenueHeadersForAdmin());
        break;
      default:
        setGridColumns([]);
    }
  }, [selectedComponent]);

  const renderComponent = () => {
    switch (selectedComponent) {
      case "arts":
        return <ArtGridForAdmin columns={gridColumns} />;
      // case "slot":
      //   return <SlotGridForAdmin columns={gridColumns} />;
      case "slotrequests":
        return <SlotRequestForAdmin />;
      case "artsrequests":
        return <ArtsRequestForAdmin />;
      case "venue":
        return <VenueGridForAdmin columns={gridColumns} />;
      case "support":
        return <AdminTickets />;
      // case "slotmaster":
      //   return <SlotMaster />;
      case "ourpolicies":
        return <OurPolicies />;
      case "tncplatform":
        return <OurTNCPlatform />;
      case "updatenews":
        return <UpdateNews />;
      case "countrymaster":
        return <CountryMaster />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <AdminSidebar
        selectedComponent={selectedComponent}
        setSelectedComponent={setSelectedComponent}
      />
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-3xl font-bold font-[Cinzel] text-center mb-8 text-[#333]">
          ADMIN DASHBOARD
        </h2>
        {renderComponent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
