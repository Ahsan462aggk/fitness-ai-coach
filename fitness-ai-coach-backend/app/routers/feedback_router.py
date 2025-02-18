# app/routers/feedback_router.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_session
from app.models.feedback import Feedback
from app.schemas.feedback_schema import FeedbackCreate, FeedbackRead
from app.models.user import User
from app.models.plan import Plan
from app.controllers.user_controller import get_current_user
from uuid import UUID

router = APIRouter()

@router.post("/", response_model=FeedbackRead)
def submit_feedback(
    feedback: FeedbackCreate,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Check if the plan exists and belongs to the user
    plan = db.query(Plan).filter(Plan.id == feedback.plan_id, Plan.user_id == current_user.user_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    # Create feedback entry
    feedback_entry = Feedback(
    user_id=(current_user.user_id),  # Ensure it's a valid UUID
    plan_id=feedback.plan_id,      # Ensure it's a valid UUID
    ratings=feedback.ratings
)

    db.add(feedback_entry)
    db.commit()
    db.refresh(feedback_entry)

    return feedback_entry
