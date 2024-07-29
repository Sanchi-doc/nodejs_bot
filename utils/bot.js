require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
  const userId = ctx.from.id; // Get the unique Telegram user ID
  const webAppUrl = process.env.WEB_APP_URL;

  if (!webAppUrl) {
    console.error("WEB_APP_URL is not defined in the .env file");
    ctx.reply("Configuration error: WEB_APP_URL is not defined.");
    return;
  }

  const loginUrl = `${webAppUrl}`; // Generate the login URL with userId parameter

  const inlineKeyboard = {
    inline_keyboard: [[
      { text: 'Log in to the website', url: loginUrl }
    ]]
  };

  ctx.reply('Welcome! Please log in to the website using the button below:', { reply_markup: inlineKeyboard });
});


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = { bot };
