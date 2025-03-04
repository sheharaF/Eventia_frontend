import apiClient from "../utils/apiClients";

export const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
}) => {
    const response = await apiClient.post("/register", userData);
    return response.data;
};

export const login = async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post("/login", credentials);
    return response.data;
};