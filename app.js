const express = require('express');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const healthRoutes = require('./routes/health'); 
const { bot } = require('./utils/bot');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const helmet = require("helmet");
const port = process.env.PORT || 3000;

const app = express();
app.use(helmet());

app.use(morgan('tiny'));
app.use(express.json());
app.use(bodyParser.json())

// Use routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/health', healthRoutes);

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
