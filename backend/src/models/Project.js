import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    location: {
      city: { type: String, required: true },
      zip: { type: String, required: true }
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true
    },
    toolsRequired: [{
      type: String,
      trim: true
    }],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    volunteers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    status: {
      type: String,
      enum: ['open', 'in_progress', 'completed'],
      default: 'open'
    },
    images: [{
      type: String
    }],
    timeline: {
      startDate: Date,
      endDate: Date
    },
    projectType: {
      type: String,
      enum: ['repair', 'install', 'garden', 'build', 'restore'],
      default: 'build'
    }
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;

