# Login API Documentation

## Base URL
```
http://localhost:3000/login-account
```

## Endpoints

### Login
Authenticates a user and creates session tokens.

- **URL**: `/login-account`
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
- **Success Response** (200):
  ```json
  {
    "status": 200,
    "data": {
      "mess": "Log in successfully"
    }
  }
  ```
- **Error Response** (404):
  ```json
  {
    "status": 404,
    "data": {
      "mess": "Failed to login"
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