# Fitness AI Coach

A comprehensive AI-powered fitness coaching platform that provides personalized workout plans and guidance.

## 🌟 Project Overview

The Fitness AI Coach is a full-stack application that combines the power of artificial intelligence with fitness expertise to provide users with personalized workout plans, form guidance, and progress tracking. The project consists of two main components:

- **Frontend**: A modern, responsive web application built with Next.js
- **Backend**: A robust Python-based API built with FastAPI

## 🚀 Tech Stack

### Frontend
- Next.js 15.1
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Axios

### Backend
- Python
- FastAPI
- Poetry (dependency management)
- SQLAlchemy
- PostgreSQL

## 📂 Project Structure

```
fitness-ai-coach/
├── frontend/               # Next.js frontend application
└── fitness-ai-coach-backend/  # FastAPI backend application
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python 3.9+
- PostgreSQL
- Poetry (Python package manager)

### Setting up the Backend

1. Navigate to the backend directory:
```bash
cd fitness-ai-coach-backend
```

2. Install dependencies using Poetry:
```bash
poetry install
```

3. Copy the example environment file and configure it:
```bash
cp .env.example .env
```

4. Start the backend server:
```bash
poetry run uvicorn app.main:app --reload
```

### Setting up the Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔐 Environment Variables

### Backend (.env)
- Database configuration
- API keys
- Security settings

### Frontend (.env.local)
- API endpoint configuration
- Public environment variables

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Ahsan Ali Gill (ahs462agk@gmail.com) - Initial work

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- The open-source community 