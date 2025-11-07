const { db } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Bid {
  static create({ projectId, engineerId, proposedBudget, proposedTimeline, message }) {
    const id = uuidv4();

    const stmt = db.prepare(`
      INSERT INTO bids (id, project_id, engineer_id, proposed_budget, proposed_timeline, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, projectId, engineerId, proposedBudget, proposedTimeline, message);

    return this.findById(id);
  }

  static findById(id) {
    const stmt = db.prepare(`
      SELECT b.*,
             u.name as engineer_name, u.email as engineer_email,
             u.skills as engineer_skills, u.location as engineer_location,
             p.title as project_title
      FROM bids b
      JOIN users u ON b.engineer_id = u.id
      JOIN projects p ON b.project_id = p.id
      WHERE b.id = ?
    `);
    return stmt.get(id);
  }

  static findByProject(projectId) {
    const stmt = db.prepare(`
      SELECT b.*,
             u.name as engineer_name, u.email as engineer_email,
             u.skills as engineer_skills, u.location as engineer_location
      FROM bids b
      JOIN users u ON b.engineer_id = u.id
      WHERE b.project_id = ?
      ORDER BY b.created_at DESC
    `);
    return stmt.all(projectId);
  }

  static findByEngineer(engineerId) {
    const stmt = db.prepare(`
      SELECT b.*,
             p.title as project_title, p.description as project_description,
             p.location as project_location, p.status as project_status,
             u.name as community_name
      FROM bids b
      JOIN projects p ON b.project_id = p.id
      JOIN users u ON p.community_id = u.id
      WHERE b.engineer_id = ?
      ORDER BY b.created_at DESC
    `);
    return stmt.all(engineerId);
  }

  static updateStatus(id, status) {
    const stmt = db.prepare(`
      UPDATE bids SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);
    stmt.run(status, id);

    // If bid is accepted, update project status to in_progress
    if (status === 'accepted') {
      const bid = this.findById(id);
      if (bid) {
        const updateProject = db.prepare(`
          UPDATE projects SET status = 'in_progress' WHERE id = ?
        `);
        updateProject.run(bid.project_id);
      }
    }

    return this.findById(id);
  }

  static checkExisting(projectId, engineerId) {
    const stmt = db.prepare(`
      SELECT * FROM bids WHERE project_id = ? AND engineer_id = ?
    `);
    return stmt.get(projectId, engineerId);
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM bids WHERE id = ?');
    return stmt.run(id);
  }
}

module.exports = Bid;
