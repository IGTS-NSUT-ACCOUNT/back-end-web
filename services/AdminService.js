const AdminRepository = require("./../repositories/AdminRepository");
const UserRepository = require("./../repositories/UserRepository");
const EditorRepository = require("./../repositories/EditorRepository");
const BlogRepository = require("./../repositories/BlogRepository");
// Admin Service
// - manageUserRole()
const manageUserRole = async (user_id, newRole) => {
  const user = await UserRepository.getUserById(user_id);

  if (user.role === "ADMIN" && newRole === "EDITOR"){
      const adminUser = await AdminRepository.getAdminByUserId(user_id);
      const newEditor = await EditorRepository.registerEditor(user_id);
      adminUser.blog_ids.map((el)=>{
        EditorRepository.addBlogId(user_id,el);
      })
      await AdminRepository.deleteAdmin(user_id);
  } else if (user.role === "EDITOR" && newRole === "ADMIN"){
      const editorUser = await EditorRepository.getEditorByUserId(user_id);
      const newAdmin = await AdminRepository.registerAdmin(user_id);
      editorUser.blog_ids.map((el)=>{
        AdminRepository.addBlogId(user_id,el);
      })
      await EditorRepository.deleteEditor(user_id);
  }
  else if (newRole === "EDITOR" && user.role === "REGULAR") {
    const editorUser = await EditorRepository.getEditorByUserId(user_id);
    if(!editorUser){
    const adminUser = await AdminRepository.getAdminByUserId(user_id);
    await EditorRepository.registerEditor(user_id);
    if(adminUser){
      adminUser.blog_ids.map((el)=>{
        EditorRepository.addBlogId(user_id,el);
      })
      await AdminRepository.deleteAdmin(user_id);
    }
  }
  } else if (newRole === "ADMIN" && user.role === "REGULAR") {
    const adminUser = await AdminRepository.getAdminByUserId(user_id);
    if(!adminUser){
    const editorUser = await EditorRepository.getEditorByUserId(user_id);
    await AdminRepository.registerAdmin(user_id);
    if(editorUser){
      editorUser.blog_ids.map((el)=>{
        AdminRepository.addBlogId(user_id,el);
      })
      await EditorRepository.deleteEditor(user_id);
    }
  }
}
  const updatedUser = await UserRepository.updatedUserRole(user_id, newRole);

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
  const blogs = await BlogRepository.getAllBlogs();
  return blogs;
};
module.exports = {
  manageUserRole,
  manageUserSoc,
  searchBlogs,
  getAllBlogs,
};