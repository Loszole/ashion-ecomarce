# Ashion E-Commerce Project Documentation

## 1. Project Overview

Ashion is a full-stack fashion e-commerce application composed of:

- A React-based storefront and admin interface in `Frontend/`
- An Express + MongoDB backend API in `Backend/`

The project is intended to support:

- Public product browsing
- Customer login and registration
- Product categories
- Cart management
- Order creation and checkout
- Homepage content management
- Admin product, category, order, and settings management
- Audit logging for important admin actions

The repository is currently in an active implementation state. The backend foundation is significantly more complete than the frontend integration layer.

## 2. High-Level Architecture

## 2.1 Frontend

- Framework: React 17
- Router: `react-router-dom` v5
- Build tool: `react-scripts`
- Styling: Bootstrap, theme CSS, SASS, Font Awesome, jQuery-era theme assets
- API access: Browser fetch calls through the CRA proxy to the backend

## 2.2 Backend

- Runtime: Node.js
- Framework: Express 5
- Database: MongoDB with Mongoose
- Auth: JWT + bcryptjs
- Security middleware: Helmet, CORS, express-rate-limit
- Upload handling: Multer

## 2.3 Data Flow

1. The React frontend issues HTTP requests to `/api/*`.
2. CRA proxies those requests to `http://localhost:5000`.
3. Express routes dispatch to controllers.
4. Controllers validate input, query Mongoose models, and return JSON.
5. JWT-protected endpoints rely on Bearer token authorization.

## 3. Repository Structure

## 3.1 Top Level

- `Backend/` - Express API and MongoDB models
- `Frontend/` - React storefront and admin UI
- `Documantation/` - Project documentation

## 3.2 Backend Structure

- `controllers/` - Route handlers and business logic
- `middleware/` - Auth, validation, error handling, rate limiting
- `models/` - Mongoose schemas
- `routes/` - API route definitions
- `utils/` - Shared utility classes such as `AppError`
- `server.js` - Backend bootstrap entry point

## 3.3 Frontend Structure

- `src/app.js` - Main route map
- `src/index.js` - React DOM mount
- `src/Components/Shop/` - Storefront pages and shared UI
- `src/Components/Admin/` - Admin dashboard pages
- `src/assects/` - Theme CSS, JS, images, fonts, SASS

## 4. Technology Stack

## 4.1 Backend Dependencies

- `express` - HTTP server and routing
- `mongoose` - MongoDB ODM
- `dotenv` - Environment variable loading
- `cors` - Cross-origin support
- `helmet` - Security headers
- `jsonwebtoken` - JWT token creation and verification
- `bcryptjs` - Password hashing
- `multer` - File upload handling
- `express-rate-limit` - Basic request throttling
- `nodemon` - Development auto-reload

## 4.2 Frontend Dependencies

- `react`
- `react-dom`
- `react-router-dom`
- `react-scripts`
- `sass`
- `recharts`
- `typescript` plus React type packages

## 5. Environment and Startup

## 5.1 Backend Environment Variables

The backend expects the following environment variables:

- `JWT_SECRET` - Required. The backend exits immediately if it is missing.
- `MONGO_URI` - Optional. Defaults to `mongodb://localhost:27017/ecomdb`.
- `PORT` - Optional. Defaults to `5000`.
- `NODE_ENV` - Optional. Affects error response stack traces.

Example `.env` values:

```env
JWT_SECRET=replace_with_a_strong_secret
MONGO_URI=mongodb://localhost:27017/ecomdb
PORT=5000
NODE_ENV=development
```

## 5.2 Backend Startup

```bash
cd Backend
npm install
npm run dev
```

Production startup:

```bash
cd Backend
npm install
npm start
```

## 5.3 Frontend Startup

```bash
cd Frontend
npm install
npm start
```

The frontend uses a proxy value in `Frontend/package.json`:

```json
"proxy": "http://localhost:5000"
```

This means frontend API requests can target relative paths such as `/api/products` during local development.

## 5.4 MongoDB Requirement

