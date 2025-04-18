from fastapi import APIRouter, HTTPException, Query
from ..models import Race
from ..s3_loader import read_csv_from_s3

router = APIRouter()

@router.get("/races")
async def get_races():
    try:
        df = read_csv_from_s3('races.csv')
        race_tracks = df[['race_id', 'track']].to_dict('records')  # Return only race_id and track
        return {"races": race_tracks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/races/{race_id}/results")
async def get_race_results(race_id: str):
    try:
        results_df = read_csv_from_s3('results.csv')
        
        # Log available columns and first few rows for debugging
        available_columns = results_df.columns.tolist()
        print(f"Available columns in results.csv: {available_columns}")
        print(f"First few rows of results.csv:\n{results_df.head()}")
        
        # Ensure required columns exist
        required_columns = ['race_id', 'driver_id', 'position']  # Updated to match actual columns
        for col in required_columns:
            if col not in available_columns:
                raise HTTPException(
                    status_code=500,
                    detail=f"Missing required column: {col}. Available columns: {available_columns}"
                )
        
        race_results = results_df[results_df['race_id'] == int(race_id)][required_columns].to_dict('records')  # Use correct columns
        return {"results": race_results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
