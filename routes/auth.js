const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = [];


const generatePassword = (username, id) => {
 
  return `${username}-${id}-password`; 
};

router.post('/login', async (req, res) => {
  console.log('login', req.body, users);
  const { email, password } = req.body;
  const user = users.find(user => user.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, 'your-secret-key', { expiresIn: '1h' });
  res.json({ token, user: { id: user.id, username: user.username } });
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

router.post('/register', async (req, res) => {
  console.log(`Received body: ${JSON.stringify(req.body)}`);
  const { id, username } = req.body;

  if (id) {
    if (users.find(user => user.id === id)) {
      console.log(`User with ID ${id} already exists`);
      return res.status(400).json({ message: 'User with this ID already exists' });
    }
  }  else {
    console.log(`No ID provided, auto-generating ID: ${id}`);
  }

  if (users.find(user => user.username === username)) {
    console.log("User already exists", users);
    return res.status(400).json({ message: 'User already exists' });
  }

  const generatedPassword = generatePassword(username, id);
  const hashedPassword = await bcrypt.hash(generatedPassword, 10);

  const user = { id, username, password: hashedPassword };
  users.push(user);

  console.log("Registered users", users);

  res.status(201).json({ message: 'User created successfully', user: { id, username } });
});


router.get('/session', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    res.json({ user: { id: decoded.id, username: decoded.username } });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
