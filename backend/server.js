const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use environment variable

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Protected Notes
app.get('/notes', authenticateJWT, async (req, res) => {
  try {
    const notes = await prisma.note.findMany({ where: { userId: req.user.id } });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching notes' });
  }
});

app.post('/notes', authenticateJWT, async (req, res) => {
  const { title, content, category } = req.body;
  try {
    const note = await prisma.note.create({
      data: {
        title,
        content,
        category,
        user: { connect: { id: req.user.id } },
      },
    });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Error creating note' });
  }
});

// JWT Middleware
function authenticateJWT(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Automatic Backup
const backupDir = path.join(__dirname, '../backup');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

setInterval(async () => {
  try {
    const notes = await prisma.note.findMany();
    const backupPath = path.join(backupDir, 'notes-backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(notes, null, 2), 'utf-8');
    console.log(`Notes backup created at: ${backupPath}`);
  } catch (error) {
    console.error('Error creating notes backup:', error);
  }
}, 60000); // Every 60 seconds


// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
