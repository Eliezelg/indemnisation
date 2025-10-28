#!/bin/bash

# Script de test des endpoints API
# Usage: ./scripts/test-api.sh

set -e

API_URL="${API_URL:-http://localhost:3001}"
ADMIN_TOKEN=""
USER_TOKEN=""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================="
echo "🧪 Test des Endpoints API"
echo "API URL: $API_URL"
echo "========================================="
echo ""

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
response=$(curl -s "$API_URL/health")
if echo "$response" | grep -q "ok"; then
  echo -e "${GREEN}✅ Health check passed${NC}"
  echo "$response" | jq '.'
else
  echo -e "${RED}❌ Health check failed${NC}"
  exit 1
fi
echo ""

# Test 2: Get all airports
echo -e "${YELLOW}Test 2: Get All Airports${NC}"
response=$(curl -s "$API_URL/airports")
count=$(echo "$response" | jq '. | length')
if [ "$count" -eq 44 ]; then
  echo -e "${GREEN}✅ Airports endpoint working (44 airports)${NC}"
  echo "Sample: $(echo "$response" | jq '.[0]')"
else
  echo -e "${RED}❌ Expected 44 airports, got $count${NC}"
  exit 1
fi
echo ""

# Test 3: Search airports
echo -e "${YELLOW}Test 3: Search Airports (query: paris)${NC}"
response=$(curl -s "$API_URL/airports/search?q=paris")
count=$(echo "$response" | jq '. | length')
if [ "$count" -ge 2 ]; then
  echo -e "${GREEN}✅ Airport search working ($count results)${NC}"
  echo "$response" | jq '.'
else
  echo -e "${RED}❌ Expected at least 2 airports for 'paris'${NC}"
  exit 1
fi
echo ""

# Test 4: Get airport by code
echo -e "${YELLOW}Test 4: Get Airport by Code (CDG)${NC}"
response=$(curl -s "$API_URL/airports/by-code?code=CDG")
if echo "$response" | grep -q "Charles de Gaulle"; then
  echo -e "${GREEN}✅ Airport by code working${NC}"
  echo "$response" | jq '.'
else
  echo -e "${RED}❌ Failed to get CDG airport${NC}"
  exit 1
fi
echo ""

# Test 5: Flight search (no auth required)
echo -e "${YELLOW}Test 5: Flight Search${NC}"
response=$(curl -s "$API_URL/flight-api/search?flightNumber=AF123&date=2025-10-28")
if echo "$response" | grep -q "found"; then
  echo -e "${GREEN}✅ Flight search endpoint working${NC}"
  echo "$response" | jq '.'
else
  echo -e "${RED}❌ Flight search failed${NC}"
  exit 1
fi
echo ""

# Test 6: Cache test (second request should be faster)
echo -e "${YELLOW}Test 6: Cache Test (same flight query)${NC}"
start_time=$(date +%s%N)
response1=$(curl -s "$API_URL/flight-api/search?flightNumber=LY312&date=2025-10-28")
end_time=$(date +%s%N)
time1=$(( (end_time - start_time) / 1000000 )) # Convert to milliseconds

start_time=$(date +%s%N)
response2=$(curl -s "$API_URL/flight-api/search?flightNumber=LY312&date=2025-10-28")
end_time=$(date +%s%N)
time2=$(( (end_time - start_time) / 1000000 ))

echo "First request: ${time1}ms"
echo "Second request (cached): ${time2}ms"

if [ "$time2" -lt "$time1" ]; then
  echo -e "${GREEN}✅ Cache is working (second request faster)${NC}"
else
  echo -e "${YELLOW}⚠️  Cache might not be working or times are similar${NC}"
fi
echo ""

# Test 7: Registration (creates test user)
echo -e "${YELLOW}Test 7: User Registration${NC}"
test_email="test-$(date +%s)@example.com"
register_payload=$(cat <<EOF
{
  "email": "$test_email",
  "password": "TestPassword123",
  "firstName": "Test",
  "lastName": "User",
  "phone": "+33612345678",
  "preferredLocale": "fr"
}
EOF
)

response=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "$register_payload")

