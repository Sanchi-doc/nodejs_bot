const express = require('express');
const authRoutes = require('./routes/auth');
const healthRoutes = require('./routes/health');
const { bot } = require('./utils/bot');
const morgan = require('morgan');
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json())

// Use routes
app.use('/auth', authRoutes);
app.use('health', healthRoutes);

bot.launch()
  .then(() => {
    console.log('Bot started');
  })
  .catch((error) => {
    console.log('Error starting bot:', error);
  });

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});