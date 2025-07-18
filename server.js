const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret
const JWT_SECRET = 'your_jwt_secret_key';

// SQLite DB
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) console.error('Errore inizializzazione DB', err);
});

// Schema DB
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, title TEXT, content TEXT, category TEXT, userId INTEGER)');
  db.run('INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)', ['demo', 'demo123']);
});

// Middleware per verificare JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token richiesto' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token non valido' });
    req.user = user;
    next();
  });
};

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user || user.password !== password) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

// Note (protette)
app.get('/notes', authenticateJWT, (req, res) => {
  db.all('SELECT * FROM notes WHERE userId = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Errore nel recupero delle note' });
    res.json(rows);
  });
});

app.post('/notes', authenticateJWT, (req, res) => {
  const { title, content, category } = req.body;
  db.run('INSERT INTO notes (title, content, category, userId) VALUES (?, ?, ?, ?)', [title, content, category, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: 'Errore nel salvataggio della nota' });
    res.json({ id: this.lastID, title, content, category, userId: req.user.id });
  });
});

// Crea la cartella backup se non esiste
const backupDir = path.join(__dirname, 'backup');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// Export automatico delle note ogni 60 secondi
setInterval(() => {
  db.all('SELECT * FROM notes', [], (err, notes) => {
    if (err) {
      console.error('Errore nel recupero delle note per il backup:', err);
      return;
    }
    const backupPath = path.join(backupDir, 'notes-backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(notes, null, 2), 'utf-8');
    console.log(`Backup delle note creato in: ${backupPath}`);
  });
}, 60000); // Ogni 60 secondi