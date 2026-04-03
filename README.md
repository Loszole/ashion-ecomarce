# Ashion E-Commerce Platform

A production-ready full-stack e-commerce application built with Next.js/React (Frontend) and Node.js/Express (Backend).

## 🌟 Project Overview

**Ashion** is a complete e-commerce solution featuring:
- **Frontend**: React 17 with React Router, responsive design, admin dashboard
- **Backend**: Express.js with MongoDB, JWT authentication, full API
- **Security**: HTTPS-ready, input validation, rate limiting, NoSQL injection prevention
- **Features**: Products, cart, orders, COD payments, user authentication, admin controls
- **Quality**: Automated tests, CI/CD pipeline, comprehensive documentation

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ (for both Frontend and Backend)
- MongoDB 7.0+ (local or MongoDB Atlas)
- npm or yarn

### 5-Minute Setup

```bash
# 1. Clone repository
git clone https://github.com/loszole/ashion-ecomarce.git
cd ashion-ecomarce

# 2. Backend Setup
cd Backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets
npm install
npm run dev &

# 3. Frontend Setup (in new terminal)
cd ../Frontend
npm install
npm start

# 4. Access Application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

## 📁 Project Structure

```
ashion-ecomarce/
├── Backend/                    # Express API server
│   ├── models/                 # Mongoose schemas
│   ├── controllers/            # Request handlers
│   ├── routes/                 # API endpoints
│   ├── middleware/             # Auth, validation, error handling
│   ├── utils/                  # Helper utilities
│   ├── __tests__/              # Test files
│   ├── server.js               # Entry point
│   ├── .env.example            # Environment template
│   ├── package.json            # Dependencies
│   └── README.md               # Backend documentation
│
├── Frontend/                   # React application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── utils/              # Helper functions
│   │   └── app.js              # Main App component
│   ├── public/                 # Static files
│   ├── package.json            # Dependencies
│   └── README.md               # Frontend documentation
│
├── scripts/                    # Utility scripts
│   └── smoke-api.ps1           # API validation script
│
├── .github/workflows/          # CI/CD pipelines
│   └── backend.yml             # Backend automated tests
│
├── .gitignore                  # Git exclusions
└── README.md                   # This file
```

## 🔧 Installation

### Backend Installation

```bash
cd Backend
npm install

# Required dependencies will be installed:
# - express, mongoose, jsonwebtoken, bcryptjs
# - helmet (security headers)
# - cors (cross-origin resource sharing)
# - express-mongo-sanitize (NoSQL injection prevention)
# - zod (input validation)
# - multer (file uploads)
# - jest, supertest (testing)
# - prettier, eslint (code quality)
```

### Frontend Installation

```bash
cd ../Frontend
npm install

# Key dependencies:
# - react, react-router-dom
# - recharts (data visualization)
# - react-beautiful-dnd (drag-and-drop)
# - axios (HTTP client)
```

## 🚀 Running Locally

### Start Backend

```bash
cd Backend

# Copy environment template
cp .env.example .env

# Edit .env file:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/ecommerce-db
# JWT_SECRET=your_random_secret_key
# JWT_REFRESH_SECRET=another_random_key

# Install dependencies
npm install

# Run development server (with auto-reload)
npm run dev

# Server runs at: http://localhost:5000
```

### Start Frontend

```bash
cd Frontend

# Install dependencies
npm install

# Start development server
npm start

# Opens automatically at: http://localhost:3000
```

### Verify Setup

Run the smoke test to validate all endpoints:

```bash
# From project root
./scripts/smoke-api.ps1

# Or manually test:
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Pass123"}'
```

## 📚 API Documentation

### Authentication Endpoints

**Register**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Login**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

Response:
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "65a1...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Refresh Token**
```bash
POST /api/auth/refresh
{
  "refreshToken": "eyJhbGc..."
}
```

**Logout**
```bash
POST /api/auth/logout
{
  "refreshToken": "eyJhbGc..."
}
```

### Products Endpoints

**List Products**
```bash
GET /api/products?page=1&limit=10&sort=-createdAt&search=jacket
```

**Create Product (Admin)**
```bash
POST /api/products
Authorization: Bearer {accessToken}

{
  "name": "Premium Jacket",
  "price": 99.99,
  "stock": 50,
  "description": "High-quality jacket"
}
```

### Orders Endpoints

**Create Order**
```bash
POST /api/orders/checkout
Authorization: Bearer {accessToken}

{
  "products": [{"product": "65a1...", "quantity": 2}],
  "shippingAddress": "123 Main St",
  "paymentMethod": "cod"
}
```

See [Backend README](Backend/README.md) for complete API documentation.

## 🧪 Testing

### Backend Tests

```bash
cd Backend

# Run all tests
npm test

# Watch mode (re-run on file changes)
npm run test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## 🚢 Deployment

### Backend Deployment (Heroku Example)

```bash
cd Backend

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set MONGO_URI=your_mongodb_atlas_url

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

## 🔒 Security Features

✅ **Helmet.js** - HTTP security headers  
✅ **CORS** - Cross-origin request control  
✅ **Rate Limiting** - Prevent brute force attacks  
✅ **Input Validation** - Zod schemas for all requests  
✅ **Password Hashing** - bcryptjs with 10 salt rounds  
✅ **JWT Tokens** - Access (15min) + Refresh (7d) tokens  
✅ **NoSQL Injection Prevention** - express-mongo-sanitize  

---

**Version**: 1.0.0  
**Status**: ✅ Production Ready - MVP Complete
