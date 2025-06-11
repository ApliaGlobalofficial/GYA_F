import React, { useState, useEffect, Fragment } from "react";
import { Dialog } from "@headlessui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  createCountry,
  deleteCountry,
  updateCountry,
  getCountryList,
} from "../services/ApiService";

const CountryMaster = () => {
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({ countryname: "", countrycode: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await getCountryList();
      console.log("Fetched countries:", response);
      setCountries(response);
    } catch (error) {
      alert("Error fetching countries");
      console.error("Error fetching countries:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCountry = async (e) => {
    e.preventDefault();
    if (!formData.countryname || !formData.countrycode) {
      alert("Both fields are required");
      return;
    }

    try {
      const res = await createCountry(formData);
      setCountries([...countries, res]);
      setFormData({ countryname: "", countrycode: "" });
    } catch (error) {
      alert("Error adding country");
      console.error("Failed to add country:", error);
    }
  };

  const handleEdit = (id) => {
    const countryToEdit = countries.find((country) => country.id === id);
    setEditId(id);
    setFormData({
      countryname: countryToEdit.countryname,
      countrycode: countryToEdit.countrycode,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleUpdateCountry = async (e) => {
    e.preventDefault();
    try {
      await updateCountry(editId, formData);
      const updatedCountries = countries.map((country) =>
        country.id === editId ? { ...country, ...formData } : country
      );
      setCountries(updatedCountries);
      setFormData({ countryname: "", countrycode: "" });
      setIsEditing(false);
      setShowModal(false);
    } catch (error) {
      alert("Error updating country");
      console.error("Failed to update country:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCountry(id);
      setCountries(countries.filter((country) => country.id !== id));
      alert("Country deleted successfully");
    } catch (error) {
      console.error("Failed to delete country:", error);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-8 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto mb-12 border rounded-xl shadow-lg bg-white overflow-hidden">

        {/* Form */}
        <form
          onSubmit={isEditing ? handleUpdateCountry : handleAddCountry}
          className="bg-white border border-[#e3c27e] p-6 rounded-lg shadow-lg mb-6"
        >
          <h2 className="text-2xl font-bold text-[#000000] mb-4 text-center">
            {isEditing ? "EDIT COUNTRY" : "ADD NEW COUNTRY"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="countryname"
              placeholder="Enter Country Name"
              value={formData.countryname}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
            <input
              type="text"
              name="countrycode"
              placeholder="Enter Country Code"
              value={formData.countrycode}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-black text-[#e3c27e] font-bold py-2 px-4 rounded transition"
          >
            {isEditing ? "Update Country" : "Add Country"}
          </button>
        </form>

        {/* Table */}
        <div className="bg-white p-6 shadow-lg border border-[#e3c27e] rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-[#2c3e50]">Country List</h3>
          {countries.length === 0 ? (
            <p className="text-gray-500 text-center">No countries added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white text-[#2c3e50]">
                    <th className="border border-[#e3c27e] px-6 py-3 text-sm font-bold uppercase">Country Name</th>
                    <th className="border border-[#e3c27e] px-6 py-3 text-sm font-bold uppercase">Country Code</th>
                    <th className="border border-[#e3c27e] px-6 py-3 text-sm font-bold uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {countries.map((country) => (
                    <tr key={country.id} className="text-[#2c3e50] bg-white hover:bg-[#f9f9f9] transition-colors duration-300">
                      <td className="border border-[#e3c27e] px-6 py-3">{country.countryname}</td>
                      <td className="border border-[#e3c27e] px-6 py-3">{country.countrycode}</td>
                      <td className="border border-[#e3c27e] px-6 py-3">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(country.id)}
                            className="flex items-center gap-1 px-3 py-1 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(country.id)}
                            className="flex items-center gap-1 px-3 py-1 rounded-md text-white bg-red-600 hover:bg-red-700 transition"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        <Dialog open={showModal} onClose={() => setShowModal(false)} as={Fragment}>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Dialog.Panel className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
              <Dialog.Title className="text-lg font-semibold mb-4">Edit Country</Dialog.Title>
              <form onSubmit={handleUpdateCountry} className="space-y-4">
                <input
                  type="text"
                  name="countryname"
                  placeholder="Country Name"
                  value={formData.countryname}
                  onChange={handleChange}
                  className="border border-gray-300 rounded p-2 w-full"
                />
                <input
                  type="text"
                  name="countrycode"
                  placeholder="Country Code"
                  value={formData.countrycode}
                  onChange={handleChange}
                  className="border border-gray-300 rounded p-2 w-full"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 font-semibold text-black px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#e3c27e] font-semibold text-black px-4 py-2 rounded hover:bg-[#c8a954]"
                  >
                    Save
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default CountryMaster;
