// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const cors = require('cors');
const path = require('path');
const { log } = require('console');

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());

app.get('/api/data', async (req, res) => {
  try {
    const data = await fs.readFile('data.json', 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Erreur de lecture du fichier JSON', error);
    res.status(500).send('Erreur serveur');
  }
});

const secretKey = 'aebbb561455863a4932531246f612ef7f70a09929f75ff3695ff569288735fbe';

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Accès non autorisé');

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).send('Token invalide');
    req.user = user;
    next();
  });
}

app.get('/api/authenticate', (req, res) => {
  const { username, password } = req.body;

  
  if (username === 'admin' && password === 'adminpassword') {
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send('Identifiants invalides');
  }
});

app.get('/api/admin', authenticateToken, (req, res) => {
  const adminFilePath = path.join(__dirname, '../frontend', 'admin.html');
  console.log('Sending admin.html from path:', adminFilePath);
  
  res.sendFile(adminFilePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error serving admin.html');
    }
  });
});


app.post('/api/data', async (req, res) => {
  try {
    const newData = req.body;
    await fs.writeFile('data.json', JSON.stringify(newData, null, 2));
    res.send('Données mises à jour avec succès');
  } catch (error) {
    console.error('Erreur d\'écriture dans le fichier JSON', error);
    res.status(500).send('Erreur serveur');
  }
});

app.listen(PORT, () => {
  console.log(`Serveur backend en cours d'exécution sur le port ${PORT}`);
});
