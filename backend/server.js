const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret'; // Usa variabile d'ambiente

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Credenziali non valide' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Note protette
app.get('/notes', authenticateJWT, async (req, res) => {
  const notes = await prisma.note.findMany({ where: { userId: req.user.id } });
  res.json(notes);
});

app.post('/notes', authenticateJWT, async (req, res) => {
  const { title, content, category } = req.body;
  const note = await prisma.note.create({
    data: {
      title,
      content,
      category,
      user: { connect: { id: req.user.id } },
    },
  });
  res.json(note);
});

// Middleware JWT
function authenticateJWT(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token richiesto' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token non valido' });
    req.user = user;
    next();
  });
}

// Avvia server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend in ascolto su http://localhost:${PORT}`);
});