MongoDB must be running before the backend can successfully serve data. By default, the application expects a local MongoDB instance.

## 6. Backend Boot Process

`Backend/server.js` performs the following:

1. Loads environment variables through `dotenv`
2. Creates the Express app
3. Enables CORS and Helmet
4. Registers JSON and URL-encoded body parsers
5. Serves uploaded files from `/uploads`
6. Verifies that `JWT_SECRET` exists
7. Connects to MongoDB through Mongoose
8. Registers route groups for auth, products, orders, cart, categories, homepage, audit logs, and settings
9. Registers the 404 handler
10. Registers the global error handler
11. Starts listening on the configured port

## 7. Security Model

## 7.1 Authentication

Authentication is JWT-based.

- Users log in through `/api/auth/login`
- The backend signs a token with `jsonwebtoken`
- Tokens expire in `7d`
- Protected routes require an `Authorization` header in this format:

```http
Authorization: Bearer <token>
```

Example login credentials format:

- User login (demo)
	- User ID (Email): `john@example.com`
	- Password: `secret123`

- Admin login (demo)
	- User ID (Email): `admin@ashion.com`
	- Password: `Admin1234`

Note:

- The project does not ship with a hardcoded default user.
- Create the user first via `/api/auth/register` before using `/api/auth/login`.
- Use strong, unique credentials in production.

## 7.2 Authorization

Role-based access control is implemented through `authorizeRoles(...roles)`.

Supported user roles observed in the project:

- `superadmin`
- `admin`
- `editor`
- `support`
- `user`

## 7.3 Other Security Controls

- `helmet()` applies security-related HTTP headers
- `express-rate-limit` throttles login and registration attempts
- Validation middleware blocks malformed payloads
- ObjectId validation prevents invalid identifier handling in many routes

## 7.4 Security Gaps

Current security limitations include:

- CORS is open to all origins
- No refresh token strategy
- No password reset flow
- No email verification
- No CSRF-specific design because auth is header-token based, but frontend storage strategy still matters
- No advanced sanitization or content filtering

## 8. Backend Modules

## 8.1 Authentication Module

Files involved:

- `routes/auth.js`
- `controllers/authController.js`
- `middleware/auth.js`
- `middleware/rateLimit.js`
- `middleware/validate.js`
- `models/User.js`

Responsibilities:

- Register new users
- Hash passwords before storage
- Verify login credentials
- Return JWT tokens
- Protect private routes
- Restrict access by role

Observed behavior:

- Registration returns a success message only, not an auto-login token
- Login returns both a token and a basic user payload
- Password minimum length is 6 characters

## 8.2 Product Module

Files involved:

- `routes/products.js`
- `controllers/productController.js`
- `models/Product.js`

Responsibilities:

- Create products
- List products
- Filter and search products
- Update products
- Delete products
- Handle image uploads

Product fields:

- `name`
- `description`
- `price`
- `category`
- `images`
- `stock`
- `createdAt`
- `updatedAt`

Important note:

`category` is stored as a string, not a foreign key reference to `Category`. This keeps the model simple but weakens relational consistency.

## 8.3 Category Module

Files involved:

- `routes/categories.js`
- `controllers/categoryController.js`
- `models/Category.js`

Responsibilities:

- Manage category records
- Support category listing and admin CRUD

Typical fields:

- `name`
- `description`

## 8.4 Cart Module

Files involved:

- `routes/cart.js`
- `controllers/cartController.js`
- `models/Cart.js`

Responsibilities:

- Create or retrieve a user's cart
- Add items to the cart
- Update item quantities
- Remove items
- Clear the cart

Cart data design:

- One cart per user
- Items include a product reference, quantity, and stored unit price snapshot

Business rules currently implemented:

- Quantity must be a positive integer
- Product must exist before it can be added
- Requested quantity cannot exceed current product stock

## 8.5 Order Module

Files involved:

- `routes/orders.js`
- `controllers/orderController.js`
- `models/Order.js`

Responsibilities:

