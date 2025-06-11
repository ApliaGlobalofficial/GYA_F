import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import productsBanner from "../assets/5.jpg";
import sampleImage from "../assets/1.jpg"; // Replace with your artwork image
import { jwtDecode } from "jwt-decode";
import {fetchAllSlotRequestsByVenueUserId} from  "../services/ApiService"
import {  useNavigate } from "react-router-dom";
import { getCurrencySymbolByCountry,getCountryNameByUserId } from "../utilities/Utility";
const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [slotRequests, setSlotRequests] = useState([]);
  const [filteredSlotRequests, setFilteredSlotRequests] = useState([]);
  const [userCountries, setUserCountries] = useState({});

  const filterByArtistName = (query) => {
    setSearchQuery(query);
    console.log("search query is ", query);
    if( query == null || query == ""){
      setFilteredSlotRequests(slotRequests) ;
    }
    else{
      const filteredData = slotRequests.filter((item) =>
        item.art.title.toLowerCase().includes(query.toLowerCase()) ||
        item.art.art_description?.toLowerCase().includes(query.toLowerCase()) 
      );
      setFilteredSlotRequests(filteredData);
    }


  }


  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token is", token);

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token", decoded);
        setUserId(decoded.user_id);
      } catch {
        alert("Session expired. Login again.");
        navigate("/login");
      }
    } else {
      alert("Login required.");
      navigate("/login");
    }
  }, [navigate]); // Run only once when the component mounts

  useEffect(() => {
    if (userId) {
      fetchAllSlotRequestsByVenueUserId(userId).then((backendResponse) => {
        console.log("response is ,", backendResponse);
        const filteredResponse = backendResponse.filter(
          (item) => item.request_status == 2
        );
        console.log("filtered response ",filteredResponse) ;
        setSlotRequests(filteredResponse);
        setFilteredSlotRequests(filteredResponse);
      });
    }
  }, [userId]);

  useEffect(() => {
        const fetchAllCountries = async () => {
          const countryMap = { ...userCountries };
    
          await Promise.all(
            filteredSlotRequests.map(async (prod) => {
              const userId = prod.art.user_id;
              if (userId && !countryMap[userId]) {
                const country = await getCountryNameByUserId(userId);
                countryMap[userId] = country;
              }
            })
          );
    
          setUserCountries(countryMap);
        };
    
        if (filteredSlotRequests?.length > 0) {
          fetchAllCountries();
        }
      }, [filteredSlotRequests]); 
  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Banner */}
      <div className="relative mb-8">
        <img
          src={productsBanner}
          alt="Products Banner"
          className="w-full h-64 object-cover rounded-2xl border-4 border-[#e3c27e] shadow-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl flex items-center justify-center">
          <h1 className="text-white text-4xl font-[Cinzel] font-bold drop-shadow-lg">
            My Products
          </h1>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-end items-center mb-6">
        <div className="flex items-center bg-white border border-[#e3c27e] px-4 py-2 rounded-lg shadow-md">
          <Search className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchQuery}
            onChange={(e) => filterByArtistName(e.target.value)}
            className="outline-none bg-transparent text-[#2c3e50]"
          />
        </div>
      </div>

      {/* Product Grid (2 Cards per Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {filteredSlotRequests.map((product) => (
          <div
            key={product.art.id}
            className="bg-white border border-[#e3c27e] rounded-xl shadow-lg p-6 flex flex-col md:flex-row"
          >
            {/* Left Section - Image & Artist Info */}
            <div className="md:w-2/4 flex flex-col items-center border-r border-dashed pr-6">
              <img
                src={product.art.cover_img}
                alt="Artwork"
                className="w-full h-48 object-cover rounded-lg border mb-4"
              />
              <div className="text-center">
                <h2 className="text-lg font-semibold text-[#2c3e50]">
                  {product?.art.title}
                </h2>

                
                <p className="text-sm text-gray-600">{product?.phone}</p>
                <a
                  href={"/artwork-profile/"+product.art.id}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-blue-600 hover:underline text-sm"
                >
                  View Catalog
                </a>
              </div>
            </div>

            {/* Right Section - Details */}
            <div className="md:w-2/4 pl-0 md:pl-6 mt-6 md:mt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <Info label="Venue Name" value={product.venue_name} /> */}
              <Info label="Product Description" value={product?.art.art_description} />

              <Info label="Slot" value={product?.slot.slot_name} />
              <Info label="Dimensions" value={product?.slot.slot_dimension} />
              {/* <Info label="Medium" value={product.art_medium} />
              <Info label="Mounted" value={product.is_art_mounted == 1 ? "Yes":"No"} /> */}
              <Info label="Art Price" value= {product?.art.currency_symbol  + product?.art.price} />
              <Info label="Art Discounted Price" value={product?.art.currency_symbol  + product?.art.discounted_price}  />
              <Info label="Slot Price" value= {product?.slot.currency_symbol + product?.slot.slot_price} />
              <Info label="Handling Charges" value={product.currency_symbol +product.service_charge} />
              {/* <Info label="Handling" value={product.service_charge} /> */}
              {/* <Info
                label="Status"
                value={product.status}
                valueClass={`font-bold ${
                  product.status === "Approved"
                    ? "text-green-600"
                    : product.status === "Pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              /> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Info = ({ label, value, valueClass = "text-[#2c3e50]" }) => (
  <div>
    <p className="text-sm text-gray-600">{label}</p>
    <p className={`text-base font-semibold ${valueClass}`}>{value}</p>
  </div>
);

export default Products;
