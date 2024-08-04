const express = require("express");
const router = express.Router();

router.get('/login', (req, res) => {
  const { email, password } = req.body
  // Validate credentials (replace with your own logic)
  if (email === 'user@example.com' && password === 'password') {
    const token = jwt.sign({ email }, 'your-secret-key', { expiresIn: '1h' })
    res.json({ token, user: { email } })
  } else {
    res.status(401).json({ message: 'Invalid credentials' })
  }
});

router.post('/register', async (req, res) => {
  const {username, password} = req.body;

  console.log('------------', username, password);
  // // Перевірка, чи користувач з таким ім'ям вже існує
  // if (users.some(user => user.username === username)) {
  //   return res.status(400).json({message: 'User already exists'});
  // }
  //
  // // Хешування паролю перед збереженням в базі даних
  // const hashedPassword = await bcrypt.hash(password, 10); // 10 - сіль для хешування
  //
  // // Збереження нового користувача
  // const newUser = {username, password: hashedPassword};
  // users.push(newUser);

  res.json({message: 'User registered successfully'});
});

router.get('/user', (req, res) => {
  const token = req.headers?.authorization?.split(' ')[1]
  try {
    const decoded = jwt.verify(token, 'your-secret-key')
    res.json({ user: { email: decoded.email } })
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
})

module.exports = router;