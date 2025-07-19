# Note App

This is a simple note-taking application with a React frontend and a Node.js backend.

## Project Structure

- `frontend/`: Contains the React frontend application.
- `backend/`: Contains the Node.js backend application with Express and Prisma.
- `docker-compose.yml`: Defines the services, networks, and volumes for the application.
- `backup/`: Contains a backup of the notes in `notes-backup.json`.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/note-app.git
   cd note-app
   ```

2. **Create a `.env` file in the `backend` directory:**

   Copy the example file and update the values with your own.

   ```bash
   cp backend/.env.example backend/.env
   ```

3. **Build and run the application with Docker Compose:**

   ```bash
   docker-compose up --build
   ```

   This will start the following services:
   - `frontend`: The React application, accessible at `http://localhost:3000`
   - `backend`: The Node.js API server, accessible at `http://localhost:3001`
   - `db`: A PostgreSQL database.

4. **Access the application:**

   Open your browser and navigate to `http://localhost:3000`.

## Database Migrations

To apply database migrations, you can run the following command:

```bash
docker-compose run --rm backend npx prisma migrate dev
```

This will apply any pending migrations to the database. You will be prompted to name the migration.
