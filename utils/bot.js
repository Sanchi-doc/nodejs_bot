require('dotenv').config();
const { Telegraf } = require('telegraf');
const jwt = require('jsonwebtoken');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
  const username = ctx.from.username || 'unknown_user';
  const token = jwt.sign({ username }, process.env.SESSION_SECRET, { expiresIn: '1h' });
  const webAppUrl = `${process.env.WEB_APP_URL}?username=${username}&token=${token}`;
  
  console.log('Data received when start', JSON.stringify(ctx.message));

  if (!webAppUrl) {
    console.error("WEB_APP_URL is not defined in the .env file");
    ctx.reply("Configuration error: WEB_APP_URL is not defined.");
    return;
  }

  const inlineKeyboard = {
    inline_keyboard: [[
      { text: 'Log in to the website', url: webAppUrl }
    ]]
  };

  ctx.reply('Welcome! Please log in to the website using the button below:', { reply_markup: inlineKeyboard });
});

bot.on('message', (ctx) => {
  console.log('Data received from web app:', JSON.stringify(ctx.message));
  if (ctx.message && ctx.message.web_app_data) {
    const data = JSON.parse(ctx.message.web_app_data.data);
    console.log('Data received from web app:', data);
    ctx.reply(`Data received: ${JSON.stringify(data)}`);
  }
});

module.exports = { bot };
