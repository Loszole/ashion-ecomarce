# Ashion E-Commerce Documentation

This folder contains the working documentation for the Ashion e-commerce project.

## Documents

1. `ASHION_PROJECT_DOCUMENTATION.md`
   Full project documentation covering architecture, setup, data model, backend, frontend, admin area, workflows, security, and current limitations.

2. `API_REFERENCE.md`
   Detailed API reference for the Express backend, including authentication, request shape, route purpose, and example payloads.

## Recommended Reading Order

1. Start with `ASHION_PROJECT_DOCUMENTATION.md` if you need a complete understanding of the system.
2. Use `API_REFERENCE.md` when integrating frontend features or testing backend endpoints.

## Project Status Summary

This codebase is a partially completed full-stack e-commerce application built with:

- React 17 on the frontend
- Express and MongoDB on the backend
- JWT authentication with role-based authorization
- Product, category, order, cart, homepage layout, audit log, and settings modules

The backend now includes stronger validation, centralized error handling, rate limiting, persistent cart APIs, settings/payment toggle APIs, and transactional checkout foundations.

The largest remaining gaps are frontend integration, payment gateway implementation, and completion of several admin features that currently exist as placeholders.

## Login Credentials (User ID and Password)

Use the following format for login:

- User login (demo)
   - User ID (Email): `john@example.com`
   - Password: `secret123`

- Admin login (demo)
   - User ID (Email): `admin@ashion.com`
   - Password: `Admin1234`

Important:

- There is no hardcoded default account in this repository.
- Create an account first using `POST /api/auth/register`, then log in using `POST /api/auth/login`.
- If you publish this project on GitHub, keep these as demo credentials only and use strong real passwords in deployment.