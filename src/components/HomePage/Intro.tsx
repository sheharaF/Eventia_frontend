import React from "react";
import introImg from "../../assets/cheers.jpg";

const Intro: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 mt-9 grid grid-cols-1 md:grid-cols-2 items-center gap-8">
      {/* Left Side - Image */}
      <div className="flex justify-center">
        <img
          src={introImg}
          alt="Celebration"
          className="w-full max-w-md md:max-w-lg rounded-lg"
        />
      </div>

      {/* Right Side - Text and Stats */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#3F2E20] leading-snug text-right">
          Your go-to platform for <br />
          <span className="text-black">
            stress-free event planning,
          </span> <br /> all in one place!
        </h2>

        {/* Stats Section */}
        <div className="flex flex-wrap justify-center md:justify-end gap-8 mt-6">
          {/* Vendors */}
          <div className="text-center">
            <p className="text-2xl font-extrabold text-[#3F2E20]">1K+</p>
            <p className="text-sm text-black">Vendors Available</p>
          </div>

          {/* Events Planned */}
          <div className="text-center">
            <p className="text-2xl font-extrabold text-[#3F2E20]">250+</p>
            <p className="text-sm text-black">Events Planned</p>
          </div>

          {/* Trusted Customers */}
          <div className="text-center">
            <p className="text-2xl font-extrabold text-[#3F2E20]">2K+</p>
            <p className="text-sm text-black">Trusted Customers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
