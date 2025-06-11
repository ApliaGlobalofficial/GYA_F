import React, { useState } from "react";
import Contactinner from "../components/Contactinner";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    msg: "",
    category: "General Inquiry",
  });

  const [submissionStatus, setSubmissionStatus] = useState({
    success: false,
    error: false,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus({ success: false, error: false, message: "" });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}contacts`,
        formData
      );

      setSubmissionStatus({
        success: true,
        error: false,
        message: "Message sent successfully!",
      });

      // Reset form
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        msg: "",
        category: "General Inquiry",
      });
    } catch (error) {
      setSubmissionStatus({
        success: false,
        error: true,
        message: error.response?.data?.message || "Failed to send message",
      });
    }
  };

  return (
    <div>
      <Contactinner
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        status={submissionStatus}
      />
    </div>
  );
};

export default Contact;
