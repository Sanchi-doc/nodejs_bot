// In-memory user data store
const users = {};

function findUserByTelegramId(telegramId) {
  return users[telegramId] || null;
}

function createUserWithTelegramId(telegramId) {
  const newUser = { telegramId, name: `User${telegramId}` };
  users[telegramId] = newUser;
  return newUser;
}

module.exports = { findUserByTelegramId, createUserWithTelegramId };
