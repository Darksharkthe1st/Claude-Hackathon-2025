const express = require('express');
const { body } = require('express-validator');
const Bid = require('../models/Bid');
const Project = require('../models/Project');
const { authenticateToken, requireUserType } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');

const router = express.Router();

// Get bids for a project (community owner only)
router.get('/project/:projectId', authenticateToken, (req, res) => {
  try {
    const project = Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only project owner can see bids
    if (project.community_id !== req.user.userId && req.user.userType !== 'engineer') {
      return res.status(403).json({ error: 'Not authorized to view these bids' });
    }

    const bids = Bid.findByProject(req.params.projectId);
    res.json({ bids });
  } catch (error) {
    console.error('Get project bids error:', error);
    res.status(500).json({ error: 'Failed to retrieve bids' });
  }
});

// Get my bids (engineer)
router.get('/my/bids', authenticateToken, requireUserType('engineer'), (req, res) => {
  try {
    const bids = Bid.findByEngineer(req.user.userId);
    res.json({ bids });
  } catch (error) {
    console.error('Get my bids error:', error);
    res.status(500).json({ error: 'Failed to retrieve bids' });
  }
});

// Create bid (engineer only)
router.post('/',
  authenticateToken,
  requireUserType('engineer'),
  [
    body('projectId').notEmpty(),
    body('proposedBudget').isFloat({ min: 0 }),
    body('proposedTimeline').notEmpty(),
    body('message').optional()
  ],
  validateRequest,
  (req, res) => {
    try {
      const { projectId, proposedBudget, proposedTimeline, message } = req.body;

      // Check if project exists and is open
      const project = Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      if (project.status !== 'open') {
        return res.status(400).json({ error: 'Project is not accepting bids' });
      }

      // Check if engineer already bid
      const existingBid = Bid.checkExisting(projectId, req.user.userId);
      if (existingBid) {
        return res.status(400).json({ error: 'You have already bid on this project' });
      }

      const bid = Bid.create({
        projectId,
        engineerId: req.user.userId,
        proposedBudget,
        proposedTimeline,
        message
      });

      res.status(201).json({
        message: 'Bid submitted successfully',
        bid
      });
    } catch (error) {
      console.error('Create bid error:', error);
      res.status(500).json({ error: 'Failed to submit bid' });
    }
  }
);

// Update bid status (community only - accept/reject)
router.patch('/:id/status',
  authenticateToken,
  requireUserType('community'),
  [
    body('status').isIn(['accepted', 'rejected'])
  ],
  validateRequest,
  (req, res) => {
    try {
      const bid = Bid.findById(req.params.id);
      if (!bid) {
        return res.status(404).json({ error: 'Bid not found' });
      }

      // Check if user owns the project
      const project = Project.findById(bid.project_id);
      if (project.community_id !== req.user.userId) {
        return res.status(403).json({ error: 'Not authorized to update this bid' });
      }

      const updatedBid = Bid.updateStatus(req.params.id, req.body.status);

      res.json({
        message: `Bid ${req.body.status} successfully`,
        bid: updatedBid
      });
    } catch (error) {
      console.error('Update bid status error:', error);
      res.status(500).json({ error: 'Failed to update bid status' });
    }
  }
);

// Delete/withdraw bid (engineer only - own bids)
router.delete('/:id', authenticateToken, requireUserType('engineer'), (req, res) => {
  try {
    const bid = Bid.findById(req.params.id);
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    if (bid.engineer_id !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this bid' });
    }

    if (bid.status === 'accepted') {
      return res.status(400).json({ error: 'Cannot withdraw an accepted bid' });
    }

    Bid.delete(req.params.id);

    res.json({ message: 'Bid withdrawn successfully' });
  } catch (error) {
    console.error('Delete bid error:', error);
    res.status(500).json({ error: 'Failed to withdraw bid' });
  }
});

module.exports = router;