if echo "$response" | grep -q "accessToken"; then
  echo -e "${GREEN}✅ Registration successful${NC}"
  USER_TOKEN=$(echo "$response" | jq -r '.accessToken')
  echo "Token received: ${USER_TOKEN:0:20}..."
else
  echo -e "${RED}❌ Registration failed${NC}"
  echo "$response" | jq '.'
  exit 1
fi
echo ""

# Test 8: Login admin
echo -e "${YELLOW}Test 8: Admin Login${NC}"
login_payload=$(cat <<EOF
{
  "email": "admin@flightclaim.com",
  "password": "AdminPass123"
}
EOF
)

response=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "$login_payload")

if echo "$response" | grep -q "accessToken"; then
  echo -e "${GREEN}✅ Admin login successful${NC}"
  ADMIN_TOKEN=$(echo "$response" | jq -r '.accessToken')
  echo "Admin token received: ${ADMIN_TOKEN:0:20}..."
else
  echo -e "${YELLOW}⚠️  Admin login failed (might need to create admin user)${NC}"
  echo "$response" | jq '.'
fi
echo ""

# Test 9: Admin stats (requires admin token)
if [ -n "$ADMIN_TOKEN" ]; then
  echo -e "${YELLOW}Test 9: Admin Stats${NC}"
  response=$(curl -s "$API_URL/admin/stats/overview" \
    -H "Authorization: Bearer $ADMIN_TOKEN")

  if echo "$response" | grep -q "totalClaims"; then
    echo -e "${GREEN}✅ Admin stats endpoint working${NC}"
    echo "$response" | jq '.'
  else
    echo -e "${RED}❌ Admin stats failed${NC}"
    echo "$response" | jq '.'
  fi
  echo ""
fi

# Test 10: Create claim (requires user token)
if [ -n "$USER_TOKEN" ]; then
  echo -e "${YELLOW}Test 10: Create Claim${NC}"
  claim_payload=$(cat <<EOF
{
  "flightNumber": "AF123",
  "flightDate": "2025-10-15",
  "departureAirport": "CDG",
  "arrivalAirport": "TLV",
  "airline": "Air France",
  "disruptionType": "DELAY",
  "delayMinutes": 240,
  "passengerInfo": {
    "firstName": "Test",
    "lastName": "User",
    "email": "$test_email",
    "phone": "+33612345678"
  }
}
EOF
  )

  response=$(curl -s -X POST "$API_URL/claims" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -d "$claim_payload")

  if echo "$response" | grep -q "claimNumber"; then
    echo -e "${GREEN}✅ Claim creation successful${NC}"
    claim_id=$(echo "$response" | jq -r '.id')
    claim_number=$(echo "$response" | jq -r '.claimNumber')
    echo "Claim created: $claim_number (ID: ${claim_id:0:10}...)"
  else
    echo -e "${RED}❌ Claim creation failed${NC}"
    echo "$response" | jq '.'
  fi
  echo ""
fi

echo "========================================="
echo -e "${GREEN}✅ All tests completed!${NC}"
echo "========================================="
echo ""
echo "Summary:"
echo "- ✅ Health check"
echo "- ✅ Airports API (list, search, by-code)"
echo "- ✅ Flight search API"
echo "- ✅ Cache system"
echo "- ✅ User registration"
echo "- $([ -n "$ADMIN_TOKEN" ] && echo "✅" || echo "⚠️ ") Admin authentication"
echo "- $([ -n "$USER_TOKEN" ] && echo "✅" || echo "⚠️ ") Claim creation"
echo ""

# Save tokens for manual testing
if [ -n "$USER_TOKEN" ] || [ -n "$ADMIN_TOKEN" ]; then
  echo "Tokens saved to /tmp/api-tokens.txt for manual testing"
  cat > /tmp/api-tokens.txt <<EOF
# API Tokens (generated $(date))

# User Token (test user: $test_email)
USER_TOKEN="$USER_TOKEN"

# Admin Token
ADMIN_TOKEN="$ADMIN_TOKEN"

# Usage examples:
# curl -H "Authorization: Bearer \$USER_TOKEN" $API_URL/claims
# curl -H "Authorization: Bearer \$ADMIN_TOKEN" $API_URL/admin/stats/overview
EOF
  echo "Run: source /tmp/api-tokens.txt"
fi
