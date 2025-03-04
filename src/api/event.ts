import axios from "axios";

const API_URL = "http://localhost:5000/api/event-services";

// Fetch services based on event type
export const getEventServices = async (eventType: any) => {
    try {
        const response = await axios.get(`${API_URL}/${eventType}`);
        return response.data; // Returns an array of services
    } catch (error) {
        console.error("Error fetching event services:", error);
        return [];
    }
};
