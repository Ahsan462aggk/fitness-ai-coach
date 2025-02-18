from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.user_router import router as user_router
from app.routers.feedback_router import router as feedback_router
from app.database import create_db_and_tables
from app.routers.ai_generate_Diet_workoutplan import router as  ai_generate_plan_router
app = FastAPI()

# Define the CORS settings
origins = [
    "http://localhost:3000",  # Adjust for your frontend development server URL
  # You can add production URLs if applicable # This will allow all domains, but you can limit it for security purposes
]

# Add CORSMiddleware to the app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specific origins
    allow_credentials=True,  # Allow credentials such as cookies
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include the user-related endpoints
app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(ai_generate_plan_router, prefix="/ai-generated-plan", tags=["ai-generated-plan"])

app.include_router(feedback_router, prefix="/feedback", tags=["feedback"])



# Create the database tables on startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Gym Trainer App!"}
