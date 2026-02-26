# Enterprise MERN Admin Dashboard

A production-ready, enterprise-level Admin Dashboard built with MongoDB, Express, React, and Node.js.

## Features

- **Authentication**: JWT (Access + Refresh tokens) with bcrypt hashing.
- **RBAC**: Role-Based Access Control (Admin, Editor, User).
- **Security**: Helmet, CORS, Rate limiting, NoSQL injection prevention.
- **UI/UX**: Responsive sidebar, Dark/Light mode, Analytics cards.
- **CRUD**: Full Product management with pagination, sorting, and filtering.
- **Logging**: Activity logs for tracking user actions.
- **API Docs**: Integrated Swagger documentation.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Zustand, React Router, Axios, Sonner.
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/admin-dashboard
   JWT_SECRET=your_access_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### API Documentation
Visit `http://localhost:5000/api-docs` after starting the server.

## Docker Deployment
```bash
docker build -t admin-dashboard .
docker run -p 5000:5000 admin-dashboard
```
