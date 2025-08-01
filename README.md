﻿---
## 🚖Ride Booking API

## A **secure**, **scalable**, and **role-based** backend API for a ride booking platform inspired by services like **Uber** and **Pathao**. This system is designed using **Express.js**, **MongoDB**, and **JWT** authentication to support Riders, Drivers, and Admins.
---

## 📌 Key Features

### 🔐 Authentication & Authorization

- JWT-based login system
- Role-based access control (`admin`, `rider`, `driver`)
- Secure password hashing with bcrypt

### 👥 User Roles

#### Riders:

- Request a ride (pickup & destination)
- Cancel ride (before acceptance)
- View ride history

#### Drivers:

- Accept/reject ride requests
- Update ride status (Picked Up → In Transit → Completed)
- Set availability (Online/Offline)
- View earnings

#### Admins:

- View all users, drivers, and rides
- Approve/suspend drivers
- Block/unblock user accounts
- (Optional) Analytics and reports

---

## 🧰 Technologies Used

- **Node.js**, **Express.js** – Backend API
- **MongoDB**– Database
- **JWT**, **Bcrypt** – Authentication & Security
- **TypeScript**
- **Postman** – API Testing

---

## 🌐 Live Demo

🔗 **URL:** [https://rider-booking.onrender.com](https://rider-booking.onrender.com)

> ⚠️ **Note:** Some API endpoints require authentication using a **JWT Bearer Token**.
>
> To access these protected routes:
>
> 1. **Register** or **Log in** to obtain a token.
> 2. Include the token in the request header as shown below:
>
> ```http
> Authorization: Bearer YOUR_JWT_TOKEN_HERE
> ```

---

## 📁 Project Structure

```

ride-booking-api/
├── dist/
├── node_modules/
├── src/
│   ├── config/
│   │   └── database.ts
│
│   ├── middlewares/
│   │   ├── authMiddleware.ts
│   │   ├── error.middleware.ts
│   │   └── roleMiddleware.ts
│
│   ├── modules/
│   │   ├── admin/
│   │   │   ├── admin.controller.ts
│   │   │   └── admin.routes.ts
│   │
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.routes.ts
│   │
│   │   ├── driver/
│   │   │   ├── driver.controller.ts
│   │   │   └── driver.routes.ts
│   │
│   │   ├── rating/
│   │   │   ├── rating.controller.ts
│   │   │   ├── rating.model.ts
│   │   │   └── rating.routes.ts
│   │
│   │   ├── ride/
│   │   │   ├── ride.controller.ts
│   │   │   ├── ride.interface.ts
│   │   │   ├── ride.model.ts
│   │   │   └── ride.routes.ts
│   │
│   │   └── user/
│   │       ├── user.controller.ts
│   │       ├── user.interface.ts
│   │       ├── user.model.ts
│   │       └── user.routes.ts
│
│   ├── utils/
│   │   ├── errorHandler.ts
│   │   ├── fareCalculator.ts
│   │   └── jwt.ts
│
│   ├── app.ts
│   └── server.ts
│
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json

```

---

## 📖 API Overview

### 🔑 Base API URL

🔗 URL: https://rider-booking.onrender.com/api

### 🔑 Auth

> ✅ Use this base for all endpoints listed below.  
> Example: `POST https://rider-booking.onrender.com/api/auth/login`

| SL  | Method | Endpoint             | Request Body                      | Description         |
| --- | ------ | -------------------- | --------------------------------- | ------------------- |
| 1   | POST   | `/api/auth/register` | `{ name, email, password, role }` | Register a new user |
| 2   | POST   | `/api/auth/login`    | `{ email, password }`             | Login and get JWT   |

### 👤Admin

| SL  | Method | Endpoint                     | Request Body / Params     | Description                                                           |
| --- | ------ | ---------------------------- | ------------------------- | --------------------------------------------------------------------- |
| 1   | GET    | `/admin/rides`               | -                         | View all ride requests                                                |
| 2   | PATCH  | `/admin/drivers/approve/:id` | `{ approve: true/false }` | Approve or reject a driver                                            |
| 3   | PATCH  | `/admin/users/block/:id`     | `{ block: true/false }`   | Block or unblock a user                                               |
| 4   | GET    | `/admin/analytics`           | -                         | 📊 View admin dashboard analytics (total users, rides, revenue, etc.) |

### 🚕 Rides

| SL  | Method | Endpoint                  | Request Body / Params                   | Description             |
| --- | ------ | ------------------------- | --------------------------------------- | ----------------------- |
| 1   | POST   | /api/rides/request        | { pickupLocation, destinationLocation } | Request a new ride      |
| 2   | PATCH  | /api/rides/cancel/\:id    | :id = rideId                            | Cancel a ride           |
| 3   | GET    | /api/rides/me             | -                                       | Get ride history        |
| 4   | POST   | /api/rides/fare/calculate | { pickupLocation, destinationLocation } | Calculate fare estimate |
| 5   | POST   | /api/rides/nearby-drivers | { lat, lng }                            | Find nearby drivers     |

### 🚗 Driver

| SL  | Method | Endpoint                       | Request Body / Params                                  | Description          |
| --- | ------ | ------------------------------ | ------------------------------------------------------ | -------------------- |
| 1   | PATCH  | `/api/driver/availability`     | `{ available: true/false }`                            | Update availability  |
| 2   | GET    | `/api/driver/rides/available`  | -                                                      | View available rides |
| 3   | PATCH  | `/api/driver/rides/accept/:id` | `:id = rideId`                                         | Accept a ride        |
| 4   | PATCH  | `/api/driver/rides/status/:id` | `{ status: "picked_up" / "in_transit" / "completed" }` | Update ride status   |
| 5   | GET    | `/api/driver/earnings`         | -                                                      | View total earnings  |

⭐ Ratings

| SL  | Method | Endpoint                        | Request Body / Params                            | Description                           |
| --- | ------ | ------------------------------- | ------------------------------------------------ | ------------------------------------- |
| 1   | POST   | `/api/ratings`                  | `{ rideId, riderId, driverId, rating, comment }` | Submit a rating for a ride            |
| 2   | GET    | `/api/ratings/driver/:driverId` | -                                                | Get all ratings for a specific driver |

---

## 🛡 Security & Validations

- ✅ Passwords hashed with bcrypt
- ✅ JWT-secured authentication
- ✅ Role-based route protection middleware
- ✅ Status transitions strictly validated:
  - `requested → accepted → picked_up → in_transit → completed`

---

## 🧪 Testing

- ✅ All endpoints tested in **Postman**
- ✅ Auth-protected routes validated with Bearer Token
- ✅ Common edge cases handled (unauthorized access, invalid IDs, status conflicts)

---

## ▶️ Getting Started

### 🔧 Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Postman for testing

### ⚙️ Setup

```bash
git clone https://github.com/Tahsina2226/Rider_booking.git
cd Rider_booking
npm install
```

Create a `.env` file:

```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

Run the app:

```bash
npm run dev
```

---

## 🔍 Lacking / Limitations

- ❌ No driver auto-matching based on geolocation
- ❌ No fare calculation or estimation logic
- ❌ No real-time WebSocket or push notifications
- ❌ No maps or live tracking
- ❌ No file upload (e.g., driver docs, profile photo)
- ❌ No email/SMS notification system
- ❌ No unit/integration tests

---

## 🚀 Future Enhancements

### 🧩 System Features

- 🔄 Auto-match drivers based on proximity
- 🧾 Fare estimation logic with pricing model
- 📍 Geolocation and Google Maps API integration
- 📢 Real-time updates using WebSockets or Firebase

### 👤 User & Experience

- 📄 Cancellation penalty & ride reliability scoring
- 🪪 Extended driver profiles with license/vehicle info
- 📷 Profile and document uploads

### 🧠 Admin & Monitoring

- 📊 Admin dashboard with real-time stats
- 📈 Reports (CSV, PDF)
- 📬 Admin action logs

### ✅ DevOps & Testing

- 🔧 Swagger/OpenAPI documentation
- 🧪 Jest/Supertest for automated testing
- 🚀 CI/CD pipelines with GitHub Actions

---

## 📄 License

Licensed under the [MIT License](LICENSE).

---

## 📫 Contact

**Tahsina Tanvin**
📧 [tahsinatanvin274@gmail.com](mailto:tahsinatanvin274@gmail.com)
🔗 [LinkedIn](https://www.linkedin.com/in/tahsina-tanvin-8a49162b3/)
💻 [GitHub](https://github.com/Tahsina2226)

---
