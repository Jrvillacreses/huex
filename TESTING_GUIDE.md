# HueX - End-to-End Testing Guide

## Overview

This guide covers testing the complete authentication and sync flow for the HueX mobile app.

## Prerequisites

- Backend server running on `http://localhost:3000`
- Mobile app running via Expo
- Clean state (no previous data)

---

## Test 1: Backend Authentication

### 1.1 Register a New User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@huex.com",
    "username": "testuser",
    "password": "Test123!"
  }'
```

**Expected Response:**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "test@huex.com",
    "username": "testuser"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

✅ **Pass Criteria:** Returns user object and tokens

### 1.2 Login with Credentials

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@huex.com",
    "password": "Test123!"
  }'
```

**Expected Response:**
```json
{
  "access_token": "...",
  "refresh_token": "..."
}
```

✅ **Pass Criteria:** Returns tokens

### 1.3 Access Protected Route

```bash
# Save the access token from previous step
TOKEN="your-access-token-here"

curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "id": "uuid",
  "email": "test@huex.com",
  "username": "testuser"
}
```

✅ **Pass Criteria:** Returns user profile

### 1.4 Refresh Token

```bash
REFRESH_TOKEN="your-refresh-token-here"

curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "'$REFRESH_TOKEN'"
  }'
```

**Expected Response:**
```json
{
  "access_token": "new-access-token"
}
```

✅ **Pass Criteria:** Returns new access token

---

## Test 2: Mobile App Offline Mode

### 2.1 Start App Without Login

1. Open HueX mobile app
2. Click "Continue without account"
3. Navigate to Home screen

✅ **Pass Criteria:** App loads successfully

### 2.2 Add Favorite Offline

1. Scan or select a color
2. Add to favorites
3. Navigate to Favorites screen
4. Verify color appears

✅ **Pass Criteria:** Favorite saved locally

### 2.3 View History Offline

1. Scan multiple colors
2. Navigate to History screen
3. Verify all scanned colors appear

✅ **Pass Criteria:** History saved locally

### 2.4 Delete Favorite Offline

1. Go to Favorites
2. Delete a favorite
3. Verify it's removed

✅ **Pass Criteria:** Delete works offline

---

## Test 3: Mobile App Authentication

### 3.1 Register New User

1. Open app
2. Click "Sign up"
3. Fill in:
   - Email: `mobile@huex.com`
   - Username: `mobileuser`
   - Password: `Mobile123!`
4. Submit

✅ **Pass Criteria:** 
- Registration successful
- Redirected to Main screen
- Sync starts automatically

### 3.2 Logout

1. Navigate to Profile screen
2. Click "Logout"
3. Verify redirected to Login screen

✅ **Pass Criteria:** Logged out successfully

### 3.3 Login

1. Enter credentials:
   - Email: `mobile@huex.com`
   - Password: `Mobile123!`
2. Submit

✅ **Pass Criteria:**
- Login successful
- Sync starts automatically
- Redirected to Main screen

---

## Test 4: Sync Functionality

### 4.1 Offline Data Upload

**Setup:**
1. Logout from app
2. Add 3 favorites offline
3. Add 5 history items offline

**Test:**
1. Login with credentials
2. Wait for sync to complete
3. Check backend:

```bash
curl -X GET http://localhost:3000/favorites \
  -H "Authorization: Bearer $TOKEN"
```

✅ **Pass Criteria:**
- All 3 favorites appear in response
- Each has server-generated ID
- `synced: true` in local storage

### 4.2 Pull to Refresh

1. Login on Device A
2. Add favorite on Device A
3. Login on Device B (same account)
4. Pull to refresh on Device B
5. Verify favorite appears

✅ **Pass Criteria:** Data syncs across devices

### 4.3 Conflict Resolution

**Setup:**
1. Add favorite "Red" offline on Device A
2. Add favorite "Blue" offline on Device B
3. Login on Device A (uploads Red)
4. Login on Device B (uploads Blue)

**Test:**
1. Pull to refresh on both devices
2. Verify both see Red and Blue

✅ **Pass Criteria:** Both favorites merged correctly

### 4.4 Delete Sync

1. Login on Device A
2. Delete a favorite
3. Pull to refresh on Device B
4. Verify favorite is deleted on Device B

✅ **Pass Criteria:** Delete syncs correctly

---

## Test 5: Edge Cases

### 5.1 Network Interruption

1. Login to app
2. Turn off WiFi/data
3. Add favorite
4. Turn on WiFi/data
5. Pull to refresh

✅ **Pass Criteria:** 
- Favorite saved offline
- Syncs when online

### 5.2 Rapid Operations

1. Add 10 favorites quickly
2. Delete 5 favorites quickly
3. Pull to refresh

✅ **Pass Criteria:**
- All operations queued
- Sync processes all correctly

