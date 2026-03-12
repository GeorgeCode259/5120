# Sunscreen Web (Decoupled Version)

This is a **Sunscreen** web application built with a decoupled frontend-backend architecture, designed for scalability and performance.

## 🚀 Tech Stack

- **Backend**: [Flask](https://flask.palletsprojects.com/) (Python) + [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/) (ORM) + [Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/) (Auth)
- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/) + [SCSS](https://sass-lang.com/)
- **Deployment**: [Vercel](https://vercel.com/) (Serverless)

## 📁 Directory Structure

- `backend/`: Flask REST API (Python).
- `frontend/`: React + Vite + TypeScript frontend application.

## 🛠️ Local Development Setup

### 1. Prerequisites
- Python 3.9+
- Node.js 18+ & npm
- Git

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv .venv
   .\.venv\Scripts\activate

   # macOS/Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   - Copy `.env.example` to `.env`.
   - Update `DATABASE_URL` (defaults to local SQLite if left blank).
5. Run the service:
   ```bash
   python run.py
   ```
   *The API will be available at [http://127.0.0.1:5000](http://127.0.0.1:5000)*

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The frontend will be available at [http://localhost:5173](http://localhost:5173)*

## 🔐 Environment Configuration

The backend uses `.env` for configuration. Key variables include:
- `FLASK_APP`: Entry point (e.g., `run.py`).
- `FLASK_ENV`: Set to `development` for local debugging.
- `SECRET_KEY`: Used for session security.
- `JWT_SECRET_KEY`: Used for JWT authentication.
- `DATABASE_URL`: Connection string for Postgres (RDS) or SQLite.

## 🚢 Vercel Deployment

Both the frontend and backend are pre-configured for Vercel deployment via `vercel.json` files.

### 1. Deploying the Backend
- **Project Type**: Python
- **Root Directory**: `backend/`
- **Build Command**: None (Vercel handles it via `requirements.txt`)
- **Output Directory**: `api/`
- **Environment Variables**: Add all variables from `.env` in the Vercel dashboard.

### 2. Deploying the Frontend
- **Framework Preset**: Vite
- **Root Directory**: `frontend/`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Set `VITE_API_BASE_URL` to your deployed backend URL.

## 🤝 Contribution Guide

- **Branching Strategy**: All development must be done on the `test` branch.
- **Workflow**: Create a feature branch (e.g., `feature/login`) from `test`, and merge back to `test` via Pull Request once verified.
- **Code Quality**:
  - **Backend**: Follow PEP 8 guidelines.
  - **Frontend**: Run `npm run lint` before committing.
