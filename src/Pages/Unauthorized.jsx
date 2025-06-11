import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col p-10 justify-center items-center min-h-1/2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-red-600 mb-4">403</h1>
        <h2 className="text-3xl font-semibold mb-4">Access Denied</h2>
        <p className="text-lg text-gray-300 mb-6">
          You do not have permission to view this page. If you believe this is an error, please contact your administrator.
        </p>
        <button
          className="bg-transparent border-2 border-white text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-white hover:text-gray-800 transition-all duration-300"
          onClick={() => navigate('/')}
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
