import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/HomePage/Navbar";

interface Package {
  _id: string;
  title: string;
  eventType: string;
  serviceCategory: string;
  description: string;
  location: {
    city: string;
    district: string;
  };
  priceRange: {
    min: number;
    max: number;
  };
  capacity: number | string;
  images: string[];
}

const EventPackages: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const eventType = searchParams.get("eventType");

  // Fetch packages based on the eventType or get all if not set
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // If eventType is set, fetch packages for that type
        const response = eventType
          ? await axios.get(`http://localhost:5000/api/packages/search`, {
              params: { eventType },
            })
          : await axios.get("http://localhost:5000/api/packages");

        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching event packages:", error);
      }
    };

    fetchPackages();
  }, [eventType]);

  // Handle button clicks to filter packages by event type
  const handleEventTypeClick = (type: string) => {
    setSearchParams({ eventType: type });
  };

  return (
    <div className="mt-28 px-6">
      <Navbar />
      <div className="flex justify-center space-x-6 mb-10">
        <button
          className={`py-2 px-6 rounded-lg transition-all duration-200 ${
            eventType === "Wedding"
              ? "bg-yellow-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => handleEventTypeClick("Wedding")}
        >
          Wedding Packages
        </button>
        <button
          className={`py-2 px-6 rounded-lg transition-all duration-200 ${
            eventType === "Birthday Party"
              ? "bg-yellow-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => handleEventTypeClick("Birthday Party")}
        >
          Birthday Party Packages
        </button>
        <button
          className={`py-2 px-6 rounded-lg transition-all duration-200 ${
            eventType === "Corporate Event"
              ? "bg-yellow-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => handleEventTypeClick("Corporate Event")}
        >
          Corporate Event Packages
        </button>
      </div>

      {packages.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-10">
          No packages found. Please adjust your search.
        </p>
      ) : (
        <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 transition-transform hover:scale-105"
            >
              {pkg.images.length > 0 && (
                // <img
                //   src={pkg.images[0]}
                //   alt={pkg.title}
                //   className="w-full h-48 object-cover rounded-md mb-4"
                // />
                <img
                  src="src/assets/default.png"
                  alt=""
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {pkg.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{pkg.description}</p>
              <p className="text-gray-700 text-lg">
                <span className="font-semibold">Location:</span>{" "}
                {pkg.location.city}, {pkg.location.district}
              </p>
              <p className="text-gray-700 text-lg">
                <span className="font-semibold">Price:</span>{" "}
                {pkg.priceRange.min} - {pkg.priceRange.max} LKR
              </p>
              <p className="text-gray-700 text-lg mb-4">
                <span className="font-semibold">Capacity:</span> {pkg.capacity}
              </p>
              <button className="w-full py-2 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventPackages;
