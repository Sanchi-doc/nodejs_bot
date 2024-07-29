const express = require('express');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const {bot} = require("./utils/bot");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Use routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

bot.launch()
  .then( () => {
    console.log('Bot started');
  }).catch((error) => {
    console.error('Error starting bot:', error);
  })

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
