const UserRepository = require("./../repositories/UserRepository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  genPassword,
  validPassword,
  issueJWT
} = require("../lib/utils");
const {
  uploadPfp
} = require("../repositories/PfpRepository");

// User Service
// - getUser()
const getUser = async (user_id) => {
  return await UserRepository.getUserById(user_id);
};

// getAllUsers()
const getAllUsers = async()=>{
  return await UserRepository.getAllUsers();
}

const getUserByEmail = async (email) => {
  return await UserRepository.getUserByEmail(email);
};

// - loginUser()
const loginUser = async (email, password) => {
  const user = await UserRepository.getUserByEmail(email);
  if (!user) return null;
  const isValid = validPassword(password, user.hash, user.salt);
  if (!isValid) return null;
  const tokenObject = issueJWT(user);
  return tokenObject;
};

// - registerUser()
const registerUser = async (userBody) => {
  // generate password
  const {
    salt,
    hash
  } = genPassword(userBody.password);
  // generate pfp
  const pfp_url = pickCuteMinimalPfpUrl();
  var userBody = {
    name: userBody.name,
    email: userBody.email,
    salt,
    hash,
    pfp_url,
  };

  // use repository to create and save the user
  const registeredUser = await UserRepository.registerUser(userBody);
  return registeredUser;
};

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
const editUserProfilePicture = async (user_id, image) => {
  const uploadResponse = await uploadPfp(image, user_id);
  const updatedUser = await UserRepository.updatePfp(
    user_id,
    uploadResponse.secure_url
  );
  return updatedUser;
};

const editUserPass = async (user_id, old_pass, new_pass) => {
  const user = await UserRepository.getUserById(user_id);
  const isValid = validPassword(old_pass, user.hash, user.salt);
  if (!isValid) return {
    success: false,
    message: "Old password dont match"
  };

  const {
    salt,
    hash
  } = genPassword(new_pass);
  const updatedUser = await UserRepository.updatedUserPass(user_id, hash, salt);
  return {
    success: true,
    message: "successfully updated password"
  };
};

const resetUserPass = async (user_id, new_pass) => {
  const user = await UserRepository.getUserById(user_id);

  const {
    salt,
    hash
  } = genPassword(new_pass);
  const updatedUser = await UserRepository.updatedUserPass(user_id, hash, salt);
  return {
    success: true,
    message: "successfully updated password"
  };
};

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

function pickCuteMinimalPfpUrl(urls) {
  const cuteMinimalPfpUrls = [
    "https://w0.peakpx.com/wallpaper/437/685/HD-wallpaper-cute-dog-louis16art-animal-cartoon-kawai-kawaii-love-lovely-mascot-pet-puppy.jpg",
    "https://previews.123rf.com/images/jaaakworks/jaaakworks1903/jaaakworks190300042/119144917-vector-cartoon-character-cute-golden-retriever-puppy-dog-for-design.jpg",
    "https://i.seadn.io/gae/E8KIjWxG0gOIj3wKTKs3bmq_hYOchLNuOII_tSeBRmJ5IiCFj0SOZ8J74UnUWLITIqTOuAuMI8urnIxk1Jh50R45DJN3rJXp-0Jy-Q?auto=format&w=1400&fr=1",
    "https://img.freepik.com/premium-vector/cute-panda-holding-love-heart-illustration-panda-mascot-cartoon-characters-animals-icon-concept-isolated_400474-166.jpg?w=360",
    "https://simg.nicepng.com/png/small/952-9528838_anime-animal-transparent-background.png",
    "https://i.pinimg.com/736x/a8/37/f6/a837f6ed88a2efe576f88c01c21a6fd4.jpg",
    "https://static.vecteezy.com/ti/vetor-gratis/p3/4530593-animal-fofo-chibi-gratis-vetor.jpg",
    "https://w0.peakpx.com/wallpaper/677/922/HD-wallpaper-baseball-dog-louis16art-animal-cap-cartoon-cute-drawing-illustration-kawaii-puppy-sd-toon.jpg",
    // Add more cute minimal PFP URLs here
  ];

  const pfpUrls = urls || cuteMinimalPfpUrls; // Use provided URLs or default array

  const randomIndex = Math.floor(Math.random() * pfpUrls.length);
  const randomPfpUrl = pfpUrls[randomIndex];

  return randomPfpUrl;
}

const deleteUser = async (user_id) => {
  await UserRepository.deleteUser(user_id);
}

const registerUserForEvent = async (user_id, event_id) => {
  const updatedUser = await UserRepository.registerUserForEvent(user_id, event_id);
  return updatedUser;
}

const getReadingList = async (user_id) => {
  const lists = await UserRepository.getList(user_id);
 
  return lists;
};

module.exports = {
  removeBlogFromReadingLIst,
  addBlogToReadingList,
  getReadingList,
  editUserProfile,
  getUserByEmail,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  editUserProfilePicture,
  editUserPass,
  resetUserPass,
  deleteUser,
  registerUserForEvent,
  getAllUsers
};