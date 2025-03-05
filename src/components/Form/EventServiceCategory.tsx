import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface Service {
  name: string;
  status: "required" | "optional"; // Lowercase to match backend data
}

interface EventServiceSelectionProps {
  eventType: string;
  onClose: () => void;
  onPrevious: () => void;
  location: string;
  budgetMax: string;
  guestMax: string;
}

const EventServiceSelection: React.FC<EventServiceSelectionProps> = ({
  eventType,
  onClose,
  onPrevious,
  location,
  budgetMax,
  guestMax,
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const navigate = useNavigate(); // useNavigate hook

  useEffect(() => {
    const fetchServices = async () => {
      if (!eventType) return;

      try {
        const response = await fetch(
          `http://localhost:5000/api/services/${encodeURIComponent(eventType)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();

        // ✅ Normalize status to lowercase
        const formattedServices = data.map((service: any) => ({
          ...service,
          status: service.status.toLowerCase(), // Convert "Required" -> "required"
        }));

        setServices(formattedServices);

        // ✅ Pre-select required services
        setSelectedServices(
          formattedServices
            .filter((s: Service) => s.status === "required")
            .map((s: Service) => s.name)
        );
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [eventType]);

  const toggleService = (serviceName: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((name) => name !== serviceName)
        : [...prev, serviceName]
    );
  };

  const handleFindVendors = () => {
    // Create query parameters dynamically, removing empty ones
    const params: Record<string, string> = {};

    if (eventType) params.eventType = eventType;
    if (location) params.location = location;
    if (budgetMax) params.price = budgetMax;
    if (guestMax) params.capacity = guestMax;
    if (selectedServices.length > 0)
      params.serviceCategory = selectedServices.join(",");

    // Convert params object to a query string
    const queryString = new URLSearchParams(params).toString();

    // Navigate with only the provided parameters
    navigate(`/search-results?${queryString}`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg px-16 py-10 shadow-lg max-w-4xl w-full relative border-2 border-yellow-600">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-black p-2"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Header */}
        <h2 className="text-2xl font-extrabold">
          Customize Your Event Services
        </h2>
        <p className="text-gray-600 pt-2">
          We've selected the must-have services for your{" "}
          <strong>{eventType}</strong>. Change them as you wish.
        </p>

        {/* Service Lists */}
        <div className="flex justify-between mt-6">
          {/* Required Services */}
          <div className="w-1/2">
            <h3 className="font-bold mb-2">Required Services</h3>
            {services
              .filter((s) => s.status === "required") // ✅ Fixed case issue
              .map((service) => (
                <div key={service.name} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.name)}
                    onChange={() => toggleService(service.name)}
                    className="cursor-pointer"
                  />
                  <label className="text-gray-700">{service.name}</label>
                </div>
              ))}
          </div>

          {/* Optional Services */}
          <div className="w-1/2">
            <h3 className="font-bold mb-2">Optional Services</h3>
            {services
              .filter((s) => s.status === "optional") // ✅ Fixed case issue
              .map((service) => (
                <div key={service.name} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.name)}
                    onChange={() => toggleService(service.name)}
                    className="cursor-pointer"
                  />
                  <label className="text-gray-700">{service.name}</label>
                </div>
              ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <button
            className="bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800"
            onClick={onPrevious}
          >
            Previous
          </button>
          <button
            className="bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800"
            onClick={() => {
              handleFindVendors(); // Trigger navigate when clicked
              onClose(); // Close the popup
            }}
          >
            Find the vendors!
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventServiceSelection;
