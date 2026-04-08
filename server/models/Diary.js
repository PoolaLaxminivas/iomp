const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Diary entry title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Diary content is required'],
    },
    mood: {
      type: String,
      enum: ['happy', 'sad', 'neutral', 'excited', 'anxious', 'grateful'],
      default: 'neutral',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Diary', diarySchema);
