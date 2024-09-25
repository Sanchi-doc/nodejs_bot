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

bot.start(async (ctx) => {
  try {
     console.log('Received ctx:', ctx.message);
    // Step 1: Send the image
    ctx.replyWithPhoto(
      { url: 'https://staticcdn.lope.bet/static/img/banners/uploads/Fly-and-play_-win-today-Casino-WEB-561x339-EN_11zon.webp' },  // Replace with your actual image URL or file_id
      { caption: 'Please share your phone number by pressing the button below.' }
    );

    //Step 2: Send the contact request keyboard
    ctx.reply('Share your phone number:', {
      reply_markup: {
        keyboard: [
          [
            {
              text: 'Share phone number',
              request_contact: true, // This will request the user's phone number
            }
          ]
        ],
        resize_keyboard: true, // Adjust the keyboard size to fit the button
        one_time_keyboard: true, // Hide the keyboard after the user presses the button
      },
    });
  } catch (error) {
    console.error('Error sending image or requesting contact:', error);
  }
});

bot.on('contact', (ctx) => {
  console.log("bot on contact", ctx.message)
  const phoneNumber = ctx.message.contact.phone_number;

  const user = ctx.message.from;

  const webAppUrl = `${process.env.WEB_APP_URL}tg?tgId=${user.id}&username=${encodeURIComponent(user.username)}`;
  
  const inlineKeyboard = {
    inline_keyboard: [[
      { text: 'Open Web App', web_app: { url: webAppUrl } }
    ]]
  };

  
  
  ctx.reply(`Thank you! Your phone number is: ${phoneNumber}`);
  ctx.reply('Welcome! Please log in to the website using the button below:', { reply_markup: inlineKeyboard });
});

// bot.launch()
//   .then(() => console.log('Bot started'))
//   .catch(error => console.error('Error starting bot:', error));

module.exports = { bot };