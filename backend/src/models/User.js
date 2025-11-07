import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    userType: {
      type: String,
      enum: ['community', 'volunteer'],
      required: true
    },
    location: {
      city: { type: String },
      zip: { type: String }
    },
    skills: [{
      type: String,
      trim: true
    }],
    toolsOwned: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

export default User;

