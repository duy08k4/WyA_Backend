# Login API Documentation

## Endpoints

### 1. Login
Authenticates a user and creates session tokens.

- **Endpoint**: `/login-account`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "data": {
      "gmail": "user@example.com",
      "passwordInput": "yourpassword"
    }
  }
  ```
- **Success Response** :
  ```json
  {
    "status": 200,
    "data": {
      "mess": "Log in successfully"
    }
  }
  ```
- **Error Response** :
  ```json
  {
    "status": 404,
    "data": {
      "mess": "Failed to login"
    }
  }
  ```
### 2. Logout
Log out the current user and invalidate their session.

- **Endpoint**: `/logout-account`
- **Method**: `GET`
- **Authentication**: Required
- **Success Response** :
  ```json
  {
    "status": 200,
    "data": {
      "mess": "Logged out successfully"
    }
  }
  ```
- **Error Response** :
  ```json
  {
    "status": 405,
    "data": {
      "mess": "Wrong method"
    }
  }
  ```


## Status Codes
- 200: Request successful
- 401: Not logged in or Invalid token
- 403: Logged in but no access permission
- 404: Request failed
- 405: Invalid request method

## Testing with CURL

### Login
```bash
curl -X POST http://localhost:3000/login-account \
-H "Content-Type: application/json" \
-d '{
  "data": {
    "gmail": "test@example.com",
    "passwordInput": "yourpassword"
  }
}'
```

## Notes
- Replace `localhost:3000` for production
- Successful login sets two cookies:
  - `acToken`: Access token (15 minutes validity)
  - `rfToken`: Refresh token (1 day validity)
- All requests require `Content-Type: application/json` header
- Cookies are HTTP-only and secure 