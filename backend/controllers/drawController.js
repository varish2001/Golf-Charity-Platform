const User = require("../models/User");
const isDatabaseConnected = require("../utils/isDatabaseConnected");
const { getUsers, updateUser } = require("../utils/localStore");

const generateDrawNumbers = () => {
  const numbers = new Set();

  while (numbers.size < 5) {
    const randomNumber = Math.floor(Math.random() * 45) + 1;
    numbers.add(randomNumber);
  }

  return Array.from(numbers).sort((a, b) => a - b);
};

const calculateWinnings = (matchCount) => {
  if (matchCount === 3) {
    return 50;
  }

  if (matchCount === 4) {
    return 100;
  }

  if (matchCount === 5) {
    return 500;
  }

  return 0;
};

const runDraw = async (req, res) => {
  try {
    const drawNumbers = generateDrawNumbers();
    let users;

    if (isDatabaseConnected()) {
      users = await User.find().select("name email scores drawStats");
    } else {
      users = getUsers();
    }

    const results = [];

    for (const user of users) {
      const userNumbers = user.scores.map((item) => item.score);
      const matchedNumbers = userNumbers.filter((score) => drawNumbers.includes(score));
      const matchCount = matchedNumbers.length;
      const winnings = calculateWinnings(matchCount);
      const hasParticipated = userNumbers.length > 0;

      if (hasParticipated) {
        user.drawStats.totalParticipations += 1;
      }

      user.drawStats.lastDrawNumbers = drawNumbers;
      user.drawStats.lastMatchedNumbers = matchedNumbers;
      user.drawStats.lastMatchCount = matchCount;
      user.drawStats.lastResult = [3, 4, 5].includes(matchCount)
        ? `${matchCount} matches`
        : "No prize";
      user.drawStats.lastWinnings = winnings;
      user.drawStats.totalWinnings += winnings;

      if (isDatabaseConnected()) {
        await user.save();
      } else {
        updateUser(user._id, () => user);
      }

      results.push({
        userId: user._id,
        name: user.name,
        email: user.email,
        userScores: userNumbers,
        matchedNumbers,
        matchCount,
        result: user.drawStats.lastResult,
        winnings,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Draw completed successfully",
      data: {
        drawNumbers,
        results,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while running draw",
    });
  }
};

module.exports = {
  runDraw,
};
