import React from "react";
//import Navbar from "../components/Navbar";
import Homeinner from "../components/Homeinner";
//import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* <Navbar /> */}
      <main className="flex-grow">
        <Homeinner />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
