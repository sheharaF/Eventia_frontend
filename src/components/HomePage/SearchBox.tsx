import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

const SearchBox: React.FC = () => {
  const [eventType, setEventType] = useState("");
  const [location, setLocation] = useState("");
  const [services, setServices] = useState<{ name: string }[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<
    { city: string; district: string }[]
  >([]);
  const [error, setError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();

  // Fetch location suggestions
  useEffect(() => {
    if (location.length > 1) {
      axios
        .get(`http://localhost:5000/api/locations/search?query=${location}`)
        .then((response) => setSuggestions(response.data))
        .catch((error) => console.error("Error fetching locations", error));
    } else {
      setSuggestions([]);
    }
  }, [location]);

  // Fetch services based on event type
  useEffect(() => {
    if (!eventType) {
      setServices([]);
      setSelectedServices([]);
      return;
    }

    axios
      .get(
        `http://localhost:5000/api/services/${encodeURIComponent(eventType)}`
      )
      .then((response) => {
        if (response.status === 200) {
          setServices(response.data);
        }
      })
      .catch((error) => console.error("Error fetching services:", error));
  }, [eventType]);

  // Toggle service selection
  const toggleService = (serviceName: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((name) => name !== serviceName)
        : [...prev, serviceName]
    );
  };

  // Handle search and navigate to results page
  const handleSearch = () => {
    if (!eventType) {
      setError("Event Type is required");
      return;
    }

    setError(""); // Clear previous error

    const params = new URLSearchParams();

    if (eventType) params.append("eventType", eventType);
    if (location) params.append("location", location);
    if (selectedServices.length > 0) {
      params.append("serviceCategory", selectedServices.join(","));
    }

    navigate(`/search-results?${params.toString()}`);
  };

  return (
    <div className="bg-[#3F2E20] text-white rounded-lg shadow-lg p-6 mx-auto max-w-5xl mt-[-50px] relative flex flex-wrap gap-4 md:gap-6 justify-between items-center">
      {/* Event Type Dropdown */}
      <div className="relative w-full md:w-[220px]">
        <select
          className="bg-white text-black px-4 py-3 pr-10 rounded-md w-full focus:outline-none appearance-none"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          required
        >
          <option value="">Select Event Type</option>
          <option value="Wedding">Wedding</option>
          <option value="Birthday Party">Birthday Party</option>
          <option value="Corporate Event">Corporate Event</option>
          <option value="Get Together">Get Together</option>
          <option value="Conference">Conference</option>
          <option value="Other">Other</option>
        </select>
        <i className="ri-home-5-fill absolute right-3 top-1/2 transform -translate-y-1/2 text-black"></i>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      {/* Services Dropdown with Multiple Selection */}
      <div className="relative w-full md:w-[220px]">
        <div
          className="bg-white text-black px-4 py-3 pr-10 rounded-md w-full focus:outline-none cursor-pointer flex justify-between items-center"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span>
            {selectedServices.length > 0
              ? selectedServices.join(", ")
              : "Select Services"}
          </span>
          <i className="ri-arrow-down-s-fill text-black"></i>
        </div>

        {isDropdownOpen && services.length > 0 && (
          <ul className="absolute left-0 top-10 w-full bg-white border rounded-lg shadow-md z-10 max-h-40 overflow-y-auto">
            {services.map((service) => (
              <li
                key={service.name}
                className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => toggleService(service.name)}
              >
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service.name)}
                  onChange={() => toggleService(service.name)}
                />
                <label className="text-black">{service.name}</label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Location Input with Suggestions */}
      <div className="relative w-full md:w-[220px]">
        <input
          type="text"
          className="bg-white text-black px-4 py-3 pr-10 rounded-md w-full focus:outline-none"
          placeholder="Enter Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <i className="ri-map-pin-2-fill absolute right-3 top-1/2 transform -translate-y-1/2 text-black"></i>
        {suggestions.length > 0 && (
          <ul className="absolute left-0 top-10 w-full bg-white border rounded-lg shadow-md z-10 max-h-40 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setLocation(`${suggestion.city}, ${suggestion.district}`);
                  setSuggestions([]);
                }}
              >
                <span className="text-black">{suggestion.city + ","}</span>{" "}
                <span className="text-black">{suggestion.district}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Get Started Button */}
      <button
        className="bg-[#FFBD59] hover:bg-[#E6A745] text-black font-bold px-6 py-3 rounded-md shadow-md w-full md:w-[140px]"
        onClick={handleSearch}
      >
        Get Started
      </button>
    </div>
  );
};

export default SearchBox;
