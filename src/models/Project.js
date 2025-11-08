const { prepare } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Project {
  static create({
    communityId, title, description, category, requiredSkills,
    location, budgetMin, budgetMax, timeline, imageUrl
  }) {
    const id = uuidv4();

    const stmt = prepare(`
      INSERT INTO projects
      (id, community_id, title, description, category, required_skills, location,
       budget_min, budget_max, timeline, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      communityId,
      title,
      description,
      category,
      requiredSkills || null,
      location,
      budgetMin || null,
      budgetMax || null,
      timeline || null,
      imageUrl || null
    );

    return this.findById(id);
  }

  static findById(id) {
    const stmt = prepare(`
      SELECT p.*, u.name as community_name, u.email as community_email
      FROM projects p
      JOIN users u ON p.community_id = u.id
      WHERE p.id = ?
    `);
    return stmt.get(id);
  }

  static findAll(filters = {}) {
    let query = `
      SELECT p.*, u.name as community_name, u.location as community_location
      FROM projects p
      JOIN users u ON p.community_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      query += ' AND p.status = ?';
      params.push(filters.status);
    }

    if (filters.category) {
      query += ' AND p.category = ?';
      params.push(filters.category);
    }

    if (filters.location) {
      query += ' AND p.location LIKE ?';
      params.push(`%${filters.location}%`);
    }

    if (filters.skills) {
      query += ' AND p.required_skills LIKE ?';
      params.push(`%${filters.skills}%`);
    }

    if (filters.communityId) {
      query += ' AND p.community_id = ?';
      params.push(filters.communityId);
    }

    query += ' ORDER BY p.created_at DESC';

    const stmt = prepare(query);
    return stmt.all(...params);
  }

  static update(id, updates) {
    const allowedFields = [
      'title', 'description', 'category', 'required_skills', 'location',
      'budget_min', 'budget_max', 'timeline', 'status', 'image_url'
    ];
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
    const stmt = prepare(`
      UPDATE projects SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);

    stmt.run(...values);
    return this.findById(id);
  }

  static delete(id) {
    const stmt = prepare('DELETE FROM projects WHERE id = ?');
    return stmt.run(id);
  }

  static getBidCount(projectId) {
    const stmt = prepare('SELECT COUNT(*) as count FROM bids WHERE project_id = ?');
    return stmt.get(projectId).count;
  }
}

module.exports = Project;
