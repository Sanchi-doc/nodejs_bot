const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = [];

const generatePassword = (username, id) => {
  return `${username}-${id}-password`
};

router.post('/login', async (req, res) => {
  console.log('login', req.body, users);
  const { email, password, tgId } = req.body;
  
  if (tgId) {
    const user = users.find(user => user?.tgId === tgId);
    
    const tgPassword = generatePassword(user.username, user.tgId);
    
    if (!user || !(await bcrypt.compare(tgPassword, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, 'your-secret-key', { expiresIn: '1h' });
    res.json({token});
  } else {
    const user = users.find(user => user.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, 'your-secret-key', { expiresIn: '1h' });
    res.json({token});
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

router.post('/register', async (req, res) => {
  console.log(`Received body: ${JSON.stringify(req.body)}`);
  const { tgId, username, password, email } = req.body;
  let user;

  if (tgId) {
    if (users.find(user => user?.tgId === tgId)) {
      return res.status(200).json({ message: 'User with this ID already exists' });
    }

    const generatedPassword = generatePassword(username, tgId);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const user = { id: users.length + 1, username, tgId, password: hashedPassword };
    users.push(user);
  }  else {
    console.log(`No ID provided`);
    console.log(`tgId: ${tgId}`)

    if (users.find(user => user.email === email)) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    user = { id: users.length + 1, username, email,  password: hashedPassword }
    users.push(user)
  }
  
  console.log("Registered users", users);

  res.status(201).json({ message: 'User created successfully'});
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