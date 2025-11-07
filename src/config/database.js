const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      user_type TEXT NOT NULL CHECK(user_type IN ('engineer', 'community')),
      phone TEXT,
      location TEXT,
      bio TEXT,
      skills TEXT,
      profile_image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      community_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      required_skills TEXT,
      location TEXT NOT NULL,
      budget_min REAL,
      budget_max REAL,
      timeline TEXT,
      status TEXT DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'completed', 'cancelled')),
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (community_id) REFERENCES users(id)
    )
  `);

  // Bids table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bids (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      engineer_id TEXT NOT NULL,
      proposed_budget REAL NOT NULL,
      proposed_timeline TEXT NOT NULL,
      message TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id),
      FOREIGN KEY (engineer_id) REFERENCES users(id)
    )
  `);

  // Messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id),
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (receiver_id) REFERENCES users(id)
    )
  `);

  // Reviews table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      reviewer_id TEXT NOT NULL,
      reviewee_id TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id),
      FOREIGN KEY (reviewer_id) REFERENCES users(id),
      FOREIGN KEY (reviewee_id) REFERENCES users(id)
    )
  `);

  console.log('Database initialized successfully');
}

module.exports = { db, initializeDatabase };
