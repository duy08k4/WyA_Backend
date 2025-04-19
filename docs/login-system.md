# Login System Documentation

## System Components

### 1. Route (`src/routes/login.route.js`)
- **Purpose**: Defines the login endpoint routing
- **File**: `login.route.js`
- **Dependencies**: Express.js
- **Configuration**:
  - Uses Express Router
  - Mounts the login controller at root path "/"

### 2. Controller (`src/controllers/login.controller.js`)
- **Purpose**: Handles HTTP request/response logic for login operations
- **File**: `login.controller.js`
- **Dependencies**: 
  - `loginAccount_Model`
  - `jsonwebtoken`
- **Methods**:
  - `loginAccount(req, res)`: Handles POST requests for user login
  - Returns 405 status for unsupported HTTP methods

### 3. Model (`src/models/loginAccount.model.js`)
- **Purpose**: Implements business logic for login authentication
- **File**: `loginAccount.model.js`
- **Dependencies**:
  - Firebase SDK
  - js-sha256 (for password hashing)
  - jsonwebtoken
- **Key Features**:
  - Email verification against Firebase database
  - Password hashing and verification
  - JWT token generation (access and refresh tokens)
  - Secure cookie management

## Authentication Flow
1. User submits login credentials (email and password)
2. System checks if user exists in Firebase database
3. If user exists, verifies password hash
4. Upon successful verification:
   - Generates access token (15 minutes validity)
   - Generates refresh token (1 day validity)
   - Sets secure HTTP-only cookies
5. Returns success/failure response

## Security Features
- Password hashing using SHA-256
- HTTP-only cookies for token storage
- Secure cookie flag enabled
- JWT-based authentication
- Separate access and refresh tokens
- Token expiration management

## Maintenance Guidelines

### 1. Environment Variables
Ensure the following environment variables are properly set:
- `JWT_SECRET`: Secret key for JWT token generation
- Firebase configuration variables

### 2. Database Maintenance
- Regularly backup Firebase database
- Monitor user account collection for suspicious activities
- Implement account lockout mechanism if needed

### 3. Security Updates
- Keep all dependencies updated:
  - `jsonwebtoken`
  - `js-sha256`
  - Firebase SDK
  - Express.js
- Regularly review and update JWT token expiration times
- Monitor for security vulnerabilities in dependencies

### 4. Error Handling
The system returns standardized error responses:
- 200: Request successful
- 401: Not logged in or Invalid token
- 403: Logged in but no access permission
- 404: Request failed
- 405: Invalid request method
- 429: OTP is sent

### 5. Testing
Regular testing should include:
- Login with valid credentials
- Login with invalid credentials
- Token expiration scenarios
- Cookie security settings
- Database connectivity
- Error handling scenarios

## Troubleshooting

### Common Issues
1. **Login Failures**
   - Check Firebase connection
   - Verify password hashing
   - Confirm user exists in database

2. **Token Issues**
   - Verify JWT_SECRET is properly set
   - Check token expiration times
   - Validate cookie settings

3. **Database Connection**
   - Verify Firebase credentials
   - Check network connectivity
   - Validate database rules

### API Testing with CURL
You can test the login endpoint using the following CURL commands:

1. **Successful Login Test**:
```bash
curl -X POST http://localhost:3000/login-account \
-H "Content-Type: application/json" \
-d '{
  "data": {
    "gmail": "test@example.com",
    "passwordInput": "passsword123"
  }
}'
```

2. **Invalid Credentials Test**:
```bash
curl -X POST http://localhost:3000/login-account \
-H "Content-Type: application/json" \
-d '{
  "data": {
    "gmail": "wrong@example.com",
    "passwordInput": "wrongpassword"
  }
}'
```

3. **Wrong HTTP Method Test**:
```bash
curl -X GET http://localhost:3000/login-account
```

Notes:
- Replace `localhost:3000` for production
- The response will include cookies if login is successful
- Use `-v` flag for verbose output to see headers and cookies

## API Reference

### Login Endpoint
- **URL**: `/login-account`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "data": {
      "gmail": "user@example.com",
      "passwordInput": "userpassword"
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