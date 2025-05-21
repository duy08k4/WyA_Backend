# Map System API Documentation

## Endpoints

### 1. Send Location Share Request
Request to share location with another user.

- **Endpoint**: `/map-function`
- **Method**: `POST`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "data": {
      "clientGmail": "user_email@gmail.com",
      "clientName": "User Name",
      "clientAvartarCode": "avatar_code",
      "request_gmail": "target_email@gmail.com",
      "request_name": "Target Name",
      "request_avartarCode": "target_avatar_code"
    }
  }
  ```
- **Success Response** (200):
  ```json
  {
    "status": 200,
    "data": {
      "mess": "Sent"
    }
  }
  ```
- **Error Response** (404):
  ```json
  {
    "status": 404,
    "data": {
      "mess": "Can't send request"
    }
  }
  ```

### 2. Accept Location Share Request
Accept a location share request from another user.

- **Endpoint**: `/map-function/accept-request`
- **Method**: `POST`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "data": {
      "clientGmail": "user_email@gmail.com",
      "clientName": "User Name",
      "clientAvartarCode": "avatar_code",
      "request_gmail": "target_email@gmail.com",
      "request_username": "Target Name",
      "request_avartarCode": "target_avatar_code"
    }
  }
  ```
- **Success Response** (200):
  ```json
  {
    "status": 200,
    "data": {
      "mess": "Accepted"
    }
  }
  ```
- **Error Response** (404):
  ```json
  {
    "status": 404,
    "data": {
      "mess": "Can't process your action"
    }
  }
  ```

### 3. Revoke Location Share Request
Revoke a pending location share request.

- **Endpoint**: `/map-function/revoke-request`
- **Method**: `POST`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "data": {
      "clientGmail": "user_email@gmail.com",
      "request_gmail": "target_email@gmail.com"
    }
  }
  ```
- **Success Response** (200):
  ```json
  {
    "status": 200,
    "data": {
      "mess": "Revoked"
    }
  }
  ```
- **Error Response** (404):
  ```json
  {
    "status": 404,
    "data": {
      "mess": "Can't revoke your request"
    }
  }
  ```

### 4. Disconnect Location Sharing
Stop sharing location with another user or all users.

- **Endpoint**: `/map-function/disconnect`
- **Method**: `POST`
- **Authentication**: Required
- **Request Body** (Disconnect from one user):
  ```json
  {
    "data": {
      "type": "oneConnection",
      "clientGmail": "user_email@gmail.com",
      "targetConnection": [
        {
          "gmail": "target_email@gmail.com"
        }
      ]
    }
  }
  ```
- **Request Body** (Disconnect from all users):
  ```json
  {
    "data": {
      "type": "allConnection",
      "clientGmail": "user_email@gmail.com",
      "targetConnection": [
        {
          "gmail": "target_email1@gmail.com"
        },
        {
          "gmail": "target_email2@gmail.com"
        }
      ]
    }
  }
  ```
- **Success Response** (200):
  ```json
  {
    "status": 200,
    "data": {
      "mess": "Disconnected"
    }
  }
  ```
- **Error Response** (404):
  ```json
  {
    "status": 404,
    "data": {
      "mess": "Can't disconnect"
    }
  }
  ```

## Status Codes
- 200: Request successful
- 404: Request failed
- 405: Invalid request method

## Testing with CURL

### Send Location Share Request
```bash
curl -X POST http://localhost:3000/map-function \
-H "Content-Type: application/json" \
-d '{
  "data": {
    "clientGmail": "user_email@gmail.com",
    "clientName": "User Name",
    "clientAvartarCode": "avatar_code",
    "request_gmail": "target_email@gmail.com",
    "request_name": "Target Name",
    "request_avartarCode": "target_avatar_code"
  }
}'
```

### Accept Location Share Request
```bash
curl -X POST http://localhost:3000/map-function/accept-request \
-H "Content-Type: application/json" \
-d '{
  "data": {
    "clientGmail": "user_email@gmail.com",
    "clientName": "User Name",
    "clientAvartarCode": "avatar_code",
    "request_gmail": "target_email@gmail.com",
    "request_username": "Target Name",
    "request_avartarCode": "target_avatar_code"
  }
}'
```

### Revoke Location Share Request
```bash
curl -X POST http://localhost:3000/map-function/revoke-request \
-H "Content-Type: application/json" \
-d '{
  "data": {
    "clientGmail": "user_email@gmail.com",
    "request_gmail": "target_email@gmail.com"
  }
}'
```

### Disconnect Location Sharing (One Connection)
```bash
curl -X POST http://localhost:3000/map-function/disconnect \
-H "Content-Type: application/json" \
-d '{
  "data": {
    "type": "oneConnection",
    "clientGmail": "user_email@gmail.com",
    "targetConnection": [
      {
        "gmail": "target_email@gmail.com"
      }
    ]
  }
}'
```

### Disconnect Location Sharing (All Connections)
```bash
curl -X POST http://localhost:3000/map-function/disconnect \
-H "Content-Type: application/json" \
-d '{
  "data": {
    "type": "allConnection",
    "clientGmail": "user_email@gmail.com",
    "targetConnection": [
      {
        "gmail": "target_email1@gmail.com"
      },
      {
        "gmail": "target_email2@gmail.com"
      }
    ]
  }
}'
```
