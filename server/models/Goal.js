const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    targetDate: {
      type: Date,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active',
    },
    category: {
      type: String,
      enum: ['health', 'finance', 'career', 'education', 'personal', 'other'],
      default: 'other',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Goal', goalSchema);
