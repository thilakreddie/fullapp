'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URLS } from '@/config/urls';

interface Driver {
  driverId: string;
  name: string;
  team: string;
}

interface Race {
  raceId: string;
  track: string;
  date: string;
}

export default function F1Selector() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string>(''); // This holds the driver ID
  const [selectedRace, setSelectedRace] = useState<string>(''); // This holds the race ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversRes, racesRes] = await Promise.all([
          fetch(API_URLS.drivers),
          fetch(API_URLS.races)
        ]);

        if (!driversRes.ok) {
          throw new Error(`Failed to fetch drivers: ${driversRes.statusText}`);
        }
        if (!racesRes.ok) {
          throw new Error(`Failed to fetch races: ${racesRes.statusText}`);
        }

        const driversData = await driversRes.json();
        const racesData = await racesRes.json();

        const extractedDrivers = Array.isArray(driversData) ? driversData : driversData.drivers || [];
        const extractedRaces = Array.isArray(racesData) ? racesData : racesData.races || [];

        if (!Array.isArray(extractedDrivers)) {
          throw new Error('Drivers data is not an array');
        }
        if (!Array.isArray(extractedRaces)) {
          throw new Error('Races data is not an array');
        }

        setDrivers(extractedDrivers);
        setRaces(extractedRaces);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGoClick = () => {
    if (!selectedDriver && !selectedRace) {
      setError('Please select either a driver or a race');
      return;
    }
    const query = new URLSearchParams();
    if (selectedDriver) query.set('driver', selectedDriver);
    if (selectedRace) query.set('race', selectedRace);
    router.push(`/results?${query.toString()}`);
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="driver-select" className="block text-sm font-medium text-gray-700">
            Select Driver
          </label>
          <select
            id="driver-select"
            value={selectedDriver}
            onChange={(e) => {
              console.log('Selected value:', e.target.value); // Debug log
              setSelectedDriver(e.target.value);
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option key="default-driver" value="">Select a driver...</option>
            {drivers.map((driver) => (
              <option key={driver.driverId} value={driver.driverId}>
                {driver.name} {driver.team ? `(${driver.team})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="race-select" className="block text-sm font-medium text-gray-700">
            Select Race
          </label>
          <select
            id="race-select"
            value={selectedRace}
            onChange={(e) => setSelectedRace(e.target.value)} // Set race ID
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option key="default-race" value="">Select a race...</option>
            {races.map((race) => (
              <option key={race.raceId} value={race.raceId}>
                {race.track} {race.date ? `(${race.date})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleGoClick}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Go
      </button>
    </div>
  );
}