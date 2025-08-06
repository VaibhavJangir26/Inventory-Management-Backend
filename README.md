# 🚀 InventoryHub – Scalable Inventory Management Backend with TypeScript, PostgreSQL & JWT Auth

Welcome to **InventoryHub** — a secure and scalable inventory management backend built for modern applications. Whether you’re building a mobile app with Flutter or a web dashboard in React, InventoryHub provides a fast and structured API foundation.

---

## 🧱 Tech Stack

| Tech           | Purpose                                  |
|----------------|------------------------------------------|
| 🟦 **TypeScript**   | Type-safe backend development            |
| ⚙️ **Express.js**   | Lightweight, fast web framework          |
| 🌐 **Prisma**       | Type-safe ORM for PostgreSQL            |
| 🐘 **PostgreSQL**   | Robust, scalable relational database     |
| 🔐 **JWT**          | Secure authentication & role management |
| 🧠 **Redis**        | Caching for performance + session mgmt  |

---

## 🔐 Authentication & Security Features

- 🔑 **JWT Access Tokens** – Short-lived (15 min) secure tokens
- ♻️ **Refresh Tokens** – Stored securely in DB, valid for 7 days
- 🧑‍💼 **Role-Based Access Control (RBAC)** – Admin, Manager, User
- 🚪 **Logout Flow** – Deletes refresh token from DB
- 🔄 **Token Rotation** – Refresh endpoint to issue new access token
- ⚡ **Redis Caching** – High-speed access to frequently used data
- 🛡️ **Optional Rate Limiting** – Prevent token abuse

---

## 📦 Core Features

| ✅ Feature                                   | Description                                 |
|--------------------------------------------|---------------------------------------------|
| Full CRUD APIs                             | Products, Orders, Users                     |
| Modular MVC Structure                      | Clean & scalable codebase                   |
| Role-Based Middleware                      | Access control per route                    |
| Stock & Order Tracking                     | Keep inventory synced in real-time          |
| Redis-Backed Cache                         | Improve performance & reduce DB hits        |
| Mobile-Ready API                           | Perfect for cross-platform frontend (Flutter, React) |
| Scalable Auth System                       | Production-ready refresh/access token setup |

---

## 📁 Project Structure

/src
├── controllers // Route logic
├── routes // API endpoints
├── middleware // JWT auth, RBAC
├── utils // Cache service
└── index.ts // Main app bootstrap




---

## 🔄 Token Refresh Flow

1. **Access token** expires after 15 minutes.
2. **Refresh token** (HTTP-only cookie or secure store) used to get a new access token.
3. **Logout** deletes refresh token from DB.
4. **Optional**: Add Redis + rate limiting to prevent abuse.

---

## 🚀 Getting Started

```bash
# Clone the project
git clone https://github.com/yourusername/Inventory-Management-Backend.git
cd inventory-backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, REDIS_URL, etc.

# Prisma DB setup
npx prisma generate
npx prisma migrate dev --name init

# Run the server
npm run dev

🔌 API Overview (Sample)
🔑 Auth Routes
Method	Route	Description
POST	/auth/signup/admin	Register new admin 
POST	/auth/signup/user	Register new user 
POST	/auth/login	Login and get token
POST	/auth/refresh	Refresh token endpoint
POST	/auth/logout	Logout user

📦 Inventory Routes
Method	Route	Role Required
GET	/order	Manager/Admin
POST	/order/create	Admin
PATCH	/order/id/:id	Admin
DELETE	/order/id/:id	Admin

# And many more routes are there for managemet