- Create orders directly
- Create orders from the cart through checkout
- List and filter orders for admin/support roles
- Update order status
- Delete orders

Order fields:

- `user`
- `products[]`
- `subtotal`
- `taxAmount`
- `shippingCost`
- `total`
- `paymentMethod`
- `paymentStatus`
- `status`
- `shippingAddress`
- `createdAt`
- `updatedAt`

Supported payment methods:

- `cod`
- `stripe`
- `paypal`

Supported order statuses:

- `pending`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

Supported payment statuses:

- `pending`
- `paid`
- `failed`
- `refunded`

### Transactional Checkout Logic

The backend now contains a more robust checkout flow:

1. Read enabled payment configuration from site settings
2. Reject disabled payment methods
3. Validate each product and current stock inside a Mongoose session
4. Recalculate price using product records in the database
5. Create the order record
6. Decrement stock for each purchased product
7. Insert an audit log entry
8. Clear the cart when using `/api/orders/checkout`

This is one of the most important backend improvements because it protects stock consistency better than a simple non-transactional order insert.

## 8.6 Settings Module

Files involved:

- `routes/settings.js`
- `controllers/settingsController.js`
- `models/SiteSetting.js`

Responsibilities:

- Persist configurable site sections
- Expose public payment method availability to the storefront
- Support admin-managed settings updates

Current sections:

- `general`
- `payment`
- `shipping`
- `seo`
- `email`

Payment section defaults:

- `provider: cod`
- `codEnabled: true`
- `stripeEnabled: false`
- `paypalEnabled: false`

This matches the current launch strategy where cash on delivery is available first and other providers can be activated later.

## 8.7 Homepage Layout Module

Files involved:

- `routes/homepage.js`
- `controllers/homepageController.js`
- `models/HomepageLayout.js`

Responsibilities:

- Store and return a structured homepage layout document
- Support admin editing of homepage content structure

Current state:

- Backend support exists
- Full frontend editor integration appears incomplete

## 8.8 Audit Log Module

Files involved:

- `routes/auditLogs.js`
- `controllers/auditLogController.js`
- `models/AuditLog.js`

Responsibilities:

- Record notable actions such as order changes and order creation
- Allow admins to review audit history

Current limitations:

- This is primarily a read-oriented administrative tool
- Long-term retention, pruning, and archive strategy are not implemented

## 9. Middleware Layer

## 9.1 `auth`

Behavior:

- Reads `Authorization` header
- Removes `Bearer ` prefix
- Verifies JWT using `JWT_SECRET`
- Loads the current user from the database excluding password
- Rejects missing token, invalid token, or missing user

## 9.2 `authorizeRoles`

Behavior:

- Requires `auth` to have already attached `req.user`
- Rejects requests if the user's role is not in the allowed list

## 9.3 Validation Middleware

Implemented request guards include:

- `validateRegister`
- `validateLogin`
- `validateProductPayload`
- `validateCategoryPayload`
- `validateOrderPayload`
- `validateOrderStatusPayload`
- `validateObjectIdParam`

These provide the first line of defense against malformed input.

## 9.4 Error Handling

The backend uses:

- `AppError` for operational application errors
- `notFound` to convert unmatched routes into 404s
- `errorHandler` for centralized JSON error responses

Handled cases include:

- Mongoose validation errors
- Mongoose cast errors
- Duplicate key errors
- Generic application errors

## 9.5 Rate Limiting

Auth endpoints are limited to:

- 10 requests per 15 minutes

This reduces basic credential stuffing and brute-force pressure.

## 10. Data Model Summary

## 10.1 User

Purpose:

- Authentication identity
- Ownership of carts and orders
- Role carrier for authorization

Observed fields:

- `name`
- `email`
- `password`
- `role`

## 10.2 Product

Purpose:

- Represents an item for sale

Observed fields:

- `name`
- `description`
- `price`
- `category`
- `images[]`
- `stock`
- `createdAt`
- `updatedAt`

## 10.3 Category

