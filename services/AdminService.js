const AdminRepository = require("./../repositories/AdminRepository");
const UserRepository = require("./../repositories/UserRepository");
const EditorRepository = require("./../repositories/EditorRepository");

// Admin Service
// - manageUserRole()
const manageUserRole = async (user_id, newRole) => {
  const user = await UserRepository.getUserById(user_id);

  if (user.role === "ADMIN") {
    await AdminRepository.deleteAdmin(user_id);
  } else if (user.role === "EDITOR") {
    await EditorRepository.deleteEditor(user_id);
  }

  const updatedUser = await UserRepository.updatedUserRole(newRole);
  if (newRole === "EDITOR") {
    await EditorRepository.registerEditor(user_id);
  } else if (newRole === "ADMIN") {
    await AdminRepository.registerAdmin(user_id);
  }

  return updatedUser;
};

module.exports = {
  manageUserRole,
};
