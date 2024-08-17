require('dotenv').config();
const { Telegraf } = require('telegraf');
const jwt = require('jsonwebtoken');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
  const user = ctx.message.from;

  const payload = {
    id: user.id,
    first_name: user.first_name,
    username: user.username,
    language_code: user.language_code
  };

  

  // Генерация URL с токеном и дополнительными параметрами
  const webAppUrl = `${process.env.WEB_APP_URL}/tg?id=${user.id}&username=${encodeURIComponent(user.username)}`;

  console.log(`Generated URL for user: ${webAppUrl}`);

  const inlineKeyboard = {
    inline_keyboard: [[
      { text: 'Open Web App', web_app: { url: webAppUrl } }
    ]]
  };

  // Отправка кнопки пользователю
  ctx.reply('Welcome! Please log in to the website using the button below:', { reply_markup: inlineKeyboard });
});

// bot.launch()
//   .then(() => console.log('Bot started'))
//   .catch(error => console.error('Error starting bot:', error));

module.exports = { bot };
