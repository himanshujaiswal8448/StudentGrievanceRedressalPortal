# 🎓 Student Grievance Redressal Portal

A full-stack web application built using the **MERN Stack** that enables students to submit, track, and manage complaints efficiently.  
The system improves transparency, communication, and resolution speed using real-time technologies.

---

## 🚀 Live Demo

- 🌐 Frontend: https://your-frontend-url.onrender.com
- ⚙️ Backend: https://your-backend-url.onrender.com

---

## 📌 Features

### 👨‍🎓 Student Side

- Submit complaints with title, description, category & priority
- Upload attachments (images/documents)
- Track complaint status (Pending / In Progress / Resolved)
- Real-time chat with admin 💬
- Notification system (🔔 bell + toast alerts)
- Dark / Light mode support

---

### 🛠️ Admin Side

- View all complaints
- Update complaint status
- View student details
- Search & filter complaints
  - By title
  - Category
  - Student name
  - Email
- Analytics dashboard (charts 📊)
- Attachment preview

---

### ⚡ Advanced Features

- 🔥 Real-Time Chat (Socket.io)
- 🔔 Smart Notification System (live updates)
- 🤖 AI-based Complaint Classification
- 👍 Voting System for prioritization
- 📩 Email Notifications (status updates)
- 🔍 Advanced Search System

---

## 🧑‍💻 Tech Stack

### Frontend

- React.js
- Tailwind CSS
- Vite

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas

### Other Tools

- Socket.io (Real-time communication)
- JWT (Authentication)
- Bcrypt (Password hashing)
- Nodemailer / Brevo (Email service)
- Recharts (Analytics)

---

## 📂 Project Structure

project-root/
│
├── frontend/ # React app (Landing + Auth)
├── dashboard/ # Protected dashboard (Student/Admin)
├── backend/ # Express API + MongoDB
│
└── README.md

---

## 🔐 Authentication

- JWT-based authentication
- Role-based access (Student / Admin)
- OTP verification via email
- Secure password hashing (bcrypt)

---

## 📡 API Endpoints

### Auth

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| POST   | /api/auth/register   | Register user    |
| POST   | /api/auth/login      | Login user       |
| POST   | /api/auth/verify-otp | OTP verification |

---

### Complaints

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| GET    | /api/complaints/mine  | Get user complaints |
| POST   | /api/complaints       | Create complaint    |
| GET    | /api/complaints/stats | Get stats           |

---

### Admin

| Method | Endpoint                         | Description        |
| ------ | -------------------------------- | ------------------ |
| GET    | /api/admin/complaints            | Get all complaints |
| PATCH  | /api/admin/complaints/:id/status | Update status      |

---

### Chat (Socket.io)

- joinRoom
- leaveRoom
- sendMessage
- receiveMessage

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo

⸻

2️⃣ Backend Setup

cd backend
npm install

Create .env file:

PORT=8080
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password
VITE_API_URL=http://localhost:8080/api

Run backend:

npm run dev

⸻

3️⃣ Frontend Setup

cd frontend
npm install
npm run dev

⸻

📊 System Architecture

* React (Frontend UI)
* Node.js + Express (Backend API)
* MongoDB (Database)
* Socket.io (Real-time communication)

⸻

🧠 AI Classification Logic

* Detects category using keywords
* Assigns priority automatically
* Reduces manual admin work

⸻

🔔 Notification System

* Real-time alerts via sockets
* Bell icon with unread count
* Dropdown notification panel
* Toast popups

⸻

👍 Voting System

* Users can vote on complaints
* Helps prioritize important issues
* Admin can sort complaints by votes

⸻

📦 Deployment

* Frontend: Render / Vercel
* Backend: Render
* Database: MongoDB Atlas

⸻

🧪 Testing

* Unit Testing (APIs)
* Integration Testing
* Manual UI Testing

⸻

🚀 Future Enhancements

* One User One Vote system
* Complaint Escalation system
* Push Notifications (mobile/browser)
* Multi-level admin hierarchy
* Advanced analytics dashboard

⸻

👨‍💻 Author

Himanshu Kumar
🔗 GitHub: https://github.com/himanshujaiswal8448

⸻

📜 License

This project is developed for academic purposes.
```
