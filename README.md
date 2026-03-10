# Sunscreen Web (Decoupled Version)

This is a **Sunscreen** web application built with a decoupled frontend-backend architecture.

## Directory Structure

- **backend/**: Flask REST API (Python) and its virtual environment.
- **frontend/**: React + Vite + TypeScript frontend application.

## Debugging Ports

In the local development environment, the following ports are used by default:

- **Backend**: [http://127.0.0.1:5000](http://127.0.0.1:5000) (Flask REST API)
- **Frontend**: [http://localhost:5173](http://localhost:5173) (React + Vite)

## Development Guide

### 1. Branching Strategy

- **Mandatory**: All development and commits must be done on the **test** branch.
- For new features, it is recommended to create a feature branch (e.g., `feature/xxx`) from `test`, and merge it back to `test` once completed.

### 2. Code Style

- **Backend**: Follows PEP 8 guidelines.
- **Frontend**: Uses ESLint and Prettier for code linting and formatting.

### 3. API Development

- Backend endpoints are defined under `backend/app/blueprints/`.
- Frontend calls the backend API via `frontend/src/api/axios.ts`.

## Quick Start

### 1. Backend

1. Navigate to the backend directory: `cd backend`
2. Create and activate a virtual environment: `python -m venv .venv` then `.\.venv\Scripts\activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Run the service: `python run.py`

### 2. Frontend

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
