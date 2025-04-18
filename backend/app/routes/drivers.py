from fastapi import APIRouter, HTTPException
from ..models import Driver
from ..s3_loader import read_csv_from_s3

router = APIRouter()

@router.get("/drivers")
async def get_drivers():
    try:
        df = read_csv_from_s3('drivers.csv')
        driver_names = df[['driver_id', 'name']].to_dict('records')  # Return only driver_id and name
        return {"drivers": driver_names}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/drivers/{driver_id}/results")
async def get_driver_results(driver_id: str):
    try:
        results_df = read_csv_from_s3('results.csv')
        drivers_df = read_csv_from_s3('drivers.csv')
        races_df = read_csv_from_s3('races.csv')

        # Filter results for the given driver_id
        driver_results = results_df[results_df['driver_id'] == int(driver_id)]

        # Map driver_id to driver_name and team
        driver_map = drivers_df.set_index('driver_id')[['name', 'team']].to_dict('index')
        driver_info = driver_map.get(int(driver_id), {"name": "Unknown Driver", "team": "Unknown Team"})
        driver_name = driver_info['name']
        driver_team = driver_info['team']

        # Map race_id to race track name
        race_map = races_df.set_index('race_id')['track'].to_dict()
        driver_results['race_name'] = driver_results['race_id'].map(race_map)

        # Select relevant columns for the response
        results = driver_results[['position', 'race_name']].to_dict('records')

        return {"driver_name": driver_name, "team": driver_team, "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
