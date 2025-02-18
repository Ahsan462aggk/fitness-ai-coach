# app/models/feedback.py
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Feedback(SQLModel, table=True):
    __tablename__ = "feedback"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    plan_id: str = Field(index=True)
    ratings: str= Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        orm_mode = True
