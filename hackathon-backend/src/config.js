require('dotenv').config();
console.log('Loaded MONGO_URI:', process.env.MONGO_URI);

module.exports = {
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 5000,
}; 