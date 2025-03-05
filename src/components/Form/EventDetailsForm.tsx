import React, { useEffect, useState } from "react";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import EventServiceSelection from "./EventServiceCategory";

const EventDetailsForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [eventType, setEventType] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [guestMin, setGuestMin] = useState("");
  const [guestMax, setGuestMax] = useState("");
  const [showServiceSelection, setShowServiceSelection] = useState(false);
  const [suggestions, setSuggestions] = useState<
    { city: string; district: string }[]
  >([]);

  const eventTypes = [
    "Wedding",
    "Birthday Party",
    "Corporate Event",
    "Get Together",
    "Conference",
    "Other",
  ];

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

  const handleContinue = () => {
    if (!eventType) {
      alert("Please select an event type.");
      return;
    }
    setShowServiceSelection(true);
  };

  return (
    <>
      {showServiceSelection ? (
        <EventServiceSelection
          eventType={eventType}
          location={location}
          budgetMax={budgetMax}
          guestMax={guestMax}
          onClose={onClose}
          onPrevious={() => setShowServiceSelection(false)}
        />
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg px-16 py-10 shadow-lg max-w-4xl w-full relative border-2 border-yellow-600">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-600 p-3"
              onClick={onClose}
            >
              ✖
            </button>

            {/* Title */}
            <h2 className="text-2xl font-extrabold font-mont text-left">
              Start Planning Your Dream Event!
            </h2>
            <p className="text-left text-gray-600 pt-2">
              Enter your event details, and we'll match you with the best
              vendors and packages!
            </p>

            {/* Form */}
            <div className="mt-6 space-y-4 pt-8">
              {/* Event Type Dropdown */}
              <div className="flex space-x-2">
                <div className="flex-1 border rounded-lg px-4 py-2">
                  <select
                    className="w-full outline-none bg-transparent"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                  >
                    <option value="">Event Type</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Input with Autocomplete */}
                <div className="relative flex-1 border rounded-lg px-4 py-2">
                  <input
                    type="text"
                    className="w-full outline-none bg-transparent"
                    placeholder="Preferred Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  {suggestions.length > 0 && (
                    <ul className="absolute left-0 top-10 w-full bg-white border rounded-lg shadow-md z-10 max-h-40 overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                          onClick={() => {
                            setLocation(
                              `${suggestion.city}, ${suggestion.district}`
                            );
                            setSuggestions([]);
                          }}
                        >
                          {suggestion.city} -{" "}
                          <span className="text-gray-500">
                            {suggestion.district}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Date Picker */}
                <div className="flex-1 border rounded-lg px-4 py-2">
                  <input
                    type="date"
                    className="w-full outline-none bg-transparent"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Budget and Guest Count Inputs */}
              <div className="flex space-x-4 pt-6">
                {/* Budget Input */}
                <div className="flex flex-col space-y-2 border rounded-lg px-4 py-2 w-1/2">
                  <div className="flex space-x-4">
                    <h5 className="text-left flex-shrink-0">Budget</h5>
                    <input
                      type="number"
                      className="w-24 outline-none border-b-2 border-gray-300 bg-transparent"
                      placeholder="Min"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                    />
                    <span className="flex items-center">-</span>
                    <input
                      type="number"
                      className="w-24 outline-none border-b-2 border-gray-300 bg-transparent"
                      placeholder="Max"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                    />
                  </div>
                </div>

                {/* Guest Count Input */}
                <div className="flex flex-col space-y-2 border rounded-lg px-4 py-2 w-1/2">
                  <div className="flex space-x-4">
                    <h5 className="text-left flex-shrink-0">Guests</h5>
                    <input
                      type="number"
                      className="w-24 outline-none border-b-2 border-gray-300 bg-transparent"
                      placeholder="Min"
                      value={guestMin}
                      onChange={(e) => setGuestMin(e.target.value)}
                    />
                    <span className="flex items-center">-</span>
                    <input
                      type="number"
                      className="w-24 outline-none border-b-2 border-gray-300 bg-transparent"
                      placeholder="Max"
                      value={guestMax}
                      onChange={(e) => setGuestMax(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <div className="flex justify-center pt-6">
                <button
                  className="bg-black text-white py-3 px-10 rounded-lg w-auto"
                  onClick={handleContinue}
                >
                  Continue Planning
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventDetailsForm;
