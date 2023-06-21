const Admin = require("./../models/user/Admin");

// -registerAdmin();
const registerAdmin = async (user_id) => {
  const admin = new Admin({
    user_id
  });
  const savedAdmin = await admin.save();
  return savedAdmin;
};

const getAdminById = async (admin_id) => {
  const admin = await Admin.findById(admin_id);
  return admin;
};
const getAdminByUserId = async (user_id) => {
  const admin = await Admin.findOne({
    user_id: user_id
  });
  return admin;
};

const deleteAdmin = async (user_id) => {
  await Admin.findOneAndDelete({
    user_id: user_id
  });
};

const addBlogId = async (user_id, blog_id) => {
  const admin = await Admin.findOne({
    user_id: user_id
  });
  if (admin.blog_ids) admin.blog_ids.push(blog_id);
  else admin.blog_ids = [blog_id];
  const savedAdmin = await admin.save();
  return savedAdmin;
};
const getBlogIds = async (user_id) => {
  const admin = await Admin.findOne({
    user_id
  });
  if (admin && admin.blog_ids) return admin.blog_ids;
  else return [];
};
const deleteBlog = async (user_id, blog_id) => {
  const admin = await getAdminByUserId(user_id);
  admin.blog_ids = admin.blog_ids.filter((el) => !el.equals(blog_id));
  await admin.save();
}

const getAllAdmins= async()=>{
  const admins = await Admin.find()
  return admins;
}

module.exports = {
  registerAdmin,
  getAdminById,
  getAdminByUserId,
  deleteAdmin,
  addBlogId,
  getBlogIds,
  deleteBlog,
  getAllAdmins
};