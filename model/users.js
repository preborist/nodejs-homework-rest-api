const User = require('./schemas/user');

const findById = async id => {
  return await User.findOne({ _id: id });
};

const findByEmail = async email => {
  return await User.findOne({ email });
};

const create = async options => {
  const user = new User(options);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};
const updateAvatar = async (id, avatarURL) => {
  return await User.updateOne({ _id: id }, { avatarURL });
};

const getUserByVerifyToken = async token => {
  return await User.findOne({ verifyToken: token });
};

const updateVerifyToken = async (id, verify, token) => {
  return await User.updateOne({ _id: id }, { verify, verifyToken: token });
};

module.exports = {
  findById,
  findByEmail,
  create,
  updateToken,
  updateAvatar,
  getUserByVerifyToken,
  updateVerifyToken,
};
