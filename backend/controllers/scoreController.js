const User = require("../models/User");
const isDatabaseConnected = require("../utils/isDatabaseConnected");
const { getUserById, updateUser } = require("../utils/localStore");

const addScore = async (req, res) => {
  try {
    const { score, date } = req.body;

    if (score === undefined || !date) {
      return res.status(400).json({
        success: false,
        message: "Score and date are required",
      });
    }

    const numericScore = Number(score);
    const scoreDate = new Date(date);

    if (!Number.isInteger(numericScore) || numericScore < 1 || numericScore > 45) {
      return res.status(400).json({
        success: false,
        message: "Score must be an integer between 1 and 45",
      });
    }

    if (Number.isNaN(scoreDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Date must be valid",
      });
    }

    let user;

    if (isDatabaseConnected()) {
      user = await User.findById(req.user._id);
    } else {
      user = getUserById(req.user._id);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.scores.push({
      score: numericScore,
      date: scoreDate,
    });

    user.scores.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (user.scores.length > 5) {
      user.scores = user.scores.slice(user.scores.length - 5);
    }

    if (isDatabaseConnected()) {
      await user.save();
    } else {
      user = updateUser(req.user._id, () => user);
    }

    return res.status(201).json({
      success: true,
      message: "Score added successfully",
      data: {
        scores: user.scores,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while adding score",
    });
  }
};

const getScores = async (req, res) => {
  try {
    let user;

    if (isDatabaseConnected()) {
      user = await User.findById(req.user._id).select("scores");
    } else {
      user = getUserById(req.user._id);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const scores = [...user.scores].sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.status(200).json({
      success: true,
      message: "Scores fetched successfully",
      data: {
        scores,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching scores",
    });
  }
};

module.exports = {
  addScore,
  getScores,
};
