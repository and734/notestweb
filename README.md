# notestweb

📝 Notestweb App – Full-Stack Web Application
🌟 Un'applicazione web per prendere e gestire note, con autenticazione, database reale, sincronizzazione cloud, backup automatico e installazione come PWA. 

🧩 Funzionalità principali
✅ Autenticazione JWT – Login con credenziali e token sicuro

🗃 Database reale – SQLite (facile da sostituire con PostgreSQL o MongoDB)

📱 PWA (Progressive Web App) – Installabile come app nativa

☁️ Sincronizzazione cloud – Dati sincronizzati tramite API

💾 Backup automatico – Esportazione automatica delle note ogni 60 secondi

🧪 Live Demo
🔗 👉 Live Preview su CodeSandbox (not functional)
📁 Struttura del progetto

note-app/

├── public/

│   ├── manifest.json

│   └── icons/

├── src/

│   └── App.jsx

├── server.js

├── package.json

└── README.md

🚀 Tecnologie utilizzate
Frontend
React + Tailwind CSS
Backend
Node.js + Express
Database
SQLite (in-memory)
Sicurezza
JWT
PWA
manifest.json
Build Tool
Vite / Create React App (su CodeSandbox)

📦 Requisiti di sistema
Node.js v14+
npm o yarn
Browser moderno (Chrome, Firefox, Safari)


🔧 Come avviare il progetto
1. Avvia il backend
bash
node server.js

2. Avvia il frontend
Se stai usando create-react-app:

bash
npm start

Se stai usando vite:

bash
npm run dev

3. Apri il browser
Vai a http://localhost:3000

🔐 Credenziali di esempio
Username: demo
Password: demo123

📤 Backup automatico
Il sistema genera un backup delle note ogni 60 secondi in:
backup/notes-backup.json


🧩 Estensioni future (suggerite)

🔁 Sostituire SQLite con PostgreSQL o MongoDB

☁️ Aggiungere sincronizzazione con Google Drive / Dropbox

🔁 Backup su cloud storage (AWS S3, Firebase, ecc.)

📲 Notifiche push con Firebase Cloud Messaging

🔍 Ricerca full-text delle note

✅ Contribuire

Se vuoi contribuire al progetto, puoi:

1 Forkare il repository
2 Creare una nuova feature branch (git checkout -b feature/nome)
3 Commit delle modifiche (git commit -m 'Aggiunta feature')
4 Push sulla branch (git push origin feature/nome)
5 Aprire una Pull Request

📬 Supporto
Per domande, bug o suggerimenti, apri un issue su GitHub o contattami direttamente.

📜 Licenza
Questo progetto è rilasciato sotto licenza MIT . Per maggiori informazioni, vedi il file LICENSE.

❤️ Ringraziamenti
Grazie per aver utilizzato questa app! Se ti è piaciuta, lascia una stella su GitHub o condividila con altri sviluppatori.
