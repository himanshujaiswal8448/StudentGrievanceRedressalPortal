# Student Grievance Redressal Portal

A full-stack MERN based Student Grievance Redressal Portal where students can submit complaints, track status, chat with admin, vote on common complaints, upload attachments, and make fee payments using Razorpay. Admin can manage complaints, update status, view analytics, chat with students, and monitor payment transactions.

---

## Live Project

Frontend: https://himanshu-grievance.onrender.com/  
Backend: https://your-backend-url.onrender.com

---

## Features

### Student Features

- Student registration and login
- OTP verification for signup/login
- JWT based authentication
- Role based protected routes
- Submit complaints with title, description, category, priority, and department
- Upload complaint attachments/images
- View own complaints
- View all complaints
- Search existing complaints
- Vote/unvote complaints
- View voters list
- Real-time chat with admin
- Notification bell for admin replies
- Razorpay fee payment
- View payment history
- Dark/Light mode support

### Admin Features

- Admin protected dashboard
- View all complaints
- Search complaints by title, category, student name, or email
- Filter complaints by status/category
- Update complaint status: Pending, In Progress, Resolved
- View complaint attachments
- Real-time chat with students
- Complaint analytics dashboard
- View votes on complaints
- Payment analytics dashboard
- View all student payments
- Revenue and transaction tracking

---

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Socket.IO Client
- React Hot Toast
- Recharts
- Lucide React
- Framer Motion
- Razorpay Checkout

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Multer
- Socket.IO
- Razorpay
- Nodemailer/Brevo
- CORS
- Helmet
- Morgan

---

## Project Structure

```txt
StudentGrievanceRedressalPortal
│
├── frontend
│   ├── src
│   │   ├── api
│   │   │   └── client.js
│   │   ├── components
│   │   ├── context
│   │   ├── layouts
│   │   ├── pages
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── AllComplaints.jsx
│   │   │   ├── PaymentPage.jsx
│   │   │   ├── MyPayments.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── AdminPayments.jsx
│   │   ├── socket.js
│   │   └── App.jsx
│   └── package.json
│
└── backend
    ├── src
    │   ├── config
    │   ├── controllers
    │   ├── middleware
    │   ├── models
    │   ├── routes
    │   ├── services
    │   └── index.js
    └── package.json
```

---

## Routes

### Public Routes

```txt
/
 /login
 /register
 /verify-signup-otp
 /verify-login-otp
```

### Private Routes

### Student Routes

```txt
/student
/student/all-complaints
/student/payment
/student/my-payments
```

### Admin Routes

```txt
/admin
/admin/payments
```

---

## Environment Variables

### Backend `.env`

```env
PORT=8080
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password_or_smtp_key

FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:8080/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/student-grievance-redressal-portal.git
cd student-grievance-redressal-portal
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```txt
http://localhost:8080
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

## API Endpoints

### Auth APIs

```txt
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-signup-otp
POST /api/auth/verify-login-otp
```

### Complaint APIs

```txt
POST /api/complaints
GET /api/complaints/mine
GET /api/complaints/all
GET /api/complaints/stats
PATCH /api/complaints/:id/vote
```

### Admin APIs

```txt
GET /api/admin/complaints
PATCH /api/admin/complaints/:id/status
```

### Chat APIs

```txt
GET /api/chat/:complaintId
```

### Payment APIs

```txt
POST /api/payments/create-order
POST /api/payments/verify
GET /api/payments/my
GET /api/payments/all
```

---

## Important Functionalities

### Complaint Flow

1. Student logs in.
2. Student submits a complaint with optional attachment.
3. Complaint is stored in MongoDB.
4. Admin views complaint.
5. Admin updates complaint status.
6. Student can track status and chat with admin.

### Voting Flow

1. Student opens All Complaints page.
2. Student searches similar issues.
3. Student votes on existing complaint.
4. One student can vote/unvote a complaint.
5. Voters list can be viewed in popup.

### Payment Flow

1. Student opens payment page.
2. Student enters amount and payment type.
3. Razorpay checkout opens.
4. Payment success is verified.
5. Transaction is stored in MongoDB.
6. Student can view payment history.
7. Admin can view all payments and revenue analytics.

### Real-Time Chat Flow

1. Student/Admin opens complaint chat.
2. Socket.IO joins complaint room.
3. Messages are sent in real time.
4. Messages are saved in MongoDB.
5. Student receives notification for admin reply.

---

## Deployment on Render

### Backend Render Settings

Build Command:

```bash
npm install
```

Start Command:

```bash
npm start
```

Add backend environment variables in Render dashboard.

### Frontend Render Settings

Build Command:

```bash
npm install && npm run build
```

Publish Directory:

```txt
dist
```

Add frontend environment variables:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Backend CORS

Update backend allowed origins:

```js
const allowedOrigins = [
  "http://localhost:5173",
  "https://your-frontend-url.onrender.com",
];
```

---

## Testing Checklist

- Register student
- Verify signup OTP
- Login student
- Submit complaint without attachment
- Submit complaint with attachment
- View complaint in student dashboard
- View complaint in admin dashboard
- Update status from admin
- Test real-time chat
- Test notification bell
- Open all complaints
- Search complaint
- Vote/unvote complaint
- View voters popup
- Make Razorpay test payment
- Check student payment history
- Check admin payment analytics
- Test protected routes
- Test dark/light mode
- Test refresh on every route

---

## Razorpay Test Payment

Use Razorpay test mode.

Example test card:

```txt
RuPay
Card Number: 6527 6589 0000 1005
Expiry: Any future date
CVV: 123
OTP: 123456
```

Net banking test mode can also be used.

---

## Future Enhancements

- Payment receipt download
- Export complaints report
- Export payments report
- Admin notification center
- Student profile page
- Monthly revenue chart
- Complaint resolution time analytics
- Super Admin role
- Department-wise complaint assignment

---

## Author

Himanshu Kumar
Full Stack MERN Developer
LinkedIn : [https://www.linkedin.com/in/himanshujaiswal8448/ ](https://www.linkedin.com/in/himanshujaiswal8448/)
GitHub: [https://github.com/himanshujaiswal8448](https://github.com/himanshujaiswal8448)

```

```
