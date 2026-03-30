# Ashion Backend API Reference

## Base URL

Local development base URL:

```text
http://localhost:5000
```

Because the frontend uses a proxy, browser code can usually call relative routes such as `/api/products` during development.

## Common Response Behavior

- Success responses are JSON
- Validation and application errors are returned as JSON with a `message`
- In non-production mode, error responses may also include a `stack`

Example error response:

```json
{
  "message": "Invalid credentials"
}
```

## Authentication Header

Protected endpoints require:

```http
Authorization: Bearer <jwt-token>
```

## User Roles

Observed role values:

- `superadmin`
- `admin`
- `editor`
- `support`
- `user`

## 1. Health / Root

### `GET /`

Purpose:

- Simple backend root response

Response:

```text
E-Commerce Backend API
```

## 2. Authentication

### `POST /api/auth/register`

Purpose:

- Create a new user account

Auth required:

- No

Rate limit:

- Yes

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "user"
}
```

Validation:

- `name` required
- `email` required
- `password` minimum length 6
- `role` must be one of the allowed values if provided

Success response:

```json
{
  "message": "User registered successfully"
}
```

### `POST /api/auth/login`

Purpose:

- Authenticate a user and issue a JWT

Auth required:

- No

Rate limit:

- Yes

Request body:

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

Admin login example request body:

```json
{
  "email": "admin@ashion.com",
  "password": "Admin1234"
}
```

Success response:

```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "66123456789abcdef012345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

## 3. Products

### `GET /api/products`

Purpose:

- List products with search, filtering, sorting, and pagination support

Auth required:

- No

Typical query parameters:

- `page`
- `limit`
- `search`
- `category`
- `minPrice`
- `maxPrice`
- `sortBy`
- `sortOrder`

Example:

```http
GET /api/products?page=1&limit=12&category=women&search=dress&sortBy=price&sortOrder=asc
```

### `POST /api/products`

Purpose:

- Create a new product

Auth required:

- Yes

Allowed roles:

- `admin`
- `superadmin`
- `editor`

Content type:

- Usually `multipart/form-data` when uploading images

Fields:

- `name` required
- `description` optional
- `price` required
- `category` optional
- `stock` optional
- image files accepted via multer

### `GET /api/products/:id`

Purpose:

- Fetch one product by id

Auth required:

- No

### `PUT /api/products/:id`

Purpose:

- Update a product

Auth required:

- Yes

Allowed roles:

- `admin`
- `superadmin`
- `editor`

### `DELETE /api/products/:id`

Purpose:

- Delete a product

Auth required:

- Yes

Allowed roles:

- `admin`
- `superadmin`

## 4. Categories

### `GET /api/categories`

Purpose:

- List categories

Auth required:

- No

### `POST /api/categories`

Purpose:

- Create a category

Auth required:

- Yes

Allowed roles:

- `admin`
- `superadmin`
- `editor`

Request body:

```json
{
  "name": "Women",
  "description": "Women's fashion products"
}
```

### `GET /api/categories/:id`

Purpose:

- Fetch a single category

Auth required:

- No

### `PUT /api/categories/:id`

Purpose:

- Update a category

Auth required:

- Yes

Allowed roles:

- `admin`
- `superadmin`
- `editor`

### `DELETE /api/categories/:id`

Purpose:

- Delete a category

Auth required:

- Yes

Allowed roles:

- `admin`
- `superadmin`

## 5. Cart

All cart routes require authentication.

### `GET /api/cart`

Purpose:

- Get the authenticated user's cart
- Auto-creates an empty cart if one does not exist

Success response shape:

```json
{
  "_id": "66123456789abcdef012345",
  "user": "66123456789abcdef012340",
  "items": [
    {
      "_id": "66123456789abcdef012399",
      "product": {
        "_id": "66123456789abcdef012377",
        "name": "Summer Dress",
        "price": 49.99,
        "images": ["dress.jpg"],
        "stock": 15
      },
      "quantity": 2,
      "price": 49.99
    }
  ],
  "subtotal": 99.98
}
```

### `POST /api/cart`

Purpose:

- Add an item to the cart

Request body:

```json
{
  "productId": "66123456789abcdef012377",
  "quantity": 2
}
```

Rules:

- Product must exist
- Quantity must be a positive integer
- Quantity must not exceed stock

### `PUT /api/cart/:itemId`

Purpose:

- Update cart item quantity

Request body:

```json
{
  "quantity": 3
}
```

### `DELETE /api/cart/:itemId`

Purpose:

- Remove one item from the cart

