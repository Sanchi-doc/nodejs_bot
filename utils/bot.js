require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
  const webAppUrl = process.env.WEB_APP_URL;

  if (!webAppUrl) {
    console.error("WEB_APP_URL is not defined in the .env file");
    ctx.reply("Configuration error: WEB_APP_URL is not defined.");
    return;
  }

  const inlineKeyboard = {
    inline_keyboard: [[
      { text: 'Log in to the website', web_app: { url: webAppUrl } }
    ]]
  };

  ctx.reply('Welcome! Please log in to the website using the button below:', { reply_markup: inlineKeyboard });
});

// Обработка данных, отправленных из веб-приложения
bot.on('message', (ctx) => {
  if (ctx.message && ctx.message.web_app_data) {
    const data = JSON.parse(ctx.message.web_app_data.data);
    console.log('Data received from web app:', data);
    ctx.reply(`Data received: ${JSON.stringify(data)}`);
  }
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = { bot };
