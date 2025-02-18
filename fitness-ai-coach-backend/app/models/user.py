# app/models/user.py
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
import uuid

class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(default_factory=lambda: str(uuid.uuid4()), unique=True)  # Automatically generate user_id
    email: str = Field(index=True, unique=True)  # Unique email field for authentication
    name: str
    age: int
    gender: str
    height: str
    target_weight: str
    current_weight: str
    expertise: str
    equipment: str
    
    # Store goals and rest_days as Text, which will store JSON string data
    goals: Optional[str] = Field(default="[]", nullable=True)
    rest_days: Optional[str] = Field(default="[]", nullable=True)
    
    work_frequency: int
    created_at: datetime = Field(default_factory=datetime.utcnow)
    current_date: datetime = Field(default_factory=datetime.utcnow)
    current_day: str = Field(default="Monday")
    password: str  # Store the hashed password here

    class Config:
        orm_mode = True
