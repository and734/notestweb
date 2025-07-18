import React, { useState, useEffect } from 'react';

function App() {
  // Stati
  const [notes, setNotes] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState('Lavoro');
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:3000';

  // Recupera note
  useEffect(() => {
    if (token) fetchNotes();
  }, [token]);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_URL}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error('Errore nel recupero:', err);
    }
  };

  // Login
  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      } else {
        setError('Login fallito');
      }
    } catch (err) {
      setError('Errore nel login');
    }
  };

  // Crea nota
  const handleCreateNote = async () => {
    if (!newNoteTitle || !newNoteContent) return;
    try {
      const res = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newNoteTitle, content: newNoteContent, category: newNoteCategory }),
      });
      const createdNote = await res.json();
      setNotes([...notes, createdNote]);
      setNewNoteTitle('');
      setNewNoteContent('');
    } catch (err) {
      setError('Errore nel salvataggio della nota');
    }
  };

  // UI
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow w-96">
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border mb-2"
          />
          <button onClick={handleLogin} className="w-full bg-blue-500 text-white py-2 rounded">
            Accedi
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Note App</h1>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            setToken(null);
          }}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
        >
          Logout
        </button>
      </header>

      <div className="p-4 bg-white shadow mb-4">
        <h2 className="text-lg font-bold mb-2">Crea una nuova nota</h2>
        <input
          type="text"
          placeholder="Titolo"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 mb-2"
        />
        <textarea
          placeholder="Contenuto"
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          className="w-full p-2 border border-gray-300 mb-2"
          rows="4"
        />
        <select
          value={newNoteCategory}
          onChange={(e) => setNewNoteCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 mb-2 rounded"
        >
          <option value="Lavoro">Lavoro</option>
          <option value="Personale">Personale</option>
          <option value="Scuola">Scuola</option>
          <option value="Altro">Altro</option>
        </select>
        <button
          onClick={handleCreateNote}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Salva nota
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="bg-white rounded shadow p-4 hover:shadow-lg transition duration-300">
              <h2 className="text-lg font-bold">{note.title}</h2>
              <span className="text-sm text-gray-500">{note.category}</span>
              <p className="text-gray-700 mt-2">{note.content}</p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">Nessuna nota disponibile.</p>
        )}
      </div>
    </div>
  );
}

export default App;