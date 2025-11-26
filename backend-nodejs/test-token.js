const jwt = require('jsonwebtoken');

// Test if stored tokens are valid
const testToken = () => {
  const token = 'your_stored_token_here'; // Replace with actual token from localStorage
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    console.log('Token is valid:', decoded);
  } catch (error) {
    console.log('Token is invalid:', error.message);
  }
};

// Generate a new test token
const generateTestToken = () => {
  const payload = {
    id: '690a388b056eaf701b9e322a',
    email: 'akhilesh@gmail.com',
    type: 'ADMIN',
    first_Name: 'Akhilesh',
    last_Name: 'Admin'
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '30d'
  });

  console.log('New token:', token);
  return token;
};

console.log('Testing JWT tokens...');
generateTestToken();