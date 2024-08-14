require('dotenv').config();
const { Telegraf } = require('telegraf');
const jwt = require('jsonwebtoken');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
  const user = ctx.message.from;

  // Output token to console
  console.log(`Generated token for user ${user}`);

  const webAppUrl = `${process.env.WEB_APP_URL}?token=`;

  const inlineKeyboard = {
    inline_keyboard: [[
      { text: 'Open Web App', web_app: { url: webAppUrl } }
    ]]
  };

  // We send only the button without the token
  ctx.reply('Welcome! Please log in to the website using the button below:', { reply_markup: inlineKeyboard });
});

bot.launch()
  .then(() => console.log('Bot started'))
  .catch(error => console.error('Error starting bot:', error));

module.exports = { bot };
