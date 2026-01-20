# Student Management & Fee Payment System

A premium, full-stack web application for managing students and fee payments.

## Tech Stack
- **Frontend**: Plain HTML, CSS, JavaScript (Glassmorphism UI)
- **Backend**: Node.js, Express, MongoDB (Mongoose)

## Setup Instructions

### 1. Backend Setup
1. Open a terminal in the `backend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Environment Variables:
   - Create a `.env` file in `backend/` (already created).
   - Ensure `MONGO_URI` points to your MongoDB instance (default: `mongodb://localhost:27017/student_fee_system`).
4. Start the server:
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`.

### 2. Frontend Setup
1. The frontend is valid HTML/JS. You can open `frontend/index.html` directly in your browser.
2. Ensure the Backend is running first.

## Features
- **Landing Page**: Navigation to Admin or Student portals.
- **Admin Panel**:
  - Login (Mobile: any, Password: `1234`).
  - View, Add, Edit, Delete Students.
  - Manual Fee Toggle.
  - View Marks.
- **Student Panel**:
  - Login (Index Number).
  - View Profile & Marks.
  - Pay Monthly Fee (Simulated).
  - Monthly Fee Verification.

## Notes
- Payment Gateway is mocked.
- Fee Status resets automatically if the month changes (logic in backend).
