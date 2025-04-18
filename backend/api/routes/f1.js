const express = require('express');
const router = express.Router();
const { read_csv_from_s3 } = require('../app/s3_loader');

router.get("/races/:raceId/results", async (req, res) => {
  try {
    const raceId = req.params.raceId;
    const resultsCsv = await read_csv_from_s3('results.csv');
    const results = resultsCsv
      .filter((row) => row.race_id === raceId)
      .map((row) => ({
        raceId: row.race_id,
        driverId: row.driver_id,
        position: row.position,
        points: row.points || 0, // Default to 0 if points are missing
        status: row.status || 'Unknown', // Default to 'Unknown' if status is missing
      }));

    res.json({ results });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});
