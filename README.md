[API Documentation](https://documenter.getpostman.com/view/26246009/2s9YeK2peE).


# 🪙 Almatar Loyalty

A simple Node.js backend application that allows users to transfer points between each other securely.  
Includes features like pending transfers, expiration after 10 minutes, and atomic confirmation using MongoDB transactions.

---

## ⚙️ Features

- User registration and login (with JWT authentication)
- Transfer points between users using their email
- Transfers start as **pending** and must be confirmed by the sender within **10 minutes**
- Pending transfers expire automatically after 10 minutes
- Atomic points deduction/addition using MongoDB transactions
- RESTful API documented using Postman

---

## 🧩 Tech Stack

- **Node.js** (Express)
- **MongoDB + Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing

---

## 🚀 Setup & Run

### 📋 Requirements

- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)

---

### ⚡ Steps

```bash
# 1. Clone the repo
git clone <YOUR_REPO_URL>
cd <YOUR_REPO_NAME>

# 2. Install dependencies
npm install

# 3. Create .env file
# (or copy from .env.example)

# Example .env content:
MONGO_URI=<your-mongo-connection-string>
JWT_SECRET=<any-secret-key>
PORT=5000

# 4. Run the development server
npm run dev
```
