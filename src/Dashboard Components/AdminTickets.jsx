import React, { useEffect, useState } from "react";
import { fetchSupportTicketForAdmin } from "../services/ApiService";

const AdminTickets = () => {
  const [contacts, setContacts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const limit = 10;

  useEffect(() => {
    fetchContacts(page);
  }, [page]);

  const fetchContacts = async (page) => {
    try {
      const res = await fetchSupportTicketForAdmin(page, limit);
      console.log("ticket response", res);
      setContacts(res.data);
      setTotal(res.total);
    } catch (error) {
      console.error("Error fetching contacts", error);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold font-[Cinzel] text-[#000000]">
          SUPPORT TICKETS
        </h2>
      </div>

      <div className="bg-white p-6 shadow-lg rounded-lg border border-[#e3c27e]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#ffe974] text-[#000000]">
                <th className="border border-[#7a7a7a7a] px-6 py-3 text-sm font-bold uppercase text-left">#</th>
                <th className="border border-[#7a7a7a7a] px-6 py-3 text-sm font-bold uppercase text-left">Name</th>
                <th className="border border-[#7a7a7a7a] px-6 py-3 text-sm font-bold uppercase text-left">Email</th>
                <th className="border border-[#7a7a7a7a] px-6 py-3 text-sm font-bold uppercase text-left">Category</th>
                <th className="border border-[#7a7a7a7a] px-6 py-3 text-sm font-bold uppercase text-left">Message</th>
                <th className="border border-[#7a7a7a7a] px-6 py-3 text-sm font-bold uppercase text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-center text-red-600 font-semibold">
                    No Tickets Found
                  </td>
                </tr>
              ) : (
                contacts.map((contact, idx) => (
                  <tr
                    key={contact.id}
                    className={idx % 2 === 0 ? "bg-[#fffcea]" : "bg-white"}
                  >
                    <td className="border border-[#e3c27e] px-4 py-3">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td className="border border-[#e3c27e] px-4 py-3">
                      {contact.firstname} {contact.lastname}
                    </td>
                    <td className="border border-[#e3c27e] px-4 py-3">{contact.email}</td>
                    <td className="border border-[#e3c27e] px-4 py-3">{contact.category}</td>
                    <td className="border border-[#e3c27e] px-4 py-3 max-w-xs truncate">
                      {contact.msg.slice(0, 25)}...
                      <button
                        onClick={() => setSelectedMessage(contact.msg)}
                        className="ml-2 text-blue-600 underline text-sm"
                      >
                        View
                      </button>
                    </td>
                    <td className="border border-[#e3c27e] px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          contact.status === 0
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        {contact.status === 0 ? "Pending" : "Mail Sent "}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 bg-white py-2 flex justify-between items-center border-t border-gray-300 rounded-b-lg px-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-[#2c3e50] font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal for full message */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
            <h3 className="text-lg font-bold mb-2">Full Message</h3>
            <p className="text-gray-700 whitespace-pre-line">{selectedMessage}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTickets;
