# Phone Number Verification System (OTP)

A full-stack phone number verification system built using Node.js, Express, MongoDB, Twilio OTP, and a responsive HTML UI.
The system sends an OTP via SMS, validates it with expiry, and verifies the user securely using JWT.

## Features

- Send OTP via SMS
- OTP expires in 2 minutes
- Secure verification flow
- JWT token generation after verification
- MongoDB persistent storage
- Responsive UI (mobile + desktop)
- Modular & production-ready code

## Tech Stack
# Backend

- Node.js
- Express.js
- MongoDB
- Twilio SMS API
- JWT Authentication

# Frontend

- HTML
- CSS (Responsive)
- Vanilla JavaScript (Fetch API)

## Installation & Setup

- Clone Repository
git clone https://github.com/spDeveloper555/SHC_Node_API.git
cd SHC_Node_API

- Install Dependencies
npm install

- Start Backend Server
npm start


## Server runs at:

http://localhost:3000

## Open Frontend

Open this file in browser:
frontend/index.html

## API Endpoints
- Send OTP
POST /api/auth/send-otp

Request Body

{
  "phone": "+91XXXXXXXXXX"
}

- Verify OTP
POST /api/auth/verify-otp

Request Body

{
  "phone": "+91XXXXXXXXXX",
  "otp": "123456"
}

JWT Response (on success)
{
  "success": true,
  "message": "Phone verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

## Reference UI


![alt text](assets/send-otp.png)
![alt text](assets/verify-otp.png)
![alt text](assets/success.png)