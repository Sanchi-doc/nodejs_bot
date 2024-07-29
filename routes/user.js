const express = require('express');
const router = express.Router();
const { findUserByTelegramId } = require('../utils/memoryDb');

router.get('/', (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).send('userId is required');
  }

  const user = findUserByTelegramId(userId);

  if (user) {
    res.send(`User data: ${JSON.stringify(user)}`);
  } else {
    res.status(404).send('User not found');
  }
});

module.exports = router;
