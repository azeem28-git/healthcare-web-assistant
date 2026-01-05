# Healthcare Mini Project

A simple healthcare website with online consultation, offline appointments, AI chatbot (client-side), and an admin area secured by a Node/Express JWT backend.

## Features
- Online consultation form (stored locally for now)
- Offline appointment form (stored locally for now)
- AI assistant widget (static guidance)
- Admin signup/login with JWT
- Admin dashboard (Consultations, Appointments, Admins) with CSV export

## Project Structure
```
Healthcare/
├─ index.html
├─ appointment.html
├─ css/
│  └─ style.css
├─ js/
│  └─ script.js
├─ admin/
│  ├─ login.html
│  ├─ signup.html
│  └─ dashboard.html
└─ backend/
   ├─ server.js
   ├─ package.json
   ├─ .env
   ├─ .gitignore
   └─ data/
```

## Prerequisites
- Node.js v16+ installed
- MongoDB installed and running (local or MongoDB Atlas)

## Setup (Backend)
1. Open a terminal in `backend/`
2. Install dependencies:
```bash
npm install
```

3. **MongoDB Setup:**
   - **Local MongoDB**: Make sure MongoDB is running on your machine (default: `mongodb://localhost:27017`)
   - **MongoDB Atlas** (Cloud): Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas) and get your connection string

4. Configure environment: Create `backend/.env` file:
```env
PORT=3000
JWT_SECRET=change_this_secret
ADMIN_SIGNUP_CODE=your_admin_code_here
MONGODB_URI=mongodb://localhost:27017/healthcare
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare
```

5. Start the server:
```bash
npm start
```
Server runs at `http://localhost:3000` and automatically connects to MongoDB.

**Note**: On first run, the server will automatically create the database and initialize default medicines.

## Using the App
- Open `admin/signup.html` to create an account
- Then login at `admin/login.html`
- `admin/dashboard.html` is protected and requires a valid token
- Submit forms on `index.html` (Online Consultation) or `appointment.html` (Offline Appointment) to see them on the dashboard

## Database
- **MongoDB** is used for all data storage (users, consultations, appointments, medicines, payments)
- Data is persisted in MongoDB collections
- Default medicines are automatically initialized on first run
- Demo admin (`admin` / `admin123`) is accepted by backend for convenience

## Notes
- All data is stored in MongoDB (no more localStorage for backend data)
- The application uses Mongoose ODM for MongoDB operations
- Medicine stock is automatically updated when payments are processed

## Next Steps (optional)
- Replace localStorage with backend endpoints for forms
- Add rate limiting, password policy, and password reset
- Replace alerts with toasts and add better validation
- Deploy backend and serve the frontend via a static host
