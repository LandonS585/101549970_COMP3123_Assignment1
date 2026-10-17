# COMP 3123 - Assignment 1 (Backend)

## Project

A secure REST API built with Node.js, Express and MongoDB. Users can sign up and log in, and each logged-in user can create, view, update and delete their own employees. A user can never see or change another user's employees.

**Technologies:** Node.js, Express, MongoDB, Mongoose, JWT (jsonwebtoken), bcrypt, Helmet, express-rate-limit, express-validator, Winston (logging), dotenv.

**Project structure:**

```
config/        database connection
controllers/   the logic for each endpoint
middleware/    JWT check, validation, rate limiting, error handling, request logging
models/        User and Employee schemas
routes/        URL paths for users and employees
validators/    input validation rules
utils/         logger
logs/          log files (generated when the app runs)
server.js      app entry point
```

## Installation

1. Clone the repository:
   `git clone https://github.com/LandonS585/101549970_COMP3123_Assignment1.git`2. Go into the folder and install the packages:
   `npm install`
3. Create a file named `.env` in the main folder. Copy the variables from `.env.example` and fill in your own values.
4. Start MongoDB. On Windows, MongoDB Community Server runs as a service, so make sure "MongoDB Server" is running.
5. Start the app:
   `npm run dev` (or `npm start`)
6. The API runs at `http://localhost:3000`.
7. Test it with Postman. Import `COMP3123_Assignment1.postman_collection.json` (the exported collection in this repository). Run the "Login" requests first, because they save the tokens the other requests use.

## Configuration

Environment variables (see `.env.example`):

| Variable | Purpose |
|---|---|
| PORT | Port the server runs on (3000) |
| MONGODB_URI | MongoDB connection string. The database name is `comp3123_assignment1` |
| JWT_SECRET | Secret key used to sign JWTs |

The real `.env` file is not committed to GitHub.

## API Endpoints

Base paths: `/api/v1/user` and `/api/v1/emp`

| # | Method | Endpoint | Success | Purpose |
|---|---|---|---|---|
| 1 | POST | /api/v1/user/signup | 201 | Register a new user |
| 2 | POST | /api/v1/user/login | 200 | Log in (username + password, or email + password) and get a JWT |
| 3 | GET | /api/v1/emp/employees | 200 | Get the logged-in user's employees |
| 4 | POST | /api/v1/emp/employees | 201 | Create an employee for the logged-in user |
| 5 | GET | /api/v1/emp/employees/{eid} | 200 | Get one of the logged-in user's employees |
| 6 | PUT | /api/v1/emp/employees/{eid} | 200 | Update one of the logged-in user's employees |
| 7 | DELETE | /api/v1/emp/employees?eid=xxx | 204 | Delete one of the logged-in user's employees |

## Authentication

- **Signup:** the user sends a username, email and password. The password is hashed before it is saved.
- **Login:** the user sends a username or email plus the password. If they match, the server returns a JWT that expires after 1 hour.
- **JWT:** a signed token that contains the user's id. The server signs it with `JWT_SECRET`, so it cannot be faked.
- **Authorization header:** the client sends the token with every employee request:
  `Authorization: Bearer <jwt>`
- **Protected endpoints:** all the employee endpoints. The middleware checks that the token exists, is valid and is not expired, then finds the user it belongs to. Missing, invalid and expired tokens get a 401.

## Authorization

Each employee has a `user` field that stores the id of the user who created it. The owner always comes from the verified JWT, never from anything the client sends.

- **List:** the query only returns employees where `user` equals the logged-in user's id.
- **Get, update and delete:** the server checks that the employee exists (404 if not) and that its `user` matches the logged-in user (403 if not). The update and delete database queries also include the owner id, so changing the `eid` in the URL or query string cannot get around the check.

I tested this with two users (User A and User B). Each can only see and manage their own employees. Each gets a 403 when trying to read, update or delete the other's employee.

## Security

- **Password hashing:** passwords are hashed with bcrypt before they are stored. They are never returned in responses, and the password field is excluded from queries by default.
- **JWT:** used to identify the logged-in user. Tokens expire after 1 hour.
- **Helmet:** adds HTTP security headers (for example Content-Security-Policy and X-Content-Type-Options) that protect against attacks like clickjacking and content sniffing. It also removes the X-Powered-By header.
- **Rate limiting:** limits how many requests one client (by IP address) can make in a time window. It slows down password guessing and spam.
  - `POST /api/v1/user/signup` and `POST /api/v1/user/login`: 10 requests per minute
  - All `/api` routes: 100 requests per 15 minutes
  - When a limit is exceeded, the API returns **429 Too Many Requests** with a JSON message.
  - Test result: I sent more than 10 login requests within a minute. The first 10 were handled normally and the 11th and later requests returned 429.
- **Input validation:** express-validator checks all user input (required fields, lengths, email format, strong passwords, positive salary, valid dates, valid MongoDB ids). Failures return 400 with a list of the fields that failed.
- **Environment variables:** secrets are kept in `.env`, which is not committed. `.env.example` shows which variables are needed.
- **Error handling:** one central handler returns JSON errors. Unknown routes return 404, malformed JSON returns 400, and unexpected errors return a generic 500 without stack traces or other internal details.

## Status codes used

| Code | Where it is used |
|---|---|
| 200 OK | Successful login, get and update |
| 201 Created | New user or new employee |
| 204 No Content | Successful delete |
| 400 Bad Request | Validation failure, invalid id, malformed JSON |
| 401 Unauthorized | Missing, invalid or expired token, wrong login credentials |
| 403 Forbidden | Employee belongs to another user |
| 404 Not Found | Employee does not exist, or unknown route |
| 409 Conflict | Username or email already exists |
| 429 Too Many Requests | Rate limit exceeded |
| 500 Internal Server Error | Unexpected server error |

## Logging

- **Where:** logs are written to the terminal and to `logs/app.log`. Because the `logs` folder is excluded from GitHub, a sample is included as `sample-app-log.txt`.
- **What is logged:** timestamp, server startup, every request (method, path and status code), signup and login attempts, validation failures, authorization failures, and errors.
- **What is excluded:** passwords, JWT secrets, database credentials and full tokens are never logged.

## Health Check

`GET http://localhost:3000/health`

Example response (200):

```json
{
  "status": "ok",
  "message": "API is running",
  "uptime_seconds": 120,
  "timestamp": "2026-10-16T22:56:42.040Z",
  "database": "connected"
}
```

## Test credentials (for marking)

| Username | Email | Password |
|---|---|---|
| usera | usera@test.com | Password123! |
| userb | userb@test.com | Password123! |