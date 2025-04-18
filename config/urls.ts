const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

export const API_URLS = {
  drivers: `${API_BASE_URL}/drivers`,
  races: `${API_BASE_URL}/races`,
  getDriverResults: (driverId: string) => `${API_BASE_URL}/drivers/${driverId}/results`,
  getRaceResults: (raceId: string) => `${API_BASE_URL}/races/${raceId}/results`,
};
