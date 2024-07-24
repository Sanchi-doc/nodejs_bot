const express = require('express');
const router = express.Router();
const { findUserByTelegramId, createUserWithTelegramId } = require('../memoryDb');

router.get('/login', (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).send('userId is required');
  }

  const user = findUserByTelegramId(userId);

  if (user) {
    res.send(`Welcome, ${user.name}`);
  } else {
    const newUser = createUserWithTelegramId(userId);
    res.send(`Registration successful! Welcome, ${newUser.name}`);
  }
});

module.exports = router;
