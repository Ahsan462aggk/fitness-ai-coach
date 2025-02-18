from sqlmodel import SQLModel, Field
from datetime import date
from typing import Optional
from datetime import datetime
import uuid

class Plan(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), unique=True, primary_key=True)
    user_id: str = Field(index=True)
    workout_plan: str  # Store as JSON string
    diet_plan: str   
    created_at: datetime = Field(default_factory=datetime.utcnow)  # Store as JSON string

    class Config:
        orm_mode = True