### 5.3 Token Expiration

1. Login to app
2. Wait 15 minutes (token expires)
3. Try to add favorite
4. Verify token refreshes automatically

✅ **Pass Criteria:** Token refresh works

### 5.4 Clear History with Sync

1. Login
2. Add 10 history items
3. Clear all history
4. Pull to refresh on another device
5. Verify history cleared

✅ **Pass Criteria:** Clear syncs correctly

---

## Test 6: Data Persistence

### 6.1 App Restart

1. Add favorites offline
2. Close app completely
3. Reopen app
4. Check favorites

✅ **Pass Criteria:** Data persists

### 6.2 Login After Offline Use

1. Use app offline for a while
2. Add 5 favorites
3. Add 10 history items
4. Login
5. Wait for sync

✅ **Pass Criteria:**
- All data uploads
- No duplicates
- Server has all data

---

## Test 7: Backend Data Isolation

### 7.1 Multi-User Test

**User 1:**
```bash
# Register User 1
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user1@test.com","username":"user1","password":"pass123"}'

# Save token as TOKEN1

# Add favorite
curl -X POST http://localhost:3000/favorites \
  -H "Authorization: Bearer $TOKEN1" \
  -H "Content-Type: application/json" \
  -d '{"hex":"#FF0000","name":"Red","rgb":"255,0,0","cmyk":"0,100,100,0","lab":"L:53 A:80 B:67"}'
```

**User 2:**
```bash
# Register User 2
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user2@test.com","username":"user2","password":"pass123"}'

# Save token as TOKEN2

# Get favorites (should be empty)
curl -X GET http://localhost:3000/favorites \
  -H "Authorization: Bearer $TOKEN2"
```

✅ **Pass Criteria:**
- User 2 sees no favorites
- User 1 sees their favorite
- Data properly isolated

---

## Test 8: History Limit

### 8.1 50-Item Limit Per User

1. Login as user
2. Add 60 history items
3. Check history count

✅ **Pass Criteria:**
- Only 50 most recent items kept
- Oldest 10 deleted automatically

---

## Automated Test Script

Create `test-e2e.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"

echo "🧪 Testing HueX E2E..."

# Test 1: Register
echo "📝 Test 1: Register"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"test","password":"test123"}')

if echo "$REGISTER_RESPONSE" | grep -q "access_token"; then
  echo "✅ Register passed"
else
  echo "❌ Register failed"
  exit 1
fi

# Extract token
TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

# Test 2: Get Profile
echo "👤 Test 2: Get Profile"
PROFILE_RESPONSE=$(curl -s -X GET $BASE_URL/auth/profile \
  -H "Authorization: Bearer $TOKEN")

if echo "$PROFILE_RESPONSE" | grep -q "test@test.com"; then
  echo "✅ Profile passed"
else
  echo "❌ Profile failed"
  exit 1
fi

# Test 3: Add Favorite
echo "⭐ Test 3: Add Favorite"
FAV_RESPONSE=$(curl -s -X POST $BASE_URL/favorites \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"hex":"#FF0000","name":"Red","rgb":"255,0,0","cmyk":"0,100,100,0","lab":"L:53 A:80 B:67"}')

if echo "$FAV_RESPONSE" | grep -q "FF0000"; then
  echo "✅ Add Favorite passed"
else
  echo "❌ Add Favorite failed"
  exit 1
fi

# Test 4: Get Favorites
echo "📋 Test 4: Get Favorites"
FAVS_RESPONSE=$(curl -s -X GET $BASE_URL/favorites \
  -H "Authorization: Bearer $TOKEN")

if echo "$FAVS_RESPONSE" | grep -q "FF0000"; then
  echo "✅ Get Favorites passed"
else
  echo "❌ Get Favorites failed"
  exit 1
fi

echo "🎉 All tests passed!"
```

Run with:
```bash
chmod +x test-e2e.sh
./test-e2e.sh
```

---

## Troubleshooting

### Sync not working?
- Check network connection
- Verify token is valid
- Check console logs for errors
- Verify backend is running

### Data not persisting?
- Check AsyncStorage permissions
- Clear app data and retry
- Check for errors in console

### Duplicates appearing?
- Clear local storage
- Re-sync from server
- Check sync queue

---

## Success Criteria Summary

✅ **Backend:**
- All auth endpoints work
- JWT validation works
- User data isolated
- Refresh token works

✅ **Mobile Offline:**
- App works without login
- Data saves locally
- CRUD operations work

✅ **Mobile Online:**
- Login/register works
- Sync after login works
- Pull-to-refresh works

✅ **Sync:**
- Offline data uploads
- Server data downloads
- Conflicts resolve
- Deletes sync
- Queue processes

✅ **Data:**
- Persists across restarts
- Isolated per user
- History limited to 50
- No duplicates
