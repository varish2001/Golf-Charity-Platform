const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const dataDirectory = path.join(__dirname, "..", "data");
const dataFilePath = path.join(dataDirectory, "local-db.json");

const defaultCharities = [
  {
    _id: "charity-1",
    name: "Golf Care Foundation",
    description: "Supports community golf training for young players.",
  },
  {
    _id: "charity-2",
    name: "Fairway Hope Fund",
    description: "Helps families with education and sports support.",
  },
  {
    _id: "charity-3",
    name: "Green Future Trust",
    description: "Funds environmental and community wellness programs.",
  },
];

const createDefaultData = () => {
  return {
    users: [],
    charities: defaultCharities,
  };
};

const ensureDataFile = () => {
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }

  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify(createDefaultData(), null, 2));
  }
};

const readData = () => {
  ensureDataFile();

  try {
    const rawData = fs.readFileSync(dataFilePath, "utf-8");
    const parsedData = JSON.parse(rawData);

    if (!Array.isArray(parsedData.charities) || parsedData.charities.length === 0) {
      parsedData.charities = defaultCharities;
      fs.writeFileSync(dataFilePath, JSON.stringify(parsedData, null, 2));
    }

    return parsedData;
  } catch (error) {
    const fallbackData = createDefaultData();
    fs.writeFileSync(dataFilePath, JSON.stringify(fallbackData, null, 2));
    return fallbackData;
  }
};

const writeData = (data) => {
  ensureDataFile();
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

const createUserObject = ({ name, email, password }) => {
  const now = new Date().toISOString();

  return {
    _id: crypto.randomUUID(),
    name,
    email,
    password,
    scores: [],
    selectedCharity: null,
    charityPercentage: 0,
    drawStats: {
      totalParticipations: 0,
      lastDrawNumbers: [],
      lastMatchedNumbers: [],
      lastMatchCount: 0,
      lastResult: "No draw yet",
      lastWinnings: 0,
      totalWinnings: 0,
    },
    createdAt: now,
    updatedAt: now,
  };
};

const getUsers = () => {
  const data = readData();
  return data.users;
};

const getUserById = (userId) => {
  const data = readData();
  return data.users.find((user) => user._id === userId) || null;
};

const getUserByEmail = (email) => {
  const data = readData();
  return data.users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
};

const createUser = ({ name, email, password }) => {
  const data = readData();
  const user = createUserObject({ name, email, password });
  data.users.push(user);
  writeData(data);
  return user;
};

const updateUser = (userId, updater) => {
  const data = readData();
  const userIndex = data.users.findIndex((user) => user._id === userId);

  if (userIndex === -1) {
    return null;
  }

  const currentUser = data.users[userIndex];
  const updatedUser = updater({
    ...currentUser,
  });

  updatedUser.updatedAt = new Date().toISOString();
  data.users[userIndex] = updatedUser;
  writeData(data);

  return updatedUser;
};

const getCharities = () => {
  const data = readData();
  return data.charities;
};

const getCharityById = (charityId) => {
  const data = readData();
  return data.charities.find((charity) => charity._id === charityId) || null;
};

module.exports = {
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  getCharities,
  getCharityById,
};
