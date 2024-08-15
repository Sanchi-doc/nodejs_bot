const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); // For generating unique identifiers

const users = []; // In-memory user storage

// Login
router.post('/login', async (req, res) => {
  console.log('Login attempt with users:', users);
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user: { id: user.id, username: user.username } });
});

// Registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (users.find(user => user.username === username)) {
    console.log("User already exists:", users);
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), username, password: hashedPassword }; // Generating unique ID
  users.push(user);

  console.log("Registered users:", users);

  res.status(201).json({ message: 'User created successfully' });
});

// Session Data Retrieval
router.get('/session', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: { id: decoded.id, username: decoded.username } });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
