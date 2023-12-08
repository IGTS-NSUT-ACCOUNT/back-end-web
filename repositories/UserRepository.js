const { read } = require("fs");
const Blog = require("../models/blog/Blog");
const User = require("./../models/user/User");

const getUserById = async (user_id) => {
  const user = await User.findById(user_id);
  return user;
};
//getAllUsers()
const getAllUsers = async()=>{
  const users = await User.find()
  return users;
}

//   getUserByEmail() -
const getUserByEmail = async (email_id) => {
  const user = await User.findOne({
    email: email_id
  });
  return user;
};

//   updateGeneralInfo() -
const updateUserInfo = async ({
  user_id,
  name,
  phone,
  email,
  organization,
}) => {
  const user = await getUserById(user_id);
  user.name = name;
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

const updatedUserSoc = async (user_id, society_member) => {
  const user = await getUserById(user_id);
  user.society_member = society_member;
  const updatedUser = await user.save();
  return updatedUser;
};

//   updateUserRole -
const updatedUserPass = async (user_id, hash, salt) => {
  const user = await getUserById(user_id);
  user.hash = hash;
  user.salt = salt;
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
  //check if readingList has a blog_id in it and if not then push it
  if(!user.readingList.find((el)=>el.equals(blog_id)))
  {
    user.readingList.push(blog_id);
  }

  const updateduser = await user.save();
  return updateduser;
};

//   removeBlogFromReadingList();
const removeBlogFromReadingList = async (user_id, blog_id) => {
  const user = await getUserById(user_id);

  if (user.readingList.find((el)=>el.equals(blog_id))) {
    user.readingList = user.readingList.filter((el) => !blog_id.equals(el));
  }

  const updateduser = await user.save();
  return updateduser;
};

const registerUser = async ({
  name,
  hash,
  salt,
  pfp_url,
  email
}) => {
  const user = new User({
    name,
    hash,
    salt,
    pfp_url,
    email
  });
  const registeredUser = await user.save();
  return registeredUser;
};

const deleteUser = async (user_id) => {
  await User.findByIdAndDelete(user_id);
};

const registerUserForEvent = async (user_id, event_id) => {
  const user = await getUserById(user_id);
  user.registered_events.push(event_id);
  const updatedUser = await user.save();
  return updatedUser;
}

const unregisterUserForEvent = async (user_id, event_id) => {
  const user = await getUserById(user_id);
  user.registered_events = user.registered_events.filter((el) => !el.equals(event_id));
  const updatedUser = await user.save();
  return updatedUser;
}

const getList = async (user_id) => {
  const user = await getUserById(user_id);
  const readingList = user.readingList;
  //get blogs for each blog_id in readingList
  const finalreadingList = await Promise.all(readingList.map(async (el) => {
    const blog = await Blog.findById(el);
    return blog;
  }));
  return finalreadingList;
};




module.exports = {
  getList,
  getUserById,
  getUserByEmail,
  getReadingList,
  addBlogIdToReadingList,
  removeBlogFromReadingList,
  updateUserInfo,
  updatedUserRole,
  updatedUserSoc,
  updatePfp,
  registerUser,
  updatedUserPass,
  deleteUser,
  registerUserForEvent,
  unregisterUserForEvent,
  getAllUsers
};