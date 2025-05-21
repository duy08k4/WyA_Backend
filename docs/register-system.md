# Registration API Documentation

## Endpoints

### 1. Send OTP
Sends a verification code to the user's email.

- **Endpoint**: `/send-otp`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "data": {
      "gmail": "user@example.com"
    }
  }
  ```
- **Success Response** (200):
  ```json
  {
    "status": 200,
    "data": {
      "mess": "OTP sent"
    }
  }
  ```
- **Error Response** (404):
  ```json
  {
    "status": 404,
    "data": {
      "mess": "Failed to send"
    }
  }
  ```
   **Error Response (Warning)** (429):
  ```json
  {
    "status": 429,
    "data": {
      "mess": "OTP has been sent"
    }
  }
  ```

### 2. Verify OTP
Verifies the OTP code sent to user's email.

- **Endpoint**: `/verify-otp`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "data": {
      "inputOtp": "1234"
    }
  }
  ```
- **Success Response** (200):
  ```json
  {
    "status": 200,
    "data": {
      "mess": "Verified"
    }
  }
  ```
- **Error Response** (400):
  ```json
  {
    "status": 400,
    "data": {
      "mess": "OTP code is incorrect"
    }
  }
  ```

### 3. Create Account
Creates a new user account.

- **Endpoint**: `/create-account`
- **Method**: `POST`
- **Data Structure**: 
  ```javascript
  {
      username: username,
      gmail: gmail,
      password: hs256(password),
      uuid,
      createdTime: createdTime(),
  }
  ```
- **Request Body**:
  ```json
  {
    "data": {
      "username": "testuser",
      "gmail": "test@example.com",
      "password": "yourpassword"
    }
  }
  ```
- **Success Response** (200):
  ```json
  {
    "status": 200,
    "data": {
      "mess": "Registered successfully"
    }
  }
  ```
- **Error Response** (404):
  ```json
  {
    "status": 404,
    "data": {
      "mess": "Account already exist"
    }
  }
  ```

## Status Codes
- 200: Request successful
- 400: OTP verification failed
- 404: Registration failed/Account exists
- 405: Invalid request method
- 429: OTP already sent (rate limit)

## Testing with CURL

### Send OTP
```bash
curl -X POST http://localhost:3000/create-account/send-otp \
-H "Content-Type: application/json" \
-d '{
  "data": {
    "gmail": "test@example.com"
  }
}'
```

### Verify OTP
```bash
curl -X POST http://localhost:3000/create-account/verify-otp \
-H "Content-Type: application/json" \
-d '{
  "data": {
    "inputOtp": "1234"
  }
}'
```

### Create Account
```bash
curl -X POST http://localhost:3000/create-account \
-H "Content-Type: application/json" \
-d '{
  "data": {
    "username": "testuser",
    "gmail": "test@example.com",
    "password": "yourpassword"
  }
}'
```

## Notes
- OTP expires after 5 minutes
- Rate limit: One OTP request per 5 minutes
- All requests require `Content-Type: application/json` header
- Cookies are used for OTP verification

