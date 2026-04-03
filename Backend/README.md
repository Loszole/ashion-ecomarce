# E-Commerce Backend API

Production-ready Node.js/Express backend for the Ashion e-commerce platform.

## 🚀 Features

- ✅ **Authentication**: JWT-based with access/refresh tokens
- ✅ **Products**: Full CRUD with search, filter, sort, pagination
- ✅ **Shopping Cart**: Per-user persistent cart management
- ✅ **Orders**: Order creation, status tracking, admin management
- ✅ **Payments**: Cash-on-Delivery (COD) ready with extensible payment system
- ✅ **File Uploads**: Multer integration for product images
- ✅ **Security**: Helmet, CORS, rate limiting, input validation (Zod), NoSQL injection prevention
- ✅ **Testing**: Jest + Supertest with comprehensive test coverage
- ✅ **CI/CD**: GitHub Actions pipeline for automated testing
- ✅ **Code Quality**: ESLint + Prettier for consistent code style

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB 7.0+
- npm or yarn

### Setup

1. **Clone and Navigate**
```bash
cd Backend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your credentials
```

Required environment variables:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/ecommerce-db
JWT_SECRET=your_secret_key_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key_min_32_chars
CLIENT_URL=http://localhost:3000
```

4. **Run Development Server**
```bash
npm run dev
```

Server starts at `http://localhost:5000`

## 🧪 Testing

### Run Tests
```bash
npm test              # Run all tests once
npm run test:watch   # Run tests in watch mode
```

### Test Coverage
Tests cover:
- Authentication (register, login, refresh, logout)
- Product CRUD operations
- Cart management
- Order creation and status updates
- Input validation
- Authorization/permission checks

Create `.env.test` for test-specific configuration:
```env
MONGO_URI=mongodb://localhost:27017/ecom-test
JWT_SECRET=test_secret
JWT_REFRESH_SECRET=test_refresh_secret
NODE_ENV=test
```

## 🔧 Development

### Code Quality

```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Fix linting errors
npm run format        # Format code with Prettier
```

### Project Structure
```
Backend/
├── controllers/      # Route handlers
├── models/          # Mongoose schemas
├── routes/          # API endpoints
├── middleware/      # Auth, validation, error handling
├── utils/           # Helper utilities
├── __tests__/       # Test files
├── uploads/         # File uploads directory
├── server.js        # App entry point
└── .env             # Environment variables (not committed)
```

## 📚 API Documentation

### Authentication

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

Response:
```json
{
  "message": "User registered successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

#### Refresh Access Token
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }'
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }'
```

### Products

#### Get Products (Public)
```bash
curl -X GET "http://localhost:5000/api/products?page=1&limit=10&sort=-createdAt"
```

Response:
```json
{
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Premium Jacket",
      "price": 99.99,
      "stock": 50,
      "images": ["image1.jpg"]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

#### Create Product (Admin)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Jacket",
    "description": "High-quality winter jacket",
    "price": 99.99,
    "stock": 50,
    "category": "jackets"
  }'
```

#### Update Product (Admin)
```bash
curl -X PUT http://localhost:5000/api/products/{id} \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 89.99,
    "stock": 30
  }'
```

#### Delete Product (Admin)
```bash
curl -X DELETE http://localhost:5000/api/products/{id} \
  -H "Authorization: Bearer <access_token>"
```

### Shopping Cart

#### Get Cart
```bash
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer <access_token>"
```

#### Add to Cart
```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "quantity": 2
  }'
```

#### Update Cart Item
```bash
curl -X PUT http://localhost:5000/api/cart/{itemId} \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 3
  }'
```

#### Remove from Cart
```bash
curl -X DELETE http://localhost:5000/api/cart/{itemId} \
  -H "Authorization: Bearer <access_token>"
```

### Orders

#### Create Order
```bash
curl -X POST http://localhost:5000/api/orders/checkout \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "products": [
      {
        "product": "65a1b2c3d4e5f6g7h8i9j0k1",
        "quantity": 2
      }
    ],
    "shippingAddress": "123 Main St, City, State ZIP",
    "paymentMethod": "cod",
    "shippingCost": 10,
    "taxAmount": 15
  }'
```

#### Get My Orders
```bash
curl -X GET "http://localhost:5000/api/orders/my?page=1&limit=10" \
  -H "Authorization: Bearer <access_token>"
```

#### Track Order
```bash
curl -X POST http://localhost:5000/api/orders/track \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "email": "john@example.com"
  }'
```

#### Get Order Details (Admin)
```bash
curl -X GET http://localhost:5000/api/orders/list \
  -H "Authorization: Bearer <admin_token>"
```

#### Update Order Status (Admin)
```bash
curl -X PUT http://localhost:5000/api/orders/{orderId} \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shipped"
  }'
```

## 🔐 Security Features

- **Helmet.js**: Sets HTTP response headers for security
- **CORS**: Configured for frontend URL only
- **Rate Limiting**: Auth endpoints limited to 10 requests per 15 minutes
- **Input Validation**: Zod schemas for all request bodies
- **NoSQL Injection Prevention**: express-mongo-sanitize middleware
- **JWT Tokens**: Access tokens (15 min) + Refresh tokens (7 days)
- **Password Hashing**: bcryptjs with salt rounds 10

## 🚀 Deployment

### Production Checklist

1. **Environment Variables**
   ```bash
   NODE_ENV=production
   # Use strong, random keys:
   JWT_SECRET=$(openssl rand -base64 32)
   JWT_REFRESH_SECRET=$(openssl rand -base64 32)
   ```

2. **Database**
   - Use MongoDB Atlas with strong connection string
   - Enable network access restrictions
   - Use strong passwords

3. **Monitoring**
   - Set up error logging (Sentry, DataDog, etc.)
   - Monitor API response times
   - Set up uptime monitoring

4. **Deployment Options**
   - Heroku: `heroku create` → `git push heroku main`
   - AWS: Lambda + RDS or EC2 + MongoDB Atlas
   - Digital Ocean: App Platform or Droplet
   - Railway, Render: Platform-as-a-Service options

### Deploy to Heroku
```bash
heroku login
heroku create your-app-name
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set MONGO_URI=your_mongodb_atlas_url
git push heroku main
heroku logs --tail
```

## 📝 Payment Integration (Future)

COD is enabled by default. To add Stripe:

1. Add STRIPE_SECRET_KEY to .env
2. Create `Backend/controllers/stripeController.js`
3. Add Stripe routes to create payment intents
4. Update order status workflow

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
- Ensure MongoDB is running
- Check MONGO_URI is correct
- Verify network access in MongoDB Atlas

### JWT Token Expired
- Client should use refresh token to get new access token
- Refresh tokens are automatically revoked after 7 days

### CORS Errors
- Check CLIENT_URL matches your frontend URL
- Ensure credentials mode is enabled in frontend requests

## 📞 Support

- GitHub Issues: Report bugs
- Pull Requests: Submit improvements
- Documentation: Keep README updated

## 📄 License

MIT License - see LICENSE file

---

**Last Updated**: April 2026
**Version**: 1.0.0
**Maintained by**: Senior Full-Stack Engineer
