# Social Media Backend API

## 📌 Project Description
This is a backend REST API for a social media application built using Node.js, Express, and MongoDB.

## 🚀 Features
- User Registration & Login (JWT)
- Create Posts
- Like & Comment
- Follow & Unfollow Users
- Secure Routes with Authentication

## 🛠 Tech Stack
- Node.js
- Express.js
- MongoDB
- JWT
- Mongoose

## ⚙ Installation

1. Clone the repo
2. Install packages:
   npm install
3. Create .env file:
   PORT=5000  
   MONGO_URI=your_mongodb_url  
   JWT_SECRET=your_secret
4. Run server:
   npx nodemon index.js

## 📬 API Endpoints

| Method | Route | Description |
|--------|--------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| POST | /api/posts | Create Post |
| GET | /api/users/me | Profile |

## 👩‍💻 Author
Akanksha Gotarne
