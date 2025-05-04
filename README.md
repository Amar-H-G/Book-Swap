# 📚 Book Exchange Portal

[![Server Status](https://img.shields.io/badge/server-running-success)](http://localhost:5000)
[![API Version](https://img.shields.io/badge/api-v1.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

A platform for users to exchange books with others in their community.

**AI Models Used:**

- ChatGPT
- DeepSeek

**Deployment:**

- Website is deployed on Render.com and is live at: [https://book-swap-frontend-tpyl.onrender.com/](https://book-swap-frontend-tpyl.onrender.com/)

---

## 🚀 Quick Start

### Frontend Updates

- **Tailwind CSS Integration**: The frontend now uses Tailwind CSS for styling. All custom CSS has been removed, and styles have been converted to Tailwind classes.
- **Vite Configuration**: Tailwind CSS has been integrated into the Vite build process using the `@tailwindcss/vite` plugin.
- **Updated Dependencies**: Tailwind CSS and related dependencies have been added to the `package.json` file.
- **Removed Unnecessary CSS**: The `App.css` file has been removed, and the `index.css` file now imports Tailwind CSS.
- **Profile Context**: Added profile context for managing user profile data.

### Server Status

- ✅ Server running at `http://localhost:5000`
- 🔌 API version: 1.0

---

## 📋 API Documentation

### 🔐 Authentication API

<details>
<summary><strong>🔵 POST /api/auth/register - Register User</strong></summary>

#### Request

```http
POST /api/auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "mobile": "1234567890",
    "role": "user"
}
```

#### Response

```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "1234567890",
    "role": "user"
  }
}
```

</details>

<details>
<summary><strong>🔵 POST /api/auth/login - Login User</strong></summary>

#### Request

```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password123"
}
```

#### Response

```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

</details>

---

### 👤 User Profile API

<details>
<summary><strong>🟢 GET /api/users/:id - Get User Profile</strong></summary>

#### Request

```http
GET /api/users/:id
```

#### Response

```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "1234567890",
    "role": "user",
    "createdAt": "2023-07-20T10:00:00.000Z"
  }
}
```

</details>

---

### 📖 Books API

<details>
<summary><strong>🟢 GET /api/books - Get All Books</strong></summary>

#### Request

```http
GET /api/books
```

#### Response

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Fiction",
    "location": "New York",
    "status": "available",
    "ownerId": "user123",
    "ownerName": "John Doe",
    "ownerEmail": "john@example.com",
    "ownerMobile": "1234567890",
    "createdAt": "2023-07-20T10:00:00.000Z"
  }
]
```

</details>

<details>
<summary><strong>🔵 POST /api/books - Add New Book</strong></summary>

#### Request

```http
POST /api/books
Content-Type: application/json

{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Fiction",
    "location": "New York",
    "ownerId": "user123"
}
```

#### Response

```json
{
  "success": true,
  "book": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Fiction",
    "location": "New York",
    "ownerId": "user123",
    "status": "available",
    "createdAt": "2023-07-20T10:00:00.000Z"
  }
}
```

</details>

<details>
<summary><strong>🟡 PATCH /api/books/:id/status - Update Book Status</strong></summary>

#### Request

```http
PATCH /api/books/:id/status
Content-Type: application/json

{
    "status": "borrowed"
}
```

#### Response

```json
{
  "success": true,
  "book": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "The Great Gatsby",
    "status": "borrowed"
  }
}
```

</details>

<details>
<summary><strong>🔴 DELETE /api/books/:id - Delete Book</strong></summary>

#### Request

```http
DELETE /api/books/:id
Content-Type: application/json

{
    "ownerId": "user123"
}
```

#### Response

```json
{
  "success": true
}
```

</details>

---

### ⚠️ Error Responses

<details>
<summary><strong>Common Error Responses</strong></summary>

#### Invalid Login

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### Email Already Exists

```json
{
  "success": false,
  "message": "Email already exists"
}
```

#### Profile Not Found

```json
{
  "success": false,
  "message": "User profile not found"
}
```

</details>

---

### 📝 Response Codes

| Status Code | Description                          |
| ----------- | ------------------------------------ |
| **200**     | OK - Request successful              |
| **201**     | CREATED - Resource created           |
| **400**     | BAD REQUEST - Invalid request        |
| **401**     | UNAUTHORIZED - Invalid credentials   |
| **404**     | NOT FOUND - Resource not found       |
| **500**     | INTERNAL SERVER ERROR - Server error |

---

## 🔧 Tech Stack

- Node.js
- Express.js
- UUID for ID generation
- In-memory Database
- React Context API for state management
- Axios for HTTP requests

---

## 📄 License

This project is licensed under the MIT License.
