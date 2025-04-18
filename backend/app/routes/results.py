from fastapi import APIRouter, HTTPException, Query
from ..s3_loader import read_csv_from_s3

router = APIRouter()

@router.get("/drivers/{driver_id}/results")
async def get_driver_results(driver_id: str):
    try:
        results_df = read_csv_from_s3('results.csv')
        drivers_df = read_csv_from_s3('drivers.csv')

        # Get driver details
        driver_info = drivers_df[drivers_df['driver_id'] == int(driver_id)]
        if driver_info.empty:
            raise HTTPException(status_code=404, detail=f"Driver not found with ID: {driver_id}")

        # Get results for this driver
        driver_results = results_df[results_df['driver_id'] == int(driver_id)]
        if driver_results.empty:
            return {
                "driver_name": driver_info.iloc[0]['driver_name'],
                "team": driver_info.iloc[0]['team'],
                "results": []
            }

        # Convert results to list of dictionaries
        results = driver_results[['position', 'race_name']].to_dict('records')

        return {
            "driver_name": driver_info.iloc[0]['driver_name'],
            "team": driver_info.iloc[0]['team'],
            "results": results
        }
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid driver ID format: {driver_id}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/races/{race_id}/results")
async def get_race_results(race_id: str):
    try:
        results_df = read_csv_from_s3('results.csv')
        drivers_df = read_csv_from_s3('drivers.csv')
        races_df = read_csv_from_s3('races.csv')

        # Get race details
        race_info = races_df[races_df['race_id'] == int(race_id)]
        if race_info.empty:
            raise HTTPException(status_code=404, detail=f"Race not found with ID: {race_id}")

        # Get results for this race
        race_results = results_df[results_df['race_id'] == int(race_id)]
        if race_results.empty:
            return {
                "track": race_info.iloc[0]['track'],
                "date": race_info.iloc[0]['date'],
                "results": []
            }

        # Map driver IDs to names
        driver_map = drivers_df.set_index('driver_id')['driver_name'].to_dict()
        race_results['driver_name'] = race_results['driver_id'].map(driver_map)

        # Convert results to list of dictionaries
        results = race_results[['position', 'driver_name']].to_dict('records')

        return {
            "track": race_info.iloc[0]['track'],
            "date": race_info.iloc[0]['date'],
            "results": results
        }
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid race ID format: {race_id}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/results")
async def get_results(driver: str = None, race: str = None):
    try:
        results_df = read_csv_from_s3('results.csv')
        drivers_df = read_csv_from_s3('drivers.csv')  # Load drivers data to resolve driver names

        if driver:
            if driver.isdigit():
                results_df = results_df[results_df['driver_id'] == int(driver)]
            else:
                # Find driver_id(s) matching the driver name
                matching_drivers = drivers_df[drivers_df['driver_name'].str.contains(driver, case=False, na=False)]
                if matching_drivers.empty:
                    raise HTTPException(status_code=404, detail=f"No driver found with name: {driver}")
                driver_ids = matching_drivers['driver_id'].tolist()
                results_df = results_df[results_df['driver_id'].isin(driver_ids)]
        
        if race:
            if race.isdigit():
                results_df = results_df[results_df['race_id'] == int(race)]
            else:
                results_df = results_df[results_df['race_name'].str.contains(race, case=False, na=False)]

        # Map driver_id to driver_name
        driver_map = drivers_df.set_index('driver_id')['driver_name'].to_dict()
        results_df['driver_name'] = results_df['driver_id'].map(driver_map)

        # Select relevant columns for the response (exclude 'points')
        results = results_df[['position', 'driver_name', 'team', 'race_name']].to_dict('records')
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
