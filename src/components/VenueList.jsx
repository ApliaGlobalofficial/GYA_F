import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import {
  fetchVenuesByCountryName,
  fetchVenuesByLatLongRadius,
} from "../services/ApiService";
import { useNavigate } from "react-router-dom";
import { createPayloadSchema } from "../utilities/Utility";
import { Filter } from "lucide-react";

const customIcon = new L.Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  return null;
};

const VenueList = ({ routedPayload: initialRoutedPayload }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState([20.5937, 78.9629]);
  const [sortBy, setSortBy] = useState("default");
  const [range, setRange] = useState(150);
  const [venues, setVenues] = useState([]);
  const [ogVenues, setOgVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [filterOpen, setFilterOpen] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [typedLocationFilter, setTypedLocationfilter] = useState("");
  const debounceTimer = useRef(null);
  const [typedLocation, setTypedLocation] = useState("");

  const navigate = useNavigate();

  const handleSearch = (queryParam) => {
    const query = queryParam.toLowerCase();
    setSearchQuery(query);
    if (query === "") return setVenues(ogVenues);
    const filtered = ogVenues.filter(
      (venue) =>
        venue.venue_name.toLowerCase().includes(query) ||
        venue?.owner?.address?.toLowerCase().includes(query)
    );
    setVenues(filtered);
  };

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortBy(option);
    const sorted = [...venues];
    if (option === "Most Reviewed")
      sorted.sort((a, b) => b.total_reviews - a.total_reviews);
    else if (option === "Top Rated")
      sorted.sort((a, b) => b.average_rating - a.average_rating);
    else if (option === "Most Recent")
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    else sorted.sort((a, b) => b.venue_id - a.venue_id);
    setVenues(sorted);
  };

  const handleCardClick = (venueId) => {
    const venue = ogVenues.find((v) => v.venue_id === venueId);
    if (!venue) return alert("Venue not found!");
    const newPayload = createPayloadSchema(
      initialRoutedPayload?.artId,
      initialRoutedPayload?.artDetails,
      venue,
      initialRoutedPayload?.slotDetails
    );
    navigate(`/venue-profiles`, {
      state: { venue, routedPayload: newPayload },
    });
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationEnabled(true);
          setUserCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationEnabled(false);
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const country = localStorage.getItem("selectedCountry");
      if (!country) {
        window.dispatchEvent(new Event("triggerCountryDropdown"));
        return;
      }

      try {
        if (selectedSuggestion?.lat && selectedSuggestion?.lon) {
          const res = await fetchVenuesByLatLongRadius(
            selectedSuggestion.lat,
            selectedSuggestion.lon,
            range,
            page,
            limit
          );
          setOgVenues(res.data);
          setVenues(res.data);
        } else {
          const res = await fetchVenuesByCountryName(page, limit, country);
          setOgVenues(res.data);
          setVenues(res.data);
        }
      } catch (error) {
        console.error("Error fetching venue data:", error);
        const fallback = await fetchVenuesByCountryName(page, limit, country);
        setOgVenues(fallback.data);
        setVenues(fallback.data);
      }
    };

    fetchData();
  }, [page, selectedSuggestion, range]);

  const fetchCoordinates = async (cityName) => {
    try {
      const apiUrl = `${
        import.meta.env.VITE_GEOLOCATION_API_URL
      }/search?format=json&q=${encodeURIComponent(cityName)}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const clickClearFilter = () => {
    setSelectedSuggestion(null);
    handleSearch("");
    setRange(150);
    setTypedLocationfilter("");
  };

  useEffect(() => {
    if (typedLocation.trim() === "") return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchCoordinates(typedLocation);
    }, 500);
  }, [typedLocation]);

  return (
    <div className="bg-white min-h-screen px-6 py-8">
      {/* Header */}
      <h2 className="text-center text-[38px] font-semibold font-[Cinzel,sans-serif] text-[#2e2e2e] mb-2">
        Venue List
      </h2>
      <p className="text-center text-sm text-black mb-6">
        To find the nearest venue selling art, press the orange filter button
        below. Enter your destination or use the target icon to automatically
        detect your location.
      </p>

      {/* Map */}
      <div className="w-full max-w-6xl mx-auto mb-6 rounded-lg overflow-hidden shadow-xl">
        <MapContainer
          center={selectedLocation}
          zoom={11}
          className="w-full h-[300px] z-0"
        >
          <ChangeView center={selectedLocation} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {venues.map((venue, i) =>
            venue?.location?.latitude && venue?.location?.longitude ? (
              <Marker
                key={i}
                position={[venue.location.latitude, venue.location.longitude]}
                icon={customIcon}
              >
                <Popup>
                  <strong>{venue.venue_name}</strong>
                  <p>{venue?.owner?.address}</p>
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>

      {/* Filters */}
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center mb-4">
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="bg-[#FFBB33] text-black px-6 py-2 font-semibold font-[lato,sans-serif] hover:bg-[#f1c152] flex items-center gap-2"
        >
          <Filter size={18} /> Filter
        </button>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium font-[lato,sans-serif] text-gray-600">
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="border border-[#FFD580] px-3 py-2 rounded-md text-sm bg-white"
          >
            <option value="Most Recent">Most Recent</option>
            <option value="Most Reviewed">Most Reviewed</option>
            <option value="Top Rated">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="w-full max-w-6xl mx-auto bg-white border border-[#FFD580] rounded-md p-4 mb-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search Vendors"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="border border-[#FFD580] p-2 rounded-md bg-white"
            />
            <div className="relative">
              <input
                type="text"
                placeholder="Location"
                value={typedLocationFilter}
                onChange={(e) => {
                  setTypedLocation(e.target.value);
                  setTypedLocationfilter(e.target.value);
                  if (e.target.value === "") clickClearFilter();
                }}
                className="border border-[#FFD580] p-2 rounded-md bg-white w-full"
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-md max-h-60 overflow-auto mt-1">
                  {suggestions.map((item, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                      onClick={() => {
                        setTypedLocationfilter(item.display_name);
                        setSelectedSuggestion(item);
                        setSuggestions([]);
                      }}
                    >
                      {item.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-700">Radius {range}km</label>
              <input
                type="range"
                min="150"
                max="500"
                value={range}
                onChange={(e) => setRange(Number(e.target.value))}
                className="w-[150px]"
              />
            </div>
            <button
              onClick={clickClearFilter}
              className="bg-[#FFBB33] font-semibold text-black px-6 py-2"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Venue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {venues.map((venue) => (
          <div
            key={venue.venue_id}
            onClick={() => handleCardClick(venue.venue_id)}
            className="cursor-pointer bg-white border border-[#e0e0e0] shadow-xl hover:shadow-2xl rounded-lg overflow-hidden"
          >
            <div
              className="h-44 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${venue.venue_photo})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 p-4 text-white flex flex-col justify-end">
                <h3 className="text-lg font-[Cinzel]">{venue.venue_name}</h3>
                <p className="text-sm">{venue?.owner?.address}</p>
                <p className="text-sm">📞 {venue?.owner?.phone}</p>
              </div>
              <div className="absolute bottom-[-20px] right-4 bg-white rounded-full p-1 shadow-lg z-10">
                <img
                  src={
                    venue?.location_photo ||
                    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  }
                  alt="Logo"
                  className="w-12 h-12 rounded-full object-cover border border-white"
                />
              </div>
            </div>
            <div className="flex justify-start bg-white px-2 py-2 mt-6">
              <button className="bg-[#FFBB33] text-black rounded-full w-10 h-10 flex items-center justify-center text-lg">
                ➝
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center items-center gap-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-[#FFBB33] text-black px-4 py-2 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-[#FFBB33] text-black px-4 py-2 rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VenueList;
