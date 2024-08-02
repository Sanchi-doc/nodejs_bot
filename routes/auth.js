const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
require('dotenv').config();

// In-memory storage for users
const users = [];

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(user => user.email === email);
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ email: user.email }, process.env.SESSION_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { email: user.email } });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  const userExists = users.some(user => user.email === email);
  if (!userExists) {
    const hashedPassword = bcrypt.hashSync(password, 8);
    users.push({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'User created' });
  } else {
    res.status(400).json({ message: 'User already exists' });
  }
});

router.get('/user', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    res.json({ user: { email: decoded.email } });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
