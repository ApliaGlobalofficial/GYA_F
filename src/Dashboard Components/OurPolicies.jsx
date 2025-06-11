import React, { useEffect, useState } from "react";
import { getCountryList, getPrivacyPolicy, addPrivacyPolicy } from "../services/ApiService";

const OurPolicies = () => {
  const [policies, setPolicies] = useState([]);         // Existing policies
  const [newPolicies, setNewPolicies] = useState([]);    // New policies to add
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
      fetchPolicies();
      setNewPolicies([]); // Reset new policies on country change
    } else {
      setPolicies([]);
      setNewPolicies([]);
    }
  }, [country]);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await getPrivacyPolicy(country);
      setPolicies(response || []);
    } catch (error) {
      console.error("Error fetching policies:", error);
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  const handleNewPolicyChange = (index, field, value) => {
    const updatedNewPolicies = [...newPolicies];
    updatedNewPolicies[index][field] = value;
    setNewPolicies(updatedNewPolicies);
  };

  const handleAddNewSection = () => {
    setNewPolicies((prev) => [...prev, { title: "", content: "", country }]);
  };

  const handleRemoveNewSection = (index) => {
    const updatedNewPolicies = newPolicies.filter((_, i) => i !== index);
    setNewPolicies(updatedNewPolicies);
  };

  const handleSaveNewPolicies = async () => {
    try {
      if (!country) {
        alert("Please select a country first!");
        return;
      }
      if (newPolicies.length === 0) {
        alert("No new policies to save!");
        return;
      }
      await addPrivacyPolicy(newPolicies);
      alert("New Privacy Policies saved successfully!");
      fetchPolicies(); // Refresh
      setNewPolicies([]); // Clear after save
    } catch (error) {
      console.error("Error saving new policies:", error);
      alert("Failed to save new policies.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Manage Privacy Policies</h2>

      {/* Country Dropdown */}
      <div className="flex justify-center mb-10">
        <div>
          <label className="block mb-2 text-gray-600 font-semibold text-center">Select Country:</label>
          <select
            value={country}
            onChange={handleCountryChange}
            className="border p-2 rounded-md w-full"
          >
            <option value="">Choose a Country</option>
            {countryList.map((c) => (
              <option key={c.id} value={c.countryname}>
                {c.countryname}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Existing Policies */}
      {country && (
        <>
          <div className="mb-14">
            <h3 className="text-2xl font-bold mb-4 text-gray-700">Existing Privacy Policies</h3>

            {policies.length === 0 ? (
              <div className="text-center text-gray-500">No existing policies found.</div>
            ) : (
              policies.map((policy, index) => (
                <div key={index} className="mb-6 p-6 border border-gray-300 rounded-lg shadow-sm bg-gray-50">
                  <h4 className="text-lg text-gray-800 mb-2">
                    <strong>Title</strong>: <br /> {policy.title}
                  </h4>
                  <p className="text-gray-600">
                    <strong>Content</strong>: <br /> {policy.content}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Add New Policies Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-700">Add New Privacy Policies</h3>

            {newPolicies.map((policy, index) => (
              <div key={index} className="relative mb-10 p-6 border border-gray-300 rounded-lg shadow-sm">
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
                  value={policy.title}
                  onChange={(e) => handleNewPolicyChange(index, "title", e.target.value)}
                  className="w-full mb-3 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 font-semibold text-gray-700"
                />
                <textarea
                  placeholder="Content"
                  value={policy.content}
                  onChange={(e) => handleNewPolicyChange(index, "content", e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded p-3 resize-y focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            ))}

            {/* Action Buttons for New Policies */}
            <div className="flex justify-between mt-10">
              <button
                onClick={handleAddNewSection}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded transition duration-300"
              >
                Add New Section
              </button>

              {newPolicies.length > 0 && (
                <button
                  onClick={handleSaveNewPolicies}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded transition duration-300"
                >
                  Save New Policies
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OurPolicies;
