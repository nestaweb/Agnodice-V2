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

  console.log('Token authenticateToken:', token);

  if (!token) {
    // Redirect to the login page if the token is missing
    return res.redirect('/login');
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      // Redirect to the login page if the token is invalid
      // return res.redirect('/login');
    }

    req.user = user;
    next();
  });
}

app.get('/api/admin', authenticateToken, (req, res) => {
  // This route is protected by JWT
  // You can add your logic to serve the admin data here
  res.json({ message: 'You have access to admin data!' });
});

// Authentication endpoint
app.post('/api/authenticate', async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  // Find the user in the database (replace with a database query)
  const user = users.find((u) => u.username === username);

  // Check if the user exists and the password is correct
  if (user && (await bcrypt.compare(password, user.passwordHash))) {
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

    // Send the token in the response
    console.log('Token:', token);
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.get('/admin', (req, res) => {
  const adminFilePath = path.join(__dirname, '../frontend', 'admin.html');
  console.log('Sending admin.html from path:', adminFilePath);

  res.sendFile(adminFilePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error serving admin.html');
    }
  });
});

app.get('/login', (req, res) => {
  const loginFilePath = path.join(__dirname, '../frontend', 'login.html');
  console.log('Sending login.html from path:', loginFilePath);

  res.sendFile(loginFilePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error serving login.html');
    }
  });
});

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
});
