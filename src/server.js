require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { initDb, initializeDatabase } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const bidRoutes = require('./routes/bids');
const engineerRoutes = require('./routes/engineers');

const app = express();
const PORT = process.env.PORT || 3000;

// Async initialization
async function startServer() {
  try {
    // Initialize database
    await initDb();
    initializeDatabase();
    console.log('Database initialized successfully');

    // Middleware
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Serve static files
    app.use(express.static(path.join(__dirname, '../public')));

    // API Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/projects', projectRoutes);
    app.use('/api/bids', bidRoutes);
    app.use('/api/engineers', engineerRoutes);

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: 'Wrench API is running' });
    });

    // Serve frontend for all other routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════╗
║   🔧 Wrench Server                           ║
║   Running on http://localhost:${PORT}        ║
╚══════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
