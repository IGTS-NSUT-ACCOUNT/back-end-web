const Admin = require("./../models/user/Admin");

// -registerAdmin();
const registerAdmin = async (user_id) => {
  const admin = new Admin({ user_id });
  const savedAdmin = await admin.save();
  return savedAdmin;
};

const getAdminById = async (admin_id) => {
  const admin = await Admin.findById(admin_id);
  return admin;
};
const getAdminByUserId = async (user_id) => {
  const admin = await Admin.findOne({ user_id: user_id });
  return admin;
};

const deleteAdmin = async (user_id) => {
  await Admin.findOneAndDelete({ user_id: user_id });
};

module.exports = { registerAdmin, getAdminById, getAdminByUserId, deleteAdmin };
