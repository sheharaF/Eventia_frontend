import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/HomePage/Navbar";

interface Ad {
  id: string;
  name: string;
  type: string;
  location: string;
  price: number;
  guestCount: string | number;
  image: string;
}

const SearchResults: React.FC = () => {
  const [results, setResults] = useState<Ad[]>([]);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const eventType = queryParams.get("type") || null;
  const location = queryParams.get("location") || null;
  const budget = queryParams.get("price") || null;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const params: Record<string, string | number> = {};
        if (eventType) params.type = eventType;
        if (location) params.location = location;
        if (budget) params.price = budget;

        const response = await axios.get(
          "http://localhost:5000/api/ads/search",
          { params }
        );
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching ads", error);
      }
    };

    fetchResults();
  }, [eventType, location, budget]);

  return (
    <div className="mt-28">
      <Navbar />
      {results.length === 0 ? (
        <p className="text-white text-center">No results found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((ad) => (
            <div
              key={ad.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={ad.image}
                alt={ad.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {ad.name}
                </h3>
                <p className="text-gray-600">{ad.type}</p>
                <p className="text-gray-600">{ad.location}</p>
                <p className="text-gray-800 font-bold">
                  LKR {ad.price.toLocaleString()}
                </p>
                {ad.guestCount !== "Any" && (
                  <p className="text-gray-600">
                    Guest Capacity: {ad.guestCount}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
