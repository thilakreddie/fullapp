from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import drivers, races, results  # Reverted to relative imports
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="F1 Results API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # More permissive for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(drivers.router, tags=["drivers"])
app.include_router(races.router, tags=["races"])
app.include_router(results.router, tags=["results"])

@app.get("/")
async def root():
    return {
        "message": "F1 Results API-VS code",
        "aws_configured": bool(os.getenv('AWS_ACCESS_KEY_ID') and os.getenv('AWS_SECRET_ACCESS_KEY'))
    }
import time

start_time = time.time()

print(f"FastAPI initialized in {time.time() - start_time} seconds")

start_time = time.time()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # More permissive for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
print(f"CORS middleware added in {time.time() - start_time} seconds")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8081, reload=True)