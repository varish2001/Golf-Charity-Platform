const Charity = require("../models/Charity");
const User = require("../models/User");
const isDatabaseConnected = require("../utils/isDatabaseConnected");
const { getCharities: getLocalCharities, getCharityById, updateUser } = require("../utils/localStore");

const getCharities = async (req, res) => {
  try {
    let charities;

    if (isDatabaseConnected()) {
      charities = await Charity.find().sort({ createdAt: -1 });
    } else {
      charities = getLocalCharities();
    }

    return res.status(200).json({
      success: true,
      message: "Charities fetched successfully",
      data: {
        charities,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching charities",
    });
  }
};

const selectCharity = async (req, res) => {
  try {
    const { charityId, charityPercentage } = req.body;

    if (!charityId || charityPercentage === undefined) {
      return res.status(400).json({
        success: false,
        message: "Charity ID and charity percentage are required",
      });
    }

    const numericPercentage = Number(charityPercentage);

    if (Number.isNaN(numericPercentage) || numericPercentage < 0 || numericPercentage > 100) {
      return res.status(400).json({
        success: false,
        message: "Charity percentage must be between 0 and 100",
      });
    }

    let charity;

    if (isDatabaseConnected()) {
      charity = await Charity.findById(charityId);
    } else {
      charity = getCharityById(charityId);
    }

    if (!charity) {
      return res.status(404).json({
        success: false,
        message: "Charity not found",
      });
    }

    let user;

    if (isDatabaseConnected()) {
      user = await User.findByIdAndUpdate(
        req.user._id,
        {
          selectedCharity: charity._id,
          charityPercentage: numericPercentage,
        },
        {
          new: true,
        }
      ).populate("selectedCharity");
    } else {
      user = updateUser(req.user._id, (currentUser) => {
        currentUser.selectedCharity = charity._id;
        currentUser.charityPercentage = numericPercentage;
        return currentUser;
      });
      user.selectedCharity = charity;
    }

    return res.status(200).json({
      success: true,
      message: "Charity selected successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          charityPercentage: user.charityPercentage,
          selectedCharity: user.selectedCharity,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while selecting charity",
    });
  }
};

module.exports = {
  getCharities,
  selectCharity,
};
