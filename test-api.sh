#!/bin/bash

# Simple API Test Script
# This script tests the basic functionality of the backend API

API_URL="${1:-http://localhost:3001}"
TEST_USERNAME="testuser_$(date +%s)"
TEST_PASSWORD="TestPass123!"
TEST_COLOUR="blue"

echo "========================================="
echo "Testing User Profile API"
echo "API URL: $API_URL"
echo "========================================="
echo ""

# Test 1: Health Check
echo "Test 1: Health Check"
response=$(curl -s "$API_URL/health")
if echo "$response" | grep -q "ok"; then
    echo "✓ Health check passed"
else
    echo "✗ Health check failed"
    echo "Response: $response"
    exit 1
fi
echo ""

# Test 2: Register User
echo "Test 2: Register User"
echo "Username: $TEST_USERNAME"
register_response=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$TEST_USERNAME\",\"password\":\"$TEST_PASSWORD\",\"favouriteColour\":\"$TEST_COLOUR\"}")

if echo "$register_response" | grep -q "token"; then
    echo "✓ User registration passed"
    TOKEN=$(echo "$register_response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "Token: ${TOKEN:0:20}..."
else
    echo "✗ User registration failed"
    echo "Response: $register_response"
    exit 1
fi
echo ""

# Test 3: Get Profile
echo "Test 3: Get Profile"
profile_response=$(curl -s "$API_URL/api/profile" \
  -H "Authorization: Bearer $TOKEN")

if echo "$profile_response" | grep -q "$TEST_USERNAME"; then
    echo "✓ Get profile passed"
    echo "Profile: $profile_response"
else
    echo "✗ Get profile failed"
    echo "Response: $profile_response"
    exit 1
fi
echo ""

# Test 4: Update Profile
echo "Test 4: Update Profile"
NEW_COLOUR="green"
update_response=$(curl -s -X PUT "$API_URL/api/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"favouriteColour\":\"$NEW_COLOUR\"}")

if echo "$update_response" | grep -q "$NEW_COLOUR"; then
    echo "✓ Update profile passed"
    echo "Updated profile: $update_response"
else
    echo "✗ Update profile failed"
    echo "Response: $update_response"
    exit 1
fi
echo ""

# Test 5: Login
echo "Test 5: Login with registered user"
login_response=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$TEST_USERNAME\",\"password\":\"$TEST_PASSWORD\"}")

if echo "$login_response" | grep -q "token"; then
    echo "✓ Login passed"
    NEW_TOKEN=$(echo "$login_response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "New Token: ${NEW_TOKEN:0:20}..."
else
    echo "✗ Login failed"
    echo "Response: $login_response"
    exit 1
fi
echo ""

echo "========================================="
echo "All tests passed! ✓"
echo "========================================="
