# User Management System (MERN Stack)

A full-stack User Management System built using the MERN stack (MongoDB, Express, React, Node.js) with JWT authentication and Role-Based Access Control (RBAC).

## 🚀 Features

### Authentication
- User login with email and password
- JWT-based authentication
- Password hashing using bcrypt

### Authorization (RBAC)
- Admin: Full access (create, update, delete users)
- Manager: View and update non-admin users
- User: Manage own profile only

### User Management
- Create, update, delete users (Admin)
- View all users with filters and pagination
- View single user details
- Soft delete (inactive users cannot login)

### Profile
- Users can view and update their profile
- Cannot change role

### Audit Info
- createdAt, updatedAt
- createdBy, updatedBy

---

## 🛠️ Tech Stack

**Frontend**
- React (Hooks)
- Context API / Redux

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB

**Authentication**
- JWT (JSON Web Token)

---

## 📂 Project Structure

---

## ⚙️ Setup Instructions

### 1. Clone Repository


git clone https://github.com/your-username/user-management-system.git

cd user-management-system


---

### 2. Backend Setup


cd backend
npm install


Create `.env` file:


PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key


Run backend:


npm start


---

### 3. Frontend Setup


cd frontend
npm install
npm start


---

## 🌐 Deployment

- Frontend: Vercel / Netlify
- Backend: Render / Railway

---

## 🔐 API Security

- JWT protected routes
- Input validation
- Password hashing
- Role-based access control

---

## 📸 Demo

(Add your demo video link here)

---

## 🔗 Links

- GitHub Repo: (your link)
- Live Frontend: (your link)
- Backend API: (your link)

---

## 👤 Roles Summary

| Role    | Permissions |
|--------|------------|
| Admin  | Full access |
| Manager| Limited control |
| User   | Own profile only |

---

## 📌 Notes

- Unauthorized access returns 401/403
- Sensitive data (passwords) are never exposed
