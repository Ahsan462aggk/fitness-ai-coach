# app/schemas/feedback_schema.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class FeedbackCreate(BaseModel):
    plan_id: str

    ratings: str 

    class Config:
        orm_mode = True

class FeedbackRead(BaseModel):
    id: int
    user_id: str
    plan_id: str
    ratings: str
    created_at: datetime

    class Config:
        orm_mode = True
