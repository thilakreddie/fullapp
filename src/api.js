import axios from "axios";

const API_BASE_URL = "http://localhost:8081"; // Ensure port is 8081

export const getRaces = async () => {
    const response = await axios.get(`${API_BASE_URL}/races`);
    return response.data;
};

export const getRaceResults = async (raceId) => {
    const response = await axios.get(`${API_BASE_URL}/races/${raceId}/results`);
    return response.data;
};
