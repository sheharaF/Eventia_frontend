import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/HomePage/Navbar";

interface Ad {
  _id: string;
  title: string;
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

const SearchResults: React.FC = () => {
  const [results, setResults] = useState<Ad[]>([]);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const eventType = queryParams.get("eventType")?.trim() || null;
  const location = queryParams.get("location")?.trim() || null;
  const price = queryParams.get("price")?.trim() || null;
  const capacity = queryParams.get("capacity")?.trim() || null;
  const serviceCategory = queryParams.get("serviceCategory")?.trim() || null;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const params: Record<string, string | number> = {};

        if (eventType) params.eventType = eventType;
        if (serviceCategory) params.serviceCategory = serviceCategory;
        if (location) params.location = location;
        if (price) params.price = price;
        if (capacity) params.capacity = capacity;

        console.log("Sending request with params:", params);

        if (!eventType && !serviceCategory) {
          console.warn(
            "Missing eventType or serviceCategory. Skipping request."
          );
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/ads/search",
          { params }
        );
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchResults();
  }, [eventType, location, price, capacity, serviceCategory]);

  return (
    <div className="mt-28 px-6">
      <Navbar />
      {results.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-10">
          No results found. Please adjust your search.
        </p>
      ) : (
        <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((ad) => (
            <div
              key={ad._id}
              className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 transition-transform hover:scale-105"
            >
              {ad.images.length > 0 && (
                <img
                  src={ad.images[0]}
                  alt={ad.title}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
              )}
              <h3 className="text-xl font-semibold text-gray-800">
                {ad.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{ad.description}</p>
              <p className="text-gray-700 mt-2">
                📍 {ad.location.city}, {ad.location.district}
              </p>
              <p className="text-gray-700 mt-1">
                💰 Price:{" "}
                <span className="font-medium">
                  {ad.priceRange.min} - {ad.priceRange.max} LKR
                </span>
              </p>
              <p className="text-gray-700 mt-1">
                🎟️ Capacity: <span className="font-medium">{ad.capacity}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
