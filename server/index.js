require('dotenv').config();
const express = require('express');
const { Telegraf } = require('telegraf');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const memoryDb = require('./memoryDb');

// Initialize Express
const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

const PORT = process.env.PORT || 3000;
const WEB_APP_URL = process.env.WEB_APP_URL;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Start Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Initialize and launch Telegram bot
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
  const userId = ctx.from.id; // Get the unique Telegram user ID
  const loginUrl = `${WEB_APP_URL}`; // Generate the login URL with userId parameter

  const inlineKeyboard = {
    inline_keyboard: [[
      { text: 'Log in to the website', url: loginUrl }
    ]]
  };

  ctx.reply('Welcome! Please log in to the website using the button below:', { reply_markup: inlineKeyboard });
});

bot.launch()
  .then(() => console.log('Telegram bot is running'))
  .catch(err => console.error('Failed to launch Telegram bot:', err));
