import React, { useEffect, useState } from "react";
import { getTermsConditions } from "../services/ApiService"; // assuming your API service is ready
import { useNavigate } from "react-router-dom";

const TNCPlatform = () => {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const countryname = localStorage.getItem("selectedCountry");
    if (countryname) {
      fetchTerms(countryname);
    } else {
      window.dispatchEvent(new Event("triggerCountryDropdown"));
    }
  }, []);

  const fetchTerms = async (country) => {
    try {
      setLoading(true);
      const response = await getTermsConditions(country);
      setTerms(response || []);
    } catch (error) {
      console.error("Error fetching terms:", error);
      setTerms([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-10 font-[Cinzel]">
        Terms and Conditions
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        {loading ? (
          <div className="text-center text-gray-500">Loading terms...</div>
        ) : terms.length > 0 ? (
          terms.map((term, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {term.title}
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {term.content}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">
            No Terms & Conditions available for this country.
          </div>
        )}
      </div>
    </div>
  );
};

export default TNCPlatform;
