const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const QuizSubmission = require("../models/QuizSubmission");

const getAllUsers = async () => {
  return User.find().select("-passwordHash").sort({ createdAt: -1 });
};

const deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  await User.findByIdAndDelete(userId);
  // remove the user's records so admin lists don't show orphaned rows
  await Promise.all([
    Enrollment.deleteMany({ student: userId }),
    AssignmentSubmission.deleteMany({ student: userId }),
    QuizSubmission.deleteMany({ student: userId }),
  ]);
  return { message: "User deleted successfully" };
};

const updateUserRole = async (userId, role) => {
  if (!["student", "admin"].includes(role)) {
    throw new Error("Invalid role");
  }
  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  ).select("-passwordHash");
  if (!user) throw new Error("User not found");
  return user;
};

const toggleBanUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  user.isBanned = !user.isBanned;
  await user.save();
  return User.findById(userId).select("-passwordHash");
};

module.exports = { getAllUsers, deleteUser, updateUserRole, toggleBanUser };
