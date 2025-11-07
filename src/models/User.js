const { db } = require('../config/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class User {
  static create({ email, password, name, userType, phone, location, bio, skills }) {
    const id = uuidv4();
    const hashedPassword = bcrypt.hashSync(password, 10);

    const stmt = db.prepare(`
      INSERT INTO users (id, email, password, name, user_type, phone, location, bio, skills)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, email, hashedPassword, name, userType, phone, location, bio, skills);

    return this.findById(id);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  }

  static findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  static findEngineers(filters = {}) {
    let query = 'SELECT id, email, name, user_type, phone, location, bio, skills, created_at FROM users WHERE user_type = ?';
    const params = ['engineer'];

    if (filters.skills) {
      query += ' AND skills LIKE ?';
      params.push(`%${filters.skills}%`);
    }

    if (filters.location) {
      query += ' AND location LIKE ?';
      params.push(`%${filters.location}%`);
    }

    const stmt = db.prepare(query);
    return stmt.all(...params);
  }

  static update(id, updates) {
    const allowedFields = ['name', 'phone', 'location', 'bio', 'skills', 'profile_image'];
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const stmt = db.prepare(`
      UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);

    stmt.run(...values);
    return this.findById(id);
  }

  static verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }

  static getStats(userId) {
    const user = this.findById(userId);
    if (!user) return null;

    if (user.user_type === 'engineer') {
      const stmt = db.prepare(`
        SELECT
          COUNT(*) as total_bids,
          SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted_bids
        FROM bids WHERE engineer_id = ?
      `);
      return stmt.get(userId);
    } else {
      const stmt = db.prepare(`
        SELECT
          COUNT(*) as total_projects,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_projects
        FROM projects WHERE community_id = ?
      `);
      return stmt.get(userId);
    }
  }
}

module.exports = User;
