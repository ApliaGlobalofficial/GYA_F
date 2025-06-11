import React, { useEffect, useState } from "react";
import {
  getCountryList,
  addTermsConditions,
  getTermsConditions,
} from "../services/ApiService";

const OurTNCPlatform = () => {
  const [terms, setTerms] = useState([]); // Existing T&Cs
  const [newTerms, setNewTerms] = useState([]); // New T&Cs to add
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [countryList, setCountryList] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await getCountryList();
        setCountryList(response);
      } catch (error) {
        console.error("Error fetching country list:", error);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (country) {
      fetchTerms();
      setNewTerms([]); // Reset new terms when changing country
    } else {
      setTerms([]);
      setNewTerms([]);
    }
  }, [country]);

  const fetchTerms = async () => {
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

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  const handleNewTermChange = (index, field, value) => {
    const updatedNewTerms = [...newTerms];
    updatedNewTerms[index][field] = value;
    setNewTerms(updatedNewTerms);
  };

  const handleAddNewSection = () => {
    setNewTerms((prev) => [...prev, { title: "", content: "", country }]);
  };

  const handleRemoveNewSection = (index) => {
    const updatedNewTerms = newTerms.filter((_, i) => i !== index);
    setNewTerms(updatedNewTerms);
  };

  const handleSaveNewTerms = async () => {
    try {
      if (!country) {
        alert("Please select a country first!");
        return;
      }
      if (newTerms.length === 0) {
        alert("No new T&Cs to save!");
        return;
      }
      await addTermsConditions(newTerms);
      alert("New Terms saved successfully!");
      fetchTerms(); // Refresh existing terms
      setNewTerms([]); // Clear newly added terms after saving
    } catch (error) {
      console.error("Error saving new terms:", error);
      alert("Failed to save new terms.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="p-6 bg-[#fffcea] rounded shadow-md max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Manage Terms and Conditions
      </h2>

      {/* Country Dropdown */}
      <div className="flex justify-center mb-10">
        <div>
          <label className="block mb-2 text-gray-600 font-semibold text-center">
            Select Country:
          </label>
          <select
            value={country}
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
        </div>
      </div>

      {/* Existing Terms */}
      {country && (
        <>
          <div className="mb-14">
            <h3 className="text-2xl font-bold mb-4 text-gray-700">
              Existing Terms & Conditions
            </h3>

            {terms.length === 0 ? (
              <div className="text-center text-gray-500">
                No existing terms found.
              </div>
            ) : (
              terms.map((term, index) => (
                <div
                  key={index}
                  className="mb-6 p-6 border border-gray-300 rounded-lg shadow-sm bg-gray-50"
                >
                  <h4 className=" text-lg text-gray-800 mb-2">
                    {" "}
                    <strong> Title</strong> : <br /> {term.title}
                  </h4>
                  <p className="text-gray-600">
                    {" "}
                    <strong> Content </strong> : <br /> {term.content}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Add New Terms Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-700">
              Add New Terms & Conditions
            </h3>

            {newTerms.map((term, index) => (
              <div
                key={index}
                className="relative mb-10 p-6 border border-gray-300 rounded-lg shadow-sm"
              >
                {/* Remove New Section */}
                <button
                  onClick={() => handleRemoveNewSection(index)}
                  className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-md"
                  title="Remove Section"
                >
                  ✖
                </button>

                <input
                  type="text"
                  placeholder="Title"
                  value={term.title}
                  onChange={(e) =>
                    handleNewTermChange(index, "title", e.target.value)
                  }
                  className="w-full mb-3 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-gray-700"
                />
                <textarea
                  placeholder="Content"
                  value={term.content}
                  onChange={(e) =>
                    handleNewTermChange(index, "content", e.target.value)
                  }
                  rows={4}
                  className="w-full border border-gray-300 rounded p-3 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            {/* Action Buttons for New Terms */}
            <div className="flex justify-between mt-10">
              <button
                onClick={handleAddNewSection}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded transition duration-300"
              >
                Add New Section
              </button>

              {newTerms.length > 0 && (
                <button
                  onClick={handleSaveNewTerms}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded transition duration-300"
                >
                  Save New Terms
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OurTNCPlatform;
