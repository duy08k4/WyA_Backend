# Registration System Documentation

## System Components

### 1. Route (`src/routes/register.route.js`)
- **Purpose**: Defines the registration endpoints routing
- **File**: `register.route.js`
- **Dependencies**: Express.js
- **Endpoints**:
  - `/send-otp`: Sends verification OTP
  - `/verify-otp`: Verifies OTP code
  - `/`: Creates new account

### 2. Controller (`src/controllers/register.controller.js`)
- **Purpose**: Handles HTTP request/response logic for registration operations
- **File**: `register.controller.js`
- **Dependencies**: 
  - `createAccount_Model`
  - `sendOtp_Model`
  - `verifyOtp_Model`
- **Methods**:
  - `createAccount(req, res)`: Handles account creation
  - `sendOTP(req, res)`: Handles OTP sending
  - `verifyOTP(req, res)`: Handles OTP verification
  - Returns 405 status for unsupported HTTP methods

### 3. Models
#### a. Create Account Model (`src/models/createAccount.model.js`)
- **Purpose**: Implements account creation logic
- **File**: `createAccount.model.js`
- **Dependencies**:
  - Firebase SDK
  - UUID
  - js-sha256
- **Key Features**:
  - Account existence checking
  - Password hashing
  - UUID generation
  - Timestamp creation

#### b. Send OTP Model (`src/models/sendOtp.model.js`)
- **Purpose**: Handles OTP generation and sending
- **File**: `sendOtp.model.js`
- **Dependencies**:
  - Nodemailer
  - Resend
- **Key Features**:
  - OTP generation
  - Email sending
  - Rate limiting (5 minutes cooldown)
  - HTML email template

#### c. Verify OTP Model (`src/models/verifyOtp.model.js`)
- **Purpose**: Verifies OTP codes
- **File**: `verifyOtp.model.js`
- **Key Features**:
  - OTP validation
  - Cookie-based verification

## Registration Flow
1. User initiates registration with email
2. System sends OTP to user's email
3. User verifies OTP
4. Upon successful verification:
   - Creates new account with hashed password
   - Generates unique UUID
   - Stores account data in Firebase
5. Returns success/failure response

## Security Features
- Password hashing using SHA-256
- Email verification through OTP
- Rate limiting for OTP requests
- Secure cookie management
- UUID-based user identification
- Timestamp tracking

## Maintenance Guidelines

### 1. Environment Variables
Ensure the following environment variables are properly set:
- `GMAIL_PASSCODE`: Email service password
- Firebase configuration variables

### 2. Database Maintenance
- Regularly backup Firebase database
- Monitor new account creation
- Implement account cleanup for unverified accounts

### 3. Security Updates
- Keep all dependencies updated:
  - `nodemailer`
  - Firebase SDK
  - Express.js
- Regularly review OTP expiration times
- Monitor email service status

### 4. Error Handling
The system returns standardized error responses:
- 200: Request successful
- 400: OTP verification failed
- 404: Registration failed/Account exists
- 405: Invalid request method
- 429: OTP already sent (rate limit)

### 5. Testing
Regular testing should include:
- Account creation with valid data
- OTP sending and verification
- Rate limiting functionality
- Email template rendering
- Database operations
- Error handling scenarios

## Troubleshooting

### Common Issues
1. **Registration Failures**
   - Check Firebase connection
   - Verify email service configuration
   - Confirm account doesn't exist

2. **OTP Issues**
   - Verify email service credentials
   - Check rate limiting
   - Validate OTP expiration

3. **Email Service**
   - Verify Gmail credentials
   - Check email template
   - Monitor delivery rates

### API Testing with CURL
You can test the registration endpoints using the following CURL commands:

1. **Send OTP**:
```bash
curl -X POST http://localhost:3000/create-account/send-otp \
-H "Content-Type: application/json" \
-d '{
  "data": {
    "gmail": "test@example.com"
  }
}'
```

2. **Verify OTP**:
```bash
curl -X POST http://localhost:3000/create-account/verify-otp \
-H "Content-Type: application/json" \
-d '{
  "data": {
    "inputOtp": "1234"
  }
}'
```

3. **Create Account**:
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

Notes:
- Replace `localhost:3000` for production
- The response will include cookies for OTP verification
- Use `-v` flag for verbose output to see headers and cookies

