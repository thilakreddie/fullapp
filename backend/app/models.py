# Reserved for future Pydantic models (optional)

from pydantic import BaseModel
from typing import Optional

class Driver(BaseModel):
    driver_id: int
    name: str
    team: str
    nationality: str

class Race(BaseModel):
    race_id: int
    track: str  # Updated from 'name' to 'track'
    date: str

class Result(BaseModel):
    race_id: int
    driver_id: int
    position: Optional[int]
    points: float
    status: str
