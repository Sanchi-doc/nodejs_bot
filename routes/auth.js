const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = [];

// Регистрация нового пользователя
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body; // Получение данных из запроса

  if (users.find(user => user.email === email)) {
    console.log("User already exists", users);
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, email, username, password: hashedPassword }; // Добавление username
  users.push(user);

  console.log("Registered users:", users); // Логирование массива пользователей

  res.status(201).json({ message: 'User created successfully' });
});

// Вход пользователя
router.post('/login', async (req, res) => {
  console.log('login', users);
  const { email, password } = req.body;
  const user = users.find(user => user.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, 'your-secret-key', { expiresIn: '1h' });
  res.json({ token }); 
});

// Выход пользователя
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Получение данных сессии
router.get('/session', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    res.json({ user: { id: decoded.id, email: decoded.email, username: decoded.username } }); // Добавление username в ответ
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;