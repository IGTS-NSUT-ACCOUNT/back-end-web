const Editor = require("./../models/user/Editor");

// Editor Repository

// - registerEditor()
const registerEditor = async (user_id) => {
  const editor = new Editor({ user_id });
  const savedEditor = await editor.save();
  return savedEditor;
};

const getEditorByUserId = async (user_id) => {
  const editor = await Editor.findOne({ user_id: user_id });
  return editor;
};

const getEditorById = async (editor_id) => {
  const editor = await Editor.findById(eidtor_id);
  return editor;
};

// - addBlogId()
const addBlogId = async (user_id, blog_id) => {
  const editor = await getEditorByUserId(user_id);
  editor.blog_ids.push(blog_id);
  const updatedEditor = await editor.save();
  return updatedEditor;
};

// - removeBlogId()
const removeBlogId = async (user_id, blog_id) => {
  const editor = await getEditorById(user_id);
  editor.blog_ids = editor.blog_ids.filter((x) => !x.equals(blog_id));
  const updatedEditor = await editor.save();
  return updatedEditor;
};

// - getBlogIds()
const getBlogIds = async (user_id) => {
  const editor = await getEditorById(user_id);
  return editor.blog_ids;
};

const deleteEditor = async (user_id) => {
  await Editor.findOneAndDelete({ user_id: user_id });
};

module.exports = {
  registerEditor,
  getEditorByUserId,
  getEditorById,
  addBlogId,
  removeBlogId,
  getBlogIds,
  deleteEditor,
};
