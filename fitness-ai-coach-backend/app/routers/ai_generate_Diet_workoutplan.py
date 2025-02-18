from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from app.database import get_session
from app.models.user import User
from app.controllers.user_controller import get_current_user
from app.services.ai_integration import generate_initial_plans
import json
from app.models.plan import Plan
from datetime import datetime, date, timedelta
import pytz
from app.models.feedback import Feedback

router = APIRouter()

# Define the Pakistan timezone
PKT = pytz.timezone("Asia/Karachi")

@router.get("/generate-ai-plan")
def ai_generated_plan_endpoint(
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Fetch the user's latest information from the database
    user = db.query(User).filter(User.user_id == current_user.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Get the current time in UTC and convert it to Pakistan Standard Time (PST)
    current_date_pst = datetime.utcnow().replace(tzinfo=pytz.utc).astimezone(PKT)
    current_date = current_date_pst.strftime("%Y-%m-%d")
    current_day = current_date_pst.strftime("%A")

    today = current_date_pst.date()

    # Check if a plan for the current date already exists in the database
    existing_plan = db.query(Plan).filter(
        Plan.user_id == current_user.user_id,
        Plan.created_at >= datetime.combine(today, datetime.min.time(), PKT),  # Convert to start of the day in PST
        Plan.created_at <= datetime.combine(today, datetime.max.time(), PKT)   # Convert to end of the day in PST
    ).first()

    if existing_plan:
        return {
            "message": "A plan for today has already been generated.",
            "workout_plan": json.loads(existing_plan.workout_plan),
            "diet_plan": json.loads(existing_plan.diet_plan),
            "plan_id": existing_plan.id
        }

    # Fetch the previous plans and feedback
    previous_plans = db.query(Plan).filter(Plan.user_id == current_user.user_id).order_by(Plan.id.desc()).all()
    previous_feedbacks = db.query(Feedback).filter(Feedback.user_id == current_user.user_id).order_by(Feedback.id.desc()).first()

    # Prepare the user profile data
    user_profile = {
        "user_id": user.user_id,
        "name": user.name,
        "age": user.age,
        "gender": user.gender,
        "height": user.height,
        "target_weight": user.target_weight,
        "current_weight": user.current_weight,
        "expertise": user.expertise,
        "equipment": user.equipment,
        "goals": json.loads(user.goals) if user.goals else [],
        "work_frequency": user.work_frequency,
        "rest_days": json.loads(user.rest_days),
    }

    # Assign the current date and day to the user profile
    user_profile["current_date"] = current_date
    user_profile["current_day"] = current_day
    
    # Prepare the previous plans data
    previous_plans_data = []
    for plan in previous_plans:
        plan_data = {
            "plan_id": plan.id,
            "workout_plan": json.loads(plan.workout_plan) if plan.workout_plan else None,
            "diet_plan": json.loads(plan.diet_plan) if plan.diet_plan else None,
            "created_at": plan.created_at.isoformat() if plan.created_at else None
        }
        previous_plans_data.append(plan_data)

    # Generate initial plans using the user's profile
    workout_plan, diet_plan = generate_initial_plans(user_profile=user_profile, previous_plans=previous_plans_data, previous_feedbacks=previous_feedbacks)

    # Save the generated plans to the 'plans' table
    plan_entry = Plan(
        user_id=current_user.user_id,
        workout_plan=json.dumps(workout_plan),
        diet_plan=json.dumps(diet_plan),
        created_at=current_date_pst  # Ensure the correct date and time are saved (in PST)
    )
    db.add(plan_entry)
    db.commit()

    # Return the plans to the user
    return {
        "plan_id": plan_entry.id,
        "workout_plan": workout_plan,
        "diet_plan": diet_plan
    }
