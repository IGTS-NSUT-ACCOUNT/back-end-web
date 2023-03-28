const UserRepository = require("./../repositories/UserRepository");

// User Service
// - getUser()
const getUser = async (user_id) => {
  return await UserRepository.getUserById(user_id);
};
const getUserByEmail = async (email) => {
  return await UserRepository.getUserByEmail(email);
};

// - loginUser()
const loginUser = async () => {};

// - registerUser()
const registerUser = async () => {};

// - logoutUser()
const logoutUser = async () => {};

// - editUserProfile()
const editUserProfile = async (user_id, data) => {
  const updatedInfo = {
    user_id,
    ...data,
  };

  const updatedUser = await UserRepository.updateUserInfo(updatedInfo);
  return updatedUser;
};

// - editUserProfilePicture()
const editUserProfilePicture = async () => {};

// - addBlogToReadingList()
const addBlogToReadingList = async (blog_id, user_id) => {
  const updatedUser = await UserRepository.addBlogIdToReadingList(
    user_id,
    blog_id
  );
  return updatedUser;
};

// - removeBlogFromReadingLIst()
const removeBlogFromReadingLIst = async (blog_id, user_id) => {
  const updatedUser = await UserRepository.removeBlogFromReadingList(
    user_id,
    blog_id
  );
  return updatedUser;
};

module.exports = {
  removeBlogFromReadingLIst,
  addBlogToReadingList,
  editUserProfile,
  getUserByEmail,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  editUserProfilePicture,
};
