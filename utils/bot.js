require('dotenv').config();
const { Telegraf } = require('telegraf');
const jwt = require('jsonwebtoken');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// bot.start((ctx) => {
//   const user = ctx.message.from;
//
//   console.log('Received user:', user);
//
//   // Генерация URL с токеном и дополнительными параметрами
//   const webAppUrl = `${process.env.WEB_APP_URL}tg?tgId=${user.id}&username=${encodeURIComponent(user.username)}`;
//
//   console.log(`Generated URL for user: ${webAppUrl}`);
//
//   const inlineKeyboard = {
//     inline_keyboard: [[
//       { text: 'Open Web App', web_app: { url: webAppUrl } }
//     ]]
//   };
//
//   // Отправка кнопки пользователю
//   ctx.reply('Welcome! Please log in to the website using the button below:', { reply_markup: inlineKeyboard });
// });

bot.start((ctx) => {
  // Step 1: Send an image
  ctx.replyWithPhoto({ url: 'https://emp.betinvest.xyz/staticcdn/static/img/tournaments/870x400.png' }, {
    caption: 'Please share your phone number'
  })
    .then(() => {
      // Step 2: Send a keyboard with a button to request contact
      ctx.reply('Share your phone number by pressing the button below.', {
        reply_markup: {
          keyboard: [
            [
              {
                text: 'Share phone number',
                request_contact: true, // This will request the user's phone number
              }
            ]
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
    });
});

bot.on('contact', (ctx) => {
  console.log("bot on contact", ctx.message)
  const phoneNumber = ctx.message.contact.phone_number;
  ctx.reply(`Thank you! Your phone number is: ${phoneNumber}`);
});

// bot.launch()
//   .then(() => console.log('Bot started'))
//   .catch(error => console.error('Error starting bot:', error));

module.exports = { bot };