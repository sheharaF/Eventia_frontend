import React, { useState } from "react";
import Logo from "../../assets/logo.png";
import EventDetailsForm from "../Form/EventDetailsForm";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-[#FEF7F2] border-b-2 border-[#3F2E20] px-10 py-1 flex justify-between items-center fixed top-0 left-0 w-full z-40">
      <div className="flex items-center space-x-2">
        <img
          src={Logo}
          alt="Eventia Logo"
          className="h-20"
          onClick={() => navigate("/")}
        />
      </div>
      <ul className="flex space-x-8 text-[#3F2E20] font-semibold font-mont">
        <li
          className="cursor-pointer hover:text-[#FFBD59]"
          onClick={() => navigate("/")}
        >
          Home
        </li>
        <li
          className="cursor-pointer hover:text-[#FFBD59]"
          onClick={() => window.scrollTo({ top: 500, behavior: "smooth" })}
        >
          About
        </li>
        <li
          className="cursor-pointer hover:text-[#FFBD59]"
          onClick={() => window.scrollTo({ top: 1350, behavior: "smooth" })}
        >
          Packages
        </li>
        <li
          className="cursor-pointer hover:text-[#FFBD59]"
          onClick={() => window.scrollTo({ top: 1500, behavior: "smooth" })}
        >
          Contact
        </li>
      </ul>
      {/* Button to open the modal */}
      <button
        className="bg-[#FFBD59] hover:bg-[#E6A745] text-black font-semibold py-2 px-6 rounded-md shadow-md"
        onClick={() => setIsModalOpen(true)}
      >
        Plan Your Event
      </button>

      {/* Show Modal if Open */}
      {isModalOpen && (
        <EventDetailsForm onClose={() => setIsModalOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;
