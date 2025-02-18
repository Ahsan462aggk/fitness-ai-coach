# Fitness AI Coach Backend

A robust FastAPI-based backend service that powers the Fitness AI Coach platform with AI-driven workout recommendations and progress tracking.

## 🚀 Features

- 🤖 AI-powered workout plan generation
- 🏋️ Exercise form analysis and guidance
- 📊 User progress tracking and analytics
- 🔐 Secure user authentication and authorization
- 📱 RESTful API endpoints
- 📦 PostgreSQL database integration
- 🔄 Real-time workout feedback

## 🛠️ Tech Stack

- **Framework**: FastAPI
- **Language**: Python 3.9+
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT
- **Dependency Management**: Poetry
- **API Documentation**: Swagger/OpenAPI
- **Testing**: pytest

## 📦 Project Structure

```
fitness-ai-coach-backend/
├── app/                    # Main application directory
│   ├── api/               # API endpoints
│   ├── core/              # Core functionality
│   ├── db/                # Database models and migrations
│   ├── schemas/           # Pydantic models
│   └── services/          # Business logic
├── tests/                 # Test files
└── poetry.lock           # Dependency lock file
```

## 🚀 Getting Started

### Prerequisites

- Python 3.9 or higher
- PostgreSQL
- Poetry package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd fitness-ai-coach-backend
```

2. **Install dependencies using Poetry**
```bash
poetry install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/fitness_ai_coach
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

4. **Initialize the database**
```bash
poetry run python -m app.db.init_db
```

5. **Start the development server**
```bash
poetry run uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## 📝 API Documentation

Once the server is running, you can access:
- Swagger UI documentation at `http://localhost:8000/docs`
- ReDoc documentation at `http://localhost:8000/redoc`

## 🧪 Testing

Run the test suite:
```bash
poetry run pytest
```

Run with coverage report:
```bash
poetry run pytest --cov=app tests/
```

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection URL | - |
| SECRET_KEY | JWT secret key | - |
| ALGORITHM | JWT algorithm | HS256 |
| ACCESS_TOKEN_EXPIRE_MINUTES | Token expiration time | 30 |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Author

- Ahsan Ali Gill (ahs462agk@gmail.com)

## 📚 Learn More

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Poetry Documentation](https://python-poetry.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