Purpose:

- Organizes products into user-visible groups

Observed fields:

- `name`
- `description`

## 10.4 Cart

Purpose:

- Persistent pre-checkout basket per user

Observed fields:

- `user`
- `items[]`

Item structure:

- `product`
- `quantity`
- `price`

## 10.5 Order

Purpose:

- Immutable purchase snapshot for fulfillment and reporting

Observed fields:

- `user`
- `products[]`
- `subtotal`
- `taxAmount`
- `shippingCost`
- `total`
- `paymentMethod`
- `paymentStatus`
- `status`
- `shippingAddress`
- `createdAt`
- `updatedAt`

## 10.6 SiteSetting

Purpose:

- Key/value site configuration storage

Observed fields:

- `key`
- `value`

## 10.7 HomepageLayout

Purpose:

- Dynamic homepage data source for content management

## 10.8 AuditLog

Purpose:

- Administrative traceability

## 11. Frontend Application

## 11.1 Frontend Route Map

The main route registration is in `Frontend/src/app.js`.

Observed public routes:

- `/`
- `/shop`
- `/kids`
- `/womens`
- `/mens`
- `/blog`
- `/contact`
- `/login`
- `/register`
- `/cart`
- `/wishlist`
- `/product-details`
- `/blog-details`

All public routes are wrapped with a shared layout:

- `Header`
- page component
- `Footer`

`Preloader` is rendered globally.

## 11.2 Storefront Components

Main customer-facing components include:

- `Home.jsx`
- `Shop.jsx`
- `Mens.jsx`
- `Womens.jsx`
- `Kids.jsx`
- `Prodect_Details.jsx`
- `Cart.jsx`
- `Wishlist.jsx`
- `Blog.jsx`
- `Blog_Details.jsx`
- `Contact.jsx`
- `Login.jsx`
- `Register.jsx`
- `NotFound.jsx`

## 11.3 Current Frontend Behavior

What exists today:

- The storefront theme and page structure are present
- Login and registration views exist
- Multiple product-category pages exist
- The admin UI shell exists

What is not fully integrated yet:

- Dynamic cart state tied to `/api/cart`
- Checkout submission using `/api/orders/checkout`
- Authorization headers consistently sent to protected admin endpoints
- Fully wired settings management UI
- End-to-end use of backend search, pagination, and filtering from the storefront

## 12. Admin Area

Admin components observed under `Frontend/src/Components/Admin/` include:

- `Admin.jsx`
- `Dashboard.jsx`
- `Products.jsx`
- `Orders.jsx`
- `Categories.jsx`
- `Users.jsx`
- `Inventory.jsx`
- `Reviews.jsx`
- `Discounts.jsx`
- `Reports.jsx`
- `Content.jsx`
- `Appearance.jsx`
- `Messages.jsx`
- `AuditLogs.jsx`
- `HomepageEditor.jsx`
- `Settings.jsx`

## 12.1 Admin Areas With Real Backend Support

Most directly supported by backend endpoints today:

- Products
- Categories
- Orders
- Audit logs
- Homepage layout
- Settings

## 12.2 Admin Areas That Appear Incomplete or Placeholder-Only

- Users
- Inventory
- Reviews
- Discounts
- Reports
- Content
- Appearance
- Messages

The UI exists conceptually, but full backend support or frontend wiring is incomplete in several of these sections.

## 13. File Uploads and Media

The backend serves uploaded files from:

- `Backend/uploads/`

Available publicly through:

- `/uploads/*`

Current image constraints from the backend implementation:

- Image-only uploads
- Restricted MIME types
- File size limit in middleware

Operational note:

There is no robust media lifecycle management yet. Deleting a product may not automatically delete its uploaded files from disk.

## 14. Business Workflows

## 14.1 Registration Workflow

1. User submits name, email, password, and optionally role
2. Backend validates the request
3. Backend checks whether email already exists
4. Password is hashed with bcryptjs
5. User record is saved
6. Backend returns success message

## 14.2 Login Workflow

