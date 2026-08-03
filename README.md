<div align="center">

# SkillPath

**A full-stack learning roadmap tracker — plan what you're learning, break it into modules and topics, and track real progress as you go.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-2F6F4F?style=for-the-badge)](https://skillpath-six-ecru.vercel.app)

[![API Docs](https://img.shields.io/badge/API-Swagger-0EA5E9?style=for-the-badge)](https://skillpath-ncia.onrender.com/docs)

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)

[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)

[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)

[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br>

[Live Demo](https://skillpath-six-ecru.vercel.app) •
[API Documentation](https://skillpath-ncia.onrender.com/docs) •
[Repository](https://github.com/noorgupta/skillpath)

</div>

---

![Dashboard](screenshots/dashboard.png)

## Why I Built This

I wanted to learn **FastAPI** by building something practical instead of following another CRUD tutorial. Since I constantly create learning plans for technologies like AI/ML, Backend Development, DSA, and Cloud Computing, I built a tool that lets me organize those learning paths into structured roadmaps.

SkillPath allows a roadmap to be divided into modules and topics while automatically calculating overall progress from completed topics. Instead of maintaining learning plans in spreadsheets or scattered notes, everything stays organized in one place.

Interestingly, the roadmap for learning FastAPI itself was tracked using SkillPath while building the project.

---

# Features

- Create learning roadmaps for any technology or subject.
- Organize learning into modules and individual topics.
- Track progress with one-click topic completion.
- Live progress calculation without storing redundant progress values.
- Edit or delete roadmaps, modules and topics.
- Interactive REST API documentation using Swagger UI.
- Responsive and clean user interface.
- Error handling for backend connectivity failures.

---

# Screenshots

| Dashboard | Roadmap Details |
|-----------|-----------------|
| ![](screenshots/dashboard.png) | ![](screenshots/roadmap-detail.png) |

---

# Tech Stack

| Category | Technologies |
|-----------|--------------|
| Frontend | React, Vite, React Router, Axios |
| Backend | Python, FastAPI |
| ORM | SQLModel |
| Database | SQLite |
| Deployment | Vercel, Render |

---

# Architecture

```text
React (Vercel)
        │
 HTTPS / REST API
        │
FastAPI (Render)
        │
   SQLModel ORM
        │
     SQLite
```

---

# Data Model

```text
Roadmap
   │
   ├── Module
   │       │
   │       ├── Topic
```

Every roadmap contains multiple modules.

Each module contains multiple topics.

Roadmap progress is derived dynamically by counting completed topics rather than storing progress separately.

---

# API Endpoints

### Roadmaps

- GET `/roadmaps`
- POST `/roadmaps`
- GET `/roadmaps/{id}`
- PUT `/roadmaps/{id}`
- DELETE `/roadmaps/{id}`
- GET `/roadmaps/{id}/progress`

### Modules

- GET `/modules`
- POST `/modules`
- GET `/modules/{id}`
- PUT `/modules/{id}`
- DELETE `/modules/{id}`

### Topics

- GET `/topics`
- POST `/topics`
- GET `/topics/{id}`
- PUT `/topics/{id}`
- PATCH `/topics/{id}/toggle`
- DELETE `/topics/{id}`

Interactive Swagger documentation:

https://skillpath-ncia.onrender.com/docs

---

# Design Decisions

### Live Progress Calculation

Roadmap progress is never stored inside the database.

Instead, every request calculates progress by:

- Finding all modules belonging to a roadmap.
- Finding every topic inside those modules.
- Counting completed topics.
- Returning the completion percentage.

This avoids maintaining duplicate progress values and keeps the database as the single source of truth.

---

### SQLite

SQLite was chosen because it requires no separate database server while still supporting relational data and SQL queries, making it ideal for a lightweight learning application.

---

### No Authentication

Authentication was intentionally excluded to keep the project focused on roadmap management and backend fundamentals rather than user management.

---

### RESTful Structure

The backend is organized into separate routers:

```text
roadmaps/
modules/
topics/
```

Each resource has its own schemas for:

- Create
- Read
- Update

This prevents clients from sending database-generated fields like IDs or timestamps.

---

# Folder Structure

```text
SkillPath
│
├── backend
│   ├── routers
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── main.py
│   └── requirements.txt
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   ├── api.js
│   │   └── App.jsx
│   └── package.json
│
└── screenshots
```

---

# Running Locally

## Backend

```bash
cd backend

python3 -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend runs on:

```
http://localhost:8000
```

Swagger Docs:

```
http://localhost:8000/docs
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# Deployment

### Frontend

- Vercel

### Backend

- Render

The frontend communicates with the backend using environment variables (`VITE_API_URL`), while the backend uses configurable CORS origins for production deployment.

---

# Known Limitation

The backend currently uses SQLite on Render's free instance.

Since Render's free filesystem is ephemeral, database contents are reset after redeployment or service recreation.

A production version would migrate to PostgreSQL or another managed persistent database.

---

# Future Improvements

- AI-generated learning roadmap suggestions.
- Estimated completion time using ML.
- User authentication.
- Dark mode.
- Drag-and-drop module ordering.
- Search and filtering.
- PostgreSQL migration.
- Docker containerization.
- CI/CD using GitHub Actions.

---

# Author

**Noor Gupta**

GitHub

https://github.com/noorgupta

LinkedIn

https://www.linkedin.com/in/noor-gupta-14a56b324/

---

## ⭐ If you found this project interesting, consider giving it a star.
