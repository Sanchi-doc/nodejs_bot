const express = require('express');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const healthRoutes = require('./routes/health'); 
const { bot } = require('./utils/bot');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use(express.json());
app.use(bodyParser.json())

// Use routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/health', healthRoutes); 


app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  // Validate credentials (replace with your own logic)
  if (email === 'user@example.com' && password === 'password') {
    const token = jwt.sign({ email }, 'your-secret-key', { expiresIn: '1h' })
    res.json({ token, user: { email } })
  } else {
    res.status(401).json({ message: 'Invalid credentials' })
  }
})

app.get('/api/auth/user', (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  try {
    const decoded = jwt.verify(token, 'your-secret-key')
    res.json({ user: { email: decoded.email } })
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
})

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
