const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 45,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    _id: true,
  }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    scores: {
      type: [scoreSchema],
      default: [],
    },
    selectedCharity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Charity",
      default: null,
    },
    charityPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    drawStats: {
      totalParticipations: {
        type: Number,
        default: 0,
      },
      lastDrawNumbers: {
        type: [Number],
        default: [],
      },
      lastMatchedNumbers: {
        type: [Number],
        default: [],
      },
      lastMatchCount: {
        type: Number,
        default: 0,
      },
      lastResult: {
        type: String,
        default: "No draw yet",
      },
      lastWinnings: {
        type: Number,
        default: 0,
      },
      totalWinnings: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