### `DELETE /api/cart`

Purpose:

- Clear the user's entire cart

## 6. Orders

### `GET /api/orders`

Purpose:

- List orders for administrative users

Auth required:

- Yes

Allowed roles:

- `admin`
- `superadmin`
- `support`

Query parameters:

- `page`
- `limit`
- `status`

Success response:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "pages": 0
  }
}
```

### `POST /api/orders`

Purpose:

- Create an order directly without using the cart endpoint

Auth required:

- Yes

Request body:

```json
{
  "products": [
    {
      "product": "66123456789abcdef012377",
      "quantity": 2,
      "price": 49.99
    }
  ],
  "shippingAddress": "123 Main Street, City",
  "paymentMethod": "cod",
  "shippingCost": 5,
  "taxAmount": 2.5
}
```

Important note:

The controller recalculates pricing from live product records during transactional creation.

### `POST /api/orders/checkout`

Purpose:

- Create an order from the authenticated user's cart

Auth required:

- Yes

Request body:

```json
{
  "shippingAddress": "123 Main Street, City",
  "paymentMethod": "cod",
  "shippingCost": 5,
  "taxAmount": 2.5
}
```

Behavior:

- Fails if cart is empty
- Validates enabled payment method from settings
- Validates stock inside a DB session
- Creates order
- Decrements stock
- Clears cart

### `GET /api/orders/:id`

Purpose:

- Get one order by id

Auth required:

- Yes

Allowed roles:

- `admin`
- `superadmin`
- `support`

### `PUT /api/orders/:id`

Purpose:

- Update order status

Auth required:

- Yes

Allowed roles:

- `admin`
- `superadmin`
- `support`

Request body:

```json
{
  "status": "processing"
}
```

Allowed statuses:

- `pending`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

### `DELETE /api/orders/:id`

Purpose:

- Delete an order

Auth required:

- Yes

Allowed roles:

- `admin`
- `superadmin`

## 7. Homepage Layout

### `GET /api/homepage`

Purpose:

- Return homepage layout data

Auth required:

- No

### `PUT /api/homepage`

Purpose:

- Update homepage layout

Auth required:

- Yes

Allowed roles:

- Typically admin/editor roles based on backend design

## 8. Settings

### `GET /api/settings/payment-options`

Purpose:

- Return public payment method availability for the storefront

Auth required:

- No

Success response:

```json
{
  "methods": [
    {
      "code": "cod",
      "enabled": true
    }
  ],
  "defaultMethod": "cod"
}
```

### `GET /api/settings/:section`

Purpose:

- Fetch a settings section

Auth required:

- No

Supported sections:

- `general`
- `payment`
- `shipping`
- `seo`
- `email`

### `POST /api/settings/:section`

Purpose:

- Save a settings section

Auth required:

- Yes

Allowed roles:

- `admin`
- `superadmin`

Example request for payment settings:

```json
{
  "provider": "cod",
  "codEnabled": true,
  "stripeEnabled": false,
  "paypalEnabled": false,
  "apiKey": ""
}
```

Success response:

```json
{
  "success": true,
  "data": {
    "provider": "cod",
    "apiKey": "",
    "codEnabled": true,
    "stripeEnabled": false,
    "paypalEnabled": false
  }
}
```

## 9. Audit Logs

### `GET /api/audit-logs`

Purpose:

- Return audit log records

Auth required:

- Yes

Allowed roles:

- `admin`
- `superadmin`

## 10. Validation Rules Summary

Important validation behavior currently enforced:

- Registration requires valid non-empty `name`, `email`, and password length >= 6
- Login requires `email` and `password`
- Product creation requires `name` and non-negative `price`
- Category creation requires `name`
- Order creation requires at least one product and a shipping address
- Order `paymentMethod` must be `cod`, `stripe`, or `paypal`
- Order status updates must use one of the supported status values
- Protected routes with id params often validate Mongo ObjectId format

## 11. Operational Notes for Integrators

- Store the login token securely and send it on every protected request
- Use `/api/settings/payment-options` to decide which payment options to render in the storefront checkout UI
- Prefer `/api/orders/checkout` for cart-based checkout rather than manually duplicating order calculations in the frontend
- Expect some admin-facing modules to be incomplete even though route or UI placeholders exist in the repository

## 12. Current API Limitations

- No payment gateway charge execution yet
- No password reset endpoints
- No review endpoints
- No discount or coupon endpoints
- No wishlist endpoints
- No user management endpoints beyond registration/login in the visible backend structure

This API reference reflects the current repository state and should be updated whenever backend contracts change.