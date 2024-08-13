const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Array for storing users
const users = [];

// Email validation using regular expression
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format. Please enter a valid email address.' });
  }

  const user = users.find(user => user.email === email);

  // Check if user exists and validate password
  if (!user) {
    return res.status(400).json({ message: 'No user found with this email address. Please check your email and try again.' });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Incorrect password. Please check your password and try again.' });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, 'your-secret-key', { expiresIn: '1h' });

  // Return token and success message
  res.json({ token, message: 'Login successful' });
});

// User registration handler
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format. Please enter a valid email address.' });
  }

  // Check if user already exists
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ message: 'A user with this email already exists. Please use a different email address.' });
  }

  // Hash password and create new user
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, email, username, password: hashedPassword };
  users.push(user);

  res.status(201).json({ message: 'User registered successfully' });
});

module.exports = router;
