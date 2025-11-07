import Project from '../models/Project.js';
import { calculateToolMatch } from '../utils/matchHelpers.js';

export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create({
      ...req.body,
      postedBy: req.user._id
    });

    const populated = await project.populate([
      { path: 'postedBy', select: 'name userType location' },
      { path: 'volunteers', select: 'name userType location toolsOwned' }
    ]);

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const { difficulty, tools, status, projectType, zip } = req.query;

    const filters = {};

    if (difficulty) filters.difficulty = difficulty;
    if (status) filters.status = status;
    if (projectType) filters.projectType = projectType;
    if (zip) filters['location.zip'] = zip;
    if (tools) {
      const toolsArray = tools.split(',').map((tool) => tool.trim());
      filters.toolsRequired = { $all: toolsArray };
    }

    const projects = await Project.find(filters)
      .populate('postedBy', 'name userType location')
      .populate('volunteers', 'name userType location toolsOwned');

    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('postedBy', 'name userType location')
      .populate('volunteers', 'name userType location toolsOwned');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const matchScore = req.user
      ? calculateToolMatch(req.user.toolsOwned, project.toolsRequired)
      : null;

    res.json({ project, matchScore });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.postedBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    Object.assign(project, req.body);
    await project.save();

    const populated = await project.populate([
      { path: 'postedBy', select: 'name userType location' },
      { path: 'volunteers', select: 'name userType location toolsOwned' }
    ]);

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.postedBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await project.deleteOne();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const volunteerForProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.volunteers.some((volunteerId) => volunteerId.equals(req.user._id))) {
      return res.status(400).json({ message: 'Already joined this project' });
    }

    project.volunteers.push(req.user._id);
    await project.save();

    const populated = await project.populate([
      { path: 'postedBy', select: 'name userType location' },
      { path: 'volunteers', select: 'name userType location toolsOwned' }
    ]);

    const matchScore = calculateToolMatch(req.user.toolsOwned, populated.toolsRequired);

    res.json({ project: populated, matchScore });
  } catch (error) {
    next(error);
  }
};

