require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');
const { bot } = require('./utils/bot');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

// Serve static files
app.use(express.static('views'));

// Use routes
app.use('/api/auth', authRoutes);

// Serve the main HTML file for the root route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/app.html');
});

bot.launch()
  .then(() => {
    console.log('Bot started');
  })
  .catch((error) => {
    console.log('Error starting bot:', error);
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
