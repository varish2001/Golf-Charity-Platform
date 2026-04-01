const getHome = (req, res) => {
  res.json({
    success: true,
    message: "Golf Charity Platform API is running successfully",
  });
};

module.exports = {
  getHome,
};
