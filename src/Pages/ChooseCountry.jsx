import React, { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { getCountryList } from "../services/ApiService"; // Adjust the import path as needed
import { getCurrenyDetailsByCountryName } from "../services/ApiService";
const ChooseCountry = ({ setUserCountry }) => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(true); // ✅ Show popup initially

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const saveCountry = () => {
    if (selectedCountry) {
      localStorage.setItem("selectedCountry", selectedCountry);
      getCurrenyDetailsByCountryName(selectedCountry).then(res  => {
        localStorage.setItem("currency", JSON.stringify(res));
      }).catch(ex => console.error(ex));
      setUserCountry(selectedCountry);
      setIsPopupVisible(false); // ✅ Hide popup after selection
      navigate("/"); // ✅ Redirect to home
    }
  };
  const [countryList, setCountryList] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await getCountryList(); // Replace with your API endpoint
        console.log("Country List:", response); // Log the country list
        setCountryList(response);
      } catch (error) {
        console.error("Error fetching country list:", error);
      }
    };

    fetchCountries();
  }, []);
  return (
    <>
      {/* ✅ Background Blur Effect */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50">
          {/* ✅ Popup Container */}
          <div className="bg-[#e3c27e] text-black p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-2xl font-bold mb-4">Select Your Country</h2>
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              className="border p-2 rounded-md w-full"
            >
              <option value="">Choose a Country</option>
              {countryList.map((country) => (
                <option key={country.id} value={country.countryname}>
                  {country.countryname}
                </option>
              ))}
            </select>
            <button
              onClick={saveCountry}
              className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 w-full"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChooseCountry;
