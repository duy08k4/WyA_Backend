# Messaging System API Documentation

## Endpoints

### 1. Send Message
Send a message to another user.

- **Endpoint**: `/send-message`
- **Method**: `POST`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "data": {
      "chatCode": "unique_chat_code",
      "sender": "sender_email",
      "targetGmail": "id",
      "content": "message_content",
    }
  }
  ```
- **Success Response**:
  ```json
  {
    "status": 200,
    "data": {
      "mess": "Sent"
    }
  }
  ```
- **Error Response**:
  ```json
  {
    "status": 404,
    "data": {
      "mess": "Can't send"
    }
  }
  ```

### 2. Merge Messages
Merge multiple messages from the new message collection into the main chat.

- **Endpoint**: `/send-message/merge`
- **Method**: `POST`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "data": {
      "messages": []
    }
  }
  ```
- **Success Response**:
  ```json
  {
    "status": 200,
    "data": {
      "mess": "Sent"
    }
  }
  ```
- **Error Response**:
  ```json
  {
    "status": 404,
    "data": {
      "mess": "Can't send"
    }
  }
  ```

### 3. Remove Chat
Request to remove a chat conversation or confirm removal.

- **Endpoint**: `/send-message/remove-chat`
- **Method**: `POST`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "data": {
      "type": "remove" or "revoke",
      "chatCode": "unique_chat_code",
      "requester": "requester_email",
      "targetGmail": "target_email"
    }
  }
  ```
- **Success Response** (Remove request):
  ```json
  {
    "status": 200,
    "data": {
      "mess": "Sent requirement"
    }
  }
  ```
- **Success Response** (Removal completion):
  ```json
  {
    "status": 200,
    "data": {
      "mess": "Removed chat"
    }
  }
  ```
- **Success Response** (Revoke request):
  ```json
  {
    "status": 200,
    "data": {
      "mess": "Revoked"
    }
  }
  ```
- **Error Response**:
  ```json
  {
    "status": 404,
    "data": {
      "mess": "Can't remove" or "Can't revoke" or "No have chat" or "Can't process" or "Can't require"
    }
  }
  ```

## Status Codes
- 200: Request successful
- 404: Request failed
- 405: Invalid request method

## Testing with CURL

### Send Message
```bash
curl -X POST http://localhost:3000/send-message \
-H "Content-Type: application/json" \
-d '{
  "data": {
    "chatCode": "unique_chat_code",
    "sender": "sender_email@gmail.com",
    "content": "Hello!",
    "targetGmail": "recipient_email@gmail.com"
  }
}'
```

### Merge Messages
```bash
curl -X POST http://localhost:3000/send-message/merge \
-H "Content-Type: application/json" \
-d '{
  "data": {
    "chatCode": "unique_chat_code"
  }
}'
```

### Remove Chat (Request Removal)
```bash
curl -X POST http://localhost:3000/send-message/remove-chat \
-H "Content-Type: application/json" \
-d '{
  "data": {
    "type": "remove",
    "chatCode": "unique_chat_code",
    "requester": "requester_email@gmail.com",
    "targetGmail": "target_email@gmail.com"
  }
}'
```

### Revoke Remove Chat Request
```bash
curl -X POST http://localhost:3000/send-message/remove-chat \
-H "Content-Type: application/json" \
-d '{
  "data": {
    "type": "revoke",
    "chatCode": "unique_chat_code",
    "requester": "requester_email@gmail.com",
    "targetGmail": "target_email@gmail.com"
  }
}'
```