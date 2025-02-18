# app/routers/user_router.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import pytz
import json

from fastapi.security import OAuth2PasswordRequestForm

from app.database import get_session
from app.models.user import User
from app.models.plan import Plan
from app.schemas.user_schema import UserCreate, UserProfile, UserUpdate

from app.controllers.user_controller import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_current_day,
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

router = APIRouter()

@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_session)):
    """
    Register a new user. Hashes the password, stores user details in DB,
    and returns basic info.
    """
    # Check if user with the same email already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Automatically set current date and current day
    current_date = datetime.utcnow().replace(tzinfo=pytz.UTC)
    current_day = get_current_day(current_date)

    # Hash the password before saving the user
    hashed_password = hash_password(user.password)

    # Serialize goals and rest_days to JSON strings
    goals_json = json.dumps(user.goals)
    rest_days_json = json.dumps(user.rest_days)

    new_user = User(
        email=user.email,
        name=user.name,
        age=user.age,
        gender=user.gender,
        height=user.height,
        target_weight=user.target_weight,
        current_weight=user.current_weight,
        expertise=user.expertise,
        equipment=user.equipment,
        goals=goals_json,
        work_frequency=user.work_frequency,
        rest_days=rest_days_json,
        current_date=current_date,
        current_day=current_day,
        password=hashed_password  # Store the hashed password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "user_id": new_user.user_id,
        "email": new_user.email,
        "current_date": new_user.current_date,
        "current_day": new_user.current_day
    }

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_session)
):
    """
    Logs in a user using OAuth2PasswordRequestForm (username & password).
    Returns a Bearer token (JWT) in JSON.
    Frontend must attach this token in the 'Authorization: Bearer <token>' header.
    """
    # Fetch the user from the database by email
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Generate access token
    access_token = create_access_token(
        data={"sub": user.email}  # Use email as the JWT 'sub'
    )

    # Return the token as JSON (no cookies)
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/profile", response_model=UserProfile)
def get_profile(current_user: User = Depends(get_current_user)):
    """
    Get the current user's profile. Requires a valid Bearer token in the header:
    Authorization: Bearer <access_token>
    """
    return current_user

@router.put("/update-profile", response_model=UserProfile)
def update_profile(
    update_data: UserUpdate,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Update certain user fields. 'current_user' is retrieved from the token.
    """
    update_dict = update_data.dict(exclude_unset=True)  # Only provided fields

    for key, value in update_dict.items():
        # Handle JSON fields (goals, rest_days)
        if key in ["goals", "rest_days"] and value is not None:
            setattr(current_user, key, json.dumps(value))
        else:
            setattr(current_user, key, value)

    db.commit()
    db.refresh(current_user)
    return current_user
