import React, { useState, useEffect } from "react";
import { getEventServices } from "../../api/event";

interface EventServicesProps {
  selectedEventType: string;
}

const EventServices: React.FC<EventServicesProps> = ({ selectedEventType }) => {
  interface Service {
    name: string;
    status: string;
  }

  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    if (selectedEventType) {
      fetchServices(selectedEventType);
    }
  }, [selectedEventType]);

  const fetchServices = async (eventType: string) => {
    const data = await getEventServices(eventType);
    setServices(data);
  };

  return (
    <div>
      <h2>Services for {selectedEventType}</h2>
      {services.length > 0 ? (
        <ul>
          {services.map((service, index) => (
            <li key={index}>
              {service.name} - <strong>{service.status}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p>No services available</p>
      )}
    </div>
  );
};

export default EventServices;
