const { UserModel } = require("../model/user");

const getAllUsers = () => UserModel.find();
const createUser = (data) => new UserModel(data).save();
const getUserByEmail = (userEmail) => UserModel.findOne({ email: userEmail });
const getUserById = (id) => UserModel.findById(id);
const updateUser = (id, data) =>
  UserModel.findByIdAndUpdate(id, data, { new: true });
const deleteUser = (id) => UserModel.findByIdAndDelete(id);

const getUsersByRole = (role) => UserModel.find({ role });

module.exports = {
  getAllUsers,
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByRole,
};
