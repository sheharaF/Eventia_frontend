import React from "react";
import "remixicon/fonts/remixicon.css";
import HeroImg from "../../assets/hero.jpg";
import { useNavigate } from "react-router-dom";

const Hero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-[#FFFFFF] px-6 md:px-8 mt-16 lg:px-12 py-20 flex flex-col items-center lg:flex-row relative w-full min-h-fit justify-items-center">
      {/* Left Side - Text */}
      <div className="lg:w-1/2 ml-6 text-center lg:text-left lg:pl-12 xl:pl-24">
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#3F2E20] leading-tight font-mont">
          Plan. Book. <br /> Celebrate.
        </h1>
        <p className="text-[#3F2E20] text-lg mt-6 font-serif">
          Your hassle-free event planning hub, <br /> tailored to your budget
          and style!
        </p>
        <button
          className="bg-[#FFBD59] hover:bg-[#E6A745] text-black font-bold py-3 px-8 rounded-md mt-8 shadow-md transition duration-300"
          onClick={() => navigate("/login")}
        >
          Sign In
        </button>
      </div>

      {/* Right Side - Image */}
      <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center lg:pr-12 xl:pr-24">
        <img
          src={HeroImg}
          alt="Wedding Celebration"
          className="w-[90%] ml-14 md:w-[85%] lg:w-[80%] shadow-lg rounded-lg"
        />
      </div>
    </section>
  );
};

export default Hero;
