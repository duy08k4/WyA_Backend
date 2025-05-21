# User Management API Documentation

## Endpoints

### 1. Search User
Search for users in the system.

- **Endpoint**: `/search-user`
- **Method**: `POST`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "data": {
      "typeSearch": "gmail" or "username",
      "searchContent": "search_term"
    }
  }
  ```
- **Success Response** :
  ```json
  {
    "status": 200,
    "data": {
      "mess": "Found",
      "result": [
        {
          "gmail": "found_user@example.com",
          "username": "found_username",
          "avartarCode": "123"
        }
      ]
    }
  }
  ```
- **Error Response** :
  ```json
  {
    "status": 400,
    "data": {
      "mess": "Not found",
      "result": []
    }
  }
  ```
    ```json
  {
    "status": 405,
    "data": {
      "mess": "TypeError: Type-search 'invalid_type' is wrong."
    }
  }
  ```

### 2. Get User Info
Retrieve information about the current user.

- **Endpoint**: `/getInfo`
- **Method**: `GET`
- **Authentication**: Required 
- **Success Response** :
  ```json
  {
    "status": 200,
    "data": {
      "userData": {
        "gmail": "user@example.com",
        "username": "username",
        "avartarCode": "avatar_code",
      },
      "mess": "Got user data"
    }
  }
  ```
- **Error Response** :
  ```json
  {
    "status": 498,
    "data": {
      "mess": "Token is expired"
    }
  }
  ```
- **Error Response** :
  ```json
  {
    "status": 404,
    "data": {
      "mess": "Request denied"
    }
  }
  ```

### 4. Check Token
Verify if the current session token is valid.

- **Endpoint**: `/check-token`
- **Method**: `GET`
- **Success Response** :
  ```json
  {
    "status": 200,
    "data": {
      "mess": "Token is valid"
    }
  }
  ```
- **Error Response** :
  ```json
  {
    "status": 401,
    "data": {
      "mess": "Invalid token"
    }
  }
  ```
```json
{
"status": 498,
"data": {
    "mess": "Session expired"
}
}
```
