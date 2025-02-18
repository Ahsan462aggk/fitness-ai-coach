# app/schemas/user_schema.py
from pydantic import BaseModel, EmailStr, validator
from datetime import datetime
from typing import List, Optional
import json

class UserCreate(BaseModel):
    email: EmailStr  # Use email for authentication
    name: str
    age: int
    gender: str
    height: str
    target_weight: str
    current_weight: str
    expertise: str
    equipment: str
    goals: List[str] = []
    work_frequency: int
    rest_days: List[str] = []
    password: str  # User password (this will be hashed in the backend)

    class Config:
        orm_mode = True

class UserProfile(BaseModel):
    user_id: str
    email: EmailStr
    name: str
    age: int
    gender: str
    height: str
    target_weight: str
    current_weight: str
    expertise: str
    equipment: str
    goals: List[str]
    work_frequency: int
    rest_days: List[str]
    current_date: datetime
    current_day: str

    @validator('goals', 'rest_days', pre=True)
    def parse_json_fields(cls, v):
        if isinstance(v, str):
            return json.loads(v)
        return v

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[str] = None
    target_weight: Optional[str] = None
    current_weight: Optional[str] = None
    expertise: Optional[str] = None
    equipment: Optional[str] = None
    goals: Optional[List[str]] = None
    work_frequency: Optional[int] = None
    rest_days: Optional[List[str]] = None

    class Config:
        orm_mode = True
