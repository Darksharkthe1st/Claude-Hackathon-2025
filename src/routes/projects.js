const express = require('express');
const { body, query } = require('express-validator');
const Project = require('../models/Project');
const { authenticateToken, requireUserType, optionalAuth } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');

const router = express.Router();

// Get all projects (with optional filters)
router.get('/', optionalAuth, (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      category: req.query.category,
      location: req.query.location,
      skills: req.query.skills
    };

    const projects = Project.findAll(filters);

    // Add bid count to each project
    const projectsWithBids = projects.map(project => ({
      ...project,
      bidCount: Project.getBidCount(project.id)
    }));

    res.json({ projects: projectsWithBids });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
});

// Get single project
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const project = Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to retrieve project' });
  }
});

// Create project (community only)
router.post('/',
  authenticateToken,
  requireUserType('community'),
  [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('category').trim().notEmpty(),
    body('location').trim().notEmpty(),
    body('requiredSkills').optional(),
    body('budgetMin').optional().isFloat({ min: 0 }),
    body('budgetMax').optional().isFloat({ min: 0 }),
    body('timeline').optional()
  ],
  validateRequest,
  (req, res) => {
    try {
      const {
        title, description, category, requiredSkills,
        location, budgetMin, budgetMax, timeline, imageUrl
      } = req.body;

      const project = Project.create({
        communityId: req.user.userId,
        title,
        description,
        category,
        requiredSkills,
        location,
        budgetMin,
        budgetMax,
        timeline,
        imageUrl
      });

      res.status(201).json({
        message: 'Project created successfully',
        project
      });
    } catch (error) {
      console.error('Create project error:', error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  }
);

// Update project (owner only)
router.put('/:id', authenticateToken, requireUserType('community'), (req, res) => {
  try {
    const project = Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check ownership
    if (project.community_id !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this project' });
    }

    const updates = {};
    const allowedFields = [
      'title', 'description', 'category', 'required_skills', 'location',
      'budget_min', 'budget_max', 'timeline', 'status', 'image_url'
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const updatedProject = Project.update(req.params.id, updates);

    res.json({
      message: 'Project updated successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project (owner only)
router.delete('/:id', authenticateToken, requireUserType('community'), (req, res) => {
  try {
    const project = Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.community_id !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this project' });
    }

    Project.delete(req.params.id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Get my projects (community)
router.get('/my/projects', authenticateToken, requireUserType('community'), (req, res) => {
  try {
    const projects = Project.findAll({ communityId: req.user.userId });

    const projectsWithBids = projects.map(project => ({
      ...project,
      bidCount: Project.getBidCount(project.id)
    }));

    res.json({ projects: projectsWithBids });
  } catch (error) {
    console.error('Get my projects error:', error);
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
});

module.exports = router;