1. User submits email and password
2. Backend validates the request
3. Backend finds the user by email
4. Password is compared with the hash
5. JWT token is generated for 7 days
6. Backend returns token and user information

## 14.3 Product Management Workflow

1. Admin/editor submits product data and optional files
2. Backend validates fields
3. Multer processes files
4. Product is created or updated in MongoDB
5. Product becomes available to the public listing API

## 14.4 Cart Workflow

1. Authenticated user requests cart
2. If no cart exists, one is created automatically
3. User adds or updates items
4. Backend validates stock and quantity
5. Cart persists in MongoDB by user id

## 14.5 Checkout Workflow

1. Authenticated user calls `/api/orders/checkout`
2. Backend loads the cart
3. Backend verifies enabled payment method
4. Backend validates current stock for all items
5. Backend creates an order in a transaction
6. Backend decrements stock
7. Backend writes an audit log entry
8. Backend clears the cart
9. Backend returns the new order

## 15. Known Inconsistencies and Technical Debt

The codebase is functional in many core areas, but several inconsistencies should be documented clearly.

## 15.1 Category Denormalization

`Product.category` is stored as a string instead of referencing the `Category` collection.

Impact:

- Category renames can drift from products
- No foreign-key-style consistency
- Reporting and joins are weaker

## 15.2 Frontend and Backend Completion Gap

The backend supports several features that the frontend does not fully use yet, including:

- Persistent cart APIs
- Checkout from cart
- Payment settings exposure
- Backend pagination and search controls

## 15.3 Payment Gateway Gap

The data model supports `stripe` and `paypal`, but actual payment processing is not implemented.

Current practical mode:

- COD-first checkout strategy

## 15.4 Admin Coverage Gap

Several admin pages are present at the component level but are not fully connected to backend features or are missing backend support altogether.

## 15.5 Auth Integration Gap on Frontend

The backend enforces auth and roles on many routes, but the frontend does not consistently send Bearer tokens for all protected operations.

## 16. Current Project Strengths

The project already has strong building blocks:

- Clear separation of backend models, controllers, routes, and middleware
- JWT auth and role authorization
- Centralized error handling
- Validation middleware
- Rate limiting for auth endpoints
- Persistent cart model
- Transactional checkout logic
- Site settings abstraction for future admin control
- Admin-focused audit logging

These are the right foundations for turning the project into a full production-ready storefront.

## 17. Current Project Gaps

The most important remaining gaps are:

- Frontend cart integration
- Frontend checkout integration
- Real Stripe and PayPal processing
- Password recovery and email verification
- Review system
- Discount and coupon engine
- Better reporting and analytics
- Image lifecycle cleanup
- Tightened CORS and production hardening
- Consistent frontend auth state management

## 18. Recommended Next Implementation Priorities

Recommended order of work:

1. Integrate frontend cart with `/api/cart`
2. Integrate storefront checkout with `/api/orders/checkout`
3. Wire admin settings UI to `/api/settings`
4. Add frontend authorization header management
5. Implement payment gateways after COD flow is stable
6. Normalize product-to-category relationship if consistency becomes a priority
7. Complete missing admin modules such as users, reports, discounts, and reviews

## 19. Maintenance Notes

When changing this project, keep the following in mind:

- Backend API changes should be reflected in frontend fetch logic
- Order creation must remain stock-safe and transactional
- Any new protected route should use both auth and role checks where needed
- Settings keys should stay stable because they are used as persistent lookup identifiers
- Uploaded files should eventually gain a cleanup strategy

## 20. Conclusion

Ashion is already more than a static e-commerce theme. It contains a real backend domain model, JWT auth, persistent carts, configurable payment settings, and transactional order creation.

At the same time, it is not yet a complete production commerce platform. The main work remaining is frontend integration, payment execution, and completion of the broader admin suite.

This documentation reflects the current repository state and should be updated whenever:

- API contracts change
- New admin modules become functional
- Payment gateways are added
- Data models change
- Frontend routing or structure is refactored