const User = require("../models/User");
const isDatabaseConnected = require("../utils/isDatabaseConnected");
const { getUserById, getCharityById } = require("../utils/localStore");

const getDashboard = async (req, res) => {
  try {
    let user;

    if (isDatabaseConnected()) {
      user = await User.findById(req.user._id)
        .select("-password")
        .populate("selectedCharity");
    } else {
      user = getUserById(req.user._id);

      if (user) {
        const { password, ...safeUser } = user;
        safeUser.selectedCharity = safeUser.selectedCharity
          ? getCharityById(safeUser.selectedCharity)
          : null;
        user = safeUser;
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const latestScores = [...user.scores].sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        profile: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
        latestScores,
        selectedCharity: user.selectedCharity
          ? {
              id: user.selectedCharity._id,
              name: user.selectedCharity.name,
              description: user.selectedCharity.description,
              charityPercentage: user.charityPercentage,
            }
          : null,
        drawParticipation: {
          totalParticipations: user.drawStats.totalParticipations,
          lastDrawNumbers: user.drawStats.lastDrawNumbers,
          lastMatchedNumbers: user.drawStats.lastMatchedNumbers,
          lastMatchCount: user.drawStats.lastMatchCount,
          lastResult: user.drawStats.lastResult,
        },
        winnings: {
          lastWinnings: user.drawStats.lastWinnings,
          totalWinnings: user.drawStats.totalWinnings,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard data",
    });
  }
};

module.exports = {
  getDashboard,
};
