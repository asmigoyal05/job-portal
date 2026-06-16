# Job Portal — Full Stack Application

A complete Job Portal built with React (Vite) + Node.js (Express) + MySQL.

## Project Structure

```
job-portal/
├── backend/       Express REST API
├── frontend/      React + Vite SPA
└── database.sql   MySQL schema
```

## Setup Instructions

### 1. Database

```bash
mysql -u root -p < database.sql
```

Or run the SQL in `database.sql` via MySQL Workbench / phpMyAdmin.

### 2. Backend

```bash
cd backend
npm install

# Copy env file and fill in your values
cp .env.example .env
# Edit .env with your DB credentials and JWT secret

npm run dev
# Server starts on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
# App starts on http://localhost:5173
```

## Environment Variables (backend/.env)

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=job_portal
JWT_SECRET=change_this_to_a_long_random_string
```

## Features

### Job Seekers
- Register / Login
- Browse all jobs with search + filter by type
- View full job details
- One-click apply (duplicate prevention)
- Track application status (pending / shortlisted / rejected)
- Personal dashboard with stats

### Recruiters
- Register / Login  
- Post jobs (title, company, location, salary, type, description, requirements)
- Manage own job listings (edit / delete)
- View all applicants per job
- Shortlist or reject applicants
- Dashboard with aggregate stats

## API Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/profile | Get current user profile |

### Jobs
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/jobs | — | Get all jobs (supports ?search=) |
| GET | /api/jobs/:id | — | Get job by ID |
| GET | /api/jobs/recruiter/mine | Recruiter | Get recruiter's own jobs |
| POST | /api/jobs | Recruiter | Create new job |
| PUT | /api/jobs/:id | Recruiter | Update job |
| DELETE | /api/jobs/:id | Recruiter | Delete job |

### Applications
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/applications | Seeker | Apply for a job |
| GET | /api/applications/mine | Seeker | Get my applications |
| GET | /api/applications/job/:jobId | Recruiter | Get applicants for a job |
| PUT | /api/applications/:id/status | Recruiter | Update application status |

## Tech Stack

- **Frontend**: React 18, React Router v6, Axios, Vite
- **Backend**: Node.js, Express 4, mysql2, bcryptjs, jsonwebtoken
- **Database**: MySQL 8+
- **Auth**: JWT (stored in localStorage, sent as Bearer token)
