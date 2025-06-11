import React, { useEffect, useState } from "react";
import { getPrivacyPolicy } from "../services/ApiService";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const [policyData, setPolicyData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const countryname = localStorage.getItem("selectedCountry");
        if (countryname) {
          const data = await getPrivacyPolicy(countryname);
          setPolicyData(data);
        } else {
          window.dispatchEvent(new Event("triggerCountryDropdown"));
        }
      } catch (error) {
        console.error("Failed to fetch privacy policy:", error);
      }
    };

    fetchPolicy();
  }, []);

  if (!policyData) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-10 bg-gradient-to-b from-[#F8E7C2] to-[#FDF8EA] text-gray-800">
      <h3 className="text-3xl font-bold font-[Cinzel] text-center mb-6">
        PRIVACY POLICY
      </h3>

      {policyData.map((policy, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-semibold font-[Sans-serif] mt-6">
            {policy.title}
          </h2>
          <p className="mb-4">{policy.content}</p>
        </div>
      ))}

      {/* Optionally add other sections like Preamble or Rights */}
      <h2 className="text-2xl font-semibold mt-6">YOUR RIGHTS</h2>
      <p className="mb-4">
        You have the right to access, rectify, restrict, and erase your data as
        permitted by law.
      </p>

      <p className="mb-4">For more details, please contact us at:</p>
      <p className="font-bold">support@getyourarts.com</p>
    </div>
  );
};

export default PrivacyPolicy;
