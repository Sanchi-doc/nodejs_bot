const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { message } = require("telegraf/filters");

const users = []

router.post('/login', async (req, res) => {
  console.log('login', users)
  const {email, password} = req.body
  const user = users.find(user => user.email === email)

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({message: 'Invalid credentials'})
  }

  const token = jwt.sign({id: user.id, email: user.email}, 'your-secret-key', {expiresIn: '1h'})
  res.json({token, user: {id: user.id, email: user.email}})
});

router.post('/logout', (req, res) => {

  res.json({message: 'Logout successful'})
})

router.post('/register', async (req, res) => {
  const { id, username } = req.body
  console.log('Received data:', { id, username });

  if (users.find(user => user.username === username)) {
    console.log("alredy users", users)
    return res.status(400).json({ message: 'User already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = { id, username, password: hashedPassword }
  users.push(user)

  console.log("register users", users)

  res.status(201).json({ message: 'User created successfully' })


  if (users.find(user => user.id === id)) {
    console.log(`User with ID ${id} already exists`);
    return res.status(400).json({ message: 'User with this ID already exists' });
  }
    

});

router.get('/session', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key')
    res.json({ user: { id: decoded.id, email: decoded.email } })
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
})



module.exports = router;