'use client';

import { useSearchParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { API_URLS } from '@/config/urls';

interface Result {
    position: number;
    driver_name?: string;
    race_name?: string;
    track?: string;
}

interface DriverResults {
    driver_name: string;
    team: string;
    results: Result[];
}

interface RaceResults {
    track: string;
    date: string;
    results: Result[];
}

export default function ResultsPage() {
    const searchParams = useSearchParams();
    const [results, setResults] = useState<DriverResults | RaceResults | null>(null);
    const [loading, setLoading] = useState(true);
    const [resultType, setResultType] = useState<'driver' | 'race' | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            const driverId = searchParams?.get('driver');
            const raceId = searchParams?.get('race');

            if (!driverId && !raceId) {
                setLoading(false);
                return;
            }

            try {
                let response;
                const fetchOptions = {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                };

                if (driverId) {
                    console.log('Fetching driver results:', API_URLS.getDriverResults(driverId));
                    response = await fetch(API_URLS.getDriverResults(driverId), fetchOptions);
                    setResultType('driver');
                } else {
                    console.log('Fetching race results:', API_URLS.getRaceResults(raceId!));
                    response = await fetch(API_URLS.getRaceResults(raceId!), fetchOptions);
                    setResultType('race');
                }
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('API Error Response:', {
                        status: response.status,
                        statusText: response.statusText,
                        body: errorText
                    });

                    if (response.status === 404) {
                        notFound();
                    }
                    throw new Error(`HTTP error! status: ${response.status} - ${errorText || response.statusText}`);
                }
                
                const data = await response.json();
                console.log('Fetched data:', data);
                setResults(data);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
                console.error('Error fetching results:', errorMessage);
                setResults(null);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [searchParams]);

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (!results) return <div className="text-center p-4">No results found.</div>;

    return (
        <div className="p-4">
            {resultType === 'driver' ? (
                // Driver Results View
                <>
                    <h1 className="text-2xl font-bold mb-4">Results for {(results as DriverResults).driver_name}</h1>
                    <p className="mb-4">Team: {(results as DriverResults).team}</p>
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Position</th>
                                <th className="border border-gray-300 px-4 py-2">Race</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(results as DriverResults).results.map((result, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 px-4 py-2">{result.position}</td>
                                    <td className="border border-gray-300 px-4 py-2">{result.race_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                // Race Results View
                <>
                    <h1 className="text-2xl font-bold mb-4">Results for {(results as RaceResults).track}</h1>
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Position</th>
                                <th className="border border-gray-300 px-4 py-2">Driver</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(results as RaceResults).results.map((result, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 px-4 py-2">{result.position}</td>
                                    <td className="border border-gray-300 px-4 py-2">{result.driver_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}
