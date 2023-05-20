const AdminRepository = require("./../repositories/AdminRepository");
const UserRepository = require("./../repositories/UserRepository");
const EditorRepository = require("./../repositories/EditorRepository");
const BlogRepository = require("./../repositories/BlogRepository");
// Admin Service
// - manageUserRole()
const manageUserRole = async (user_id, newRole) => {
  const user = await UserRepository.getUserById(user_id);

  if (user.role === "ADMIN") {
    await AdminRepository.deleteAdmin(user_id);
  } else if (user.role === "EDITOR") {
    await EditorRepository.deleteEditor(user_id);
  }

  const updatedUser = await UserRepository.updatedUserRole(user_id, newRole);
  if (newRole === "EDITOR") {
    await EditorRepository.registerEditor(user_id);
  } else if (newRole === "ADMIN") {
    await AdminRepository.registerAdmin(user_id);
  }

  return updatedUser;
};

const manageUserSoc = async (user_id, society_member) => {
  const user = await UserRepository.getUserById(user_id);

  const updatedUser = await UserRepository.updatedUserSoc(user_id, society_member);

  return updatedUser;
};


const searchBlogs = async (query) => {
  const blogs = await BlogRepository.searchBlogsByTitle(query, 0, 5000);
  return blogs;
};
const getAllBlogs = async () => {
  const blogs = await BlogRepository.getBlogsByNew(0, 5000);
  return blogs;
};
module.exports = {
  manageUserRole,
  manageUserSoc,
  searchBlogs,
  getAllBlogs,
};
