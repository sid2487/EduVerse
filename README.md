# EduVerse

A full-stack MERN application for buying and selling courses with secure authentication, admin controls, and payment integration.

## 🔐 Authentication
- JWT-based login and signup
- Seperate authentication for admin and user
- Role-based access (User / Admin)
- Password hashing with bcrypt

## 🎓 User Features
- Browse available courses
- Purchase only if authenticated
- View course details
- Buy courses via secure payments
- Access enrolled courses

## 🛠️ Admin Features
- Protected admin dashboard
- Create, update, delete courses
- Upload images/media for each courseserver
- Manage pricing and content

## 💳 Payment Integration
- Stripe integration
- Order and transaction history

## ⚙️ Tech Stack
- Frontend: React.js, Axios, React Router
- Backend: Node.js, Express.js, MongoDB
- Authentication: JWT, bcrypt
- File Upload: Multer + Cloudinary
- Payment: Stripe 

## 🗂️ Folder Structure
- `/Frontend`: React frontend
- `/Backend`: Express backend (controllers, routes, models, middleware, config, utils)

## 🔗 Live Demo

👉 [Click here to view the deployed site](https://edu-verse-vert.vercel.app/)
