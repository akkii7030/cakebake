const jwt = require('jsonwebtoken');
require('dotenv').config();

// Test token verification
const testToken = process.argv[2];

if (!testToken) {
  console.log('Usage: node test-auth.js <token>');
  process.exit(1);
}

try {
  const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
  console.log('Token is valid!');
  console.log('Decoded payload:', decoded);
} catch (error) {
  console.log('Token verification failed:', error.message);
}