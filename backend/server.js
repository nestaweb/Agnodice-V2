// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const SERVER_PORT = 3001;
const secretKey = 'aebbb561455863a4932531246f612ef7f70a09929f75ff3695ff569288735fbe';

app.use(cors());
app.use(bodyParser.json());

const users = [
  {
    username: 'admin',
    passwordHash: '$2b$10$l2GOlhIH0bRPL3U4oDk.gubj/.JkDJf5nWc1UoUfuFC6Px9D55ijS',
  },
];

// Middleware to verify the JWT token
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Unauthorized access');

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user;
    next();
  });
}

// Redirect to root if attempting to access admin.html without a valid token
app.use('/admin.html', (req, res) => {
	console.log('Redirecting to root...');
	// res.redirect('/'); // Redirect to the root URL
  });

// Protected endpoint using JWT authentication
app.get('/api/admin', authenticateToken, (req, res) => {
  // This route is protected by JWT
  // You can add your logic to serve the admin page here
  res.sendFile(path.join(__dirname, '../frontend', 'admin.html'));
});

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Authentication endpoint
app.post('/api/authenticate', async (req, res) => {
  const { username, password } = req.body;

  // Find the user in the database (replace with a database query)
  const user = users.find((u) => u.username === username);

  // Check if the user exists and the password is correct
  if (user && (await bcrypt.compare(password, user.passwordHash))) {
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
});
