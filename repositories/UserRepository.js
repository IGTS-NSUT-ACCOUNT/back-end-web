const User = require("./../models/user/User");

// -registerAUser() -

//   getUserById() -
const getUserById = async (user_id) => {
  const user = await User.findById(user_id);
  return user;
};

//   getUserByEmail() -
const getUserByEmail = async (email_id) => {
  const user = await User.findOne({ email: email_id });
  return user;
};

//   updateGeneralInfo() -
const updateUserInfo = async ({
  user_id,
  first_name,
  last_name,
  phone,
  email,
  organization,
}) => {
  const user = await getUserById(id);
  user.name = { first_name, last_name };
  user.phone = phone;
  user.email = email;
  user.organization = organization;

  const updatedUser = await user.save();
  return updatedUser;
};

//   updatePfp() -
const updatePfp = async (user_id, pfp_url) => {
  const user = await getUserById(user_id);
  user.pfp_url = pfp_url;
  const updatedUser = await user.save();
  return updatedUser;
};

//   updateUserRole -
const updatedUserRole = async (user_id, role) => {
  const user = await getUserById(user_id);
  user.role = role;
  const updatedUser = await user.save();
  return updatedUser;
};
//   getReadingList() -
const getReadingList = async (user_id) => {
  const user = await getUserById(user_id);
  return user.readingList;
};

//   addBlogIdToReadingList() -
const addBlogIdToReadingList = async (user_id, blog_id) => {
  const user = await getUserById(user_id);
  user.readingList.push(blog_id);
  const updatedUser = await user.save();
  return updatedUser;
};

//   removeBlogFromReadingList();
const removeBlogFromReadingList = async (user_id, blog_id) => {
  const user = await getUserById(user_id);
  user.readingList = user.readingList.filter((el) => !blog_id.equals(el));
  const updatedUser = await user.save();
  return updatedUser;
};

module.exports = {
  getUserById,
  getUserByEmail,
  getReadingList,
  addBlogIdToReadingList,
  removeBlogFromReadingList,
  updateUserInfo,
  updatedUserRole,
  updatePfp,
};
