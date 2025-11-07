import ChatMessage from '../models/ChatMessage.js';
import Project from '../models/Project.js';

export const getProjectChat = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const messages = await ChatMessage.find({ projectId })
      .sort({ createdAt: 1 })
      .populate('userId', 'name userType');

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const postProjectMessage = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { message } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const chatMessage = await ChatMessage.create({
      projectId,
      userId: req.user._id,
      message
    });

    const populatedMessage = await chatMessage.populate('userId', 'name userType');

    res.status(201).json(populatedMessage);
  } catch (error) {
    next(error);
  }
};

