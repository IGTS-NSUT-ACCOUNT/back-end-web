const EditorRepository = require("./../repositories/EditorRepository");
const BlogRepository = require("./../repositories/BlogRepository");
const UserRepository = require("./../repositories/UserRepository");
const AdminRepository = require("./../repositories/AdminRepository");
const SubtopicRepository = require("./../repositories/SubtopicRepository");
// Editor Service
// - publishBlog()
const publishBlog = async (editor_user_id, body) => {
  if (body.blog_id) {
    const b = await BlogRepository.getABlogSilent(body.blog_id);
    b.subtopics.forEach(async (subtopic, i) => {
      await SubtopicRepository.removeBlogId(subtopic.subtopic_id, b._id);
    });

    const blog = await BlogRepository.updateBlog({
      blog_id: body.blog_id,
      content: body.content,
      title: body.title,
      thumbnail: body.thumbnail,
      editor_user_id,
      status: true,
      subtopics: body.subtopics,
    });

    console.log(body.subtopics);

    blog.subtopics.forEach(async (subtopic, i) => {
      await SubtopicRepository.addBlogId(subtopic.subtopic_id, blog._id);
    });

    return blog;
  } else {
    const blog = await BlogRepository.addBlog({
      content: body.content,
      title: body.title,
      subtopics: body.subtopics,
      thumbnail: body.thumbnail,
      status: true,
      editor_user_id,
    });

    const user = await UserRepository.getUserById(editor_user_id);
    if (user.role === "EDITOR")
      await EditorRepository.addBlogId(editor_user_id, blog._id);
    // else if (user.role === "ADMIN")
    //   await AdminRepository.addBlogId(editor_user_id, blog._id);

    blog.subtopics.forEach(async (subtopic, i) => {
      await SubtopicRepository.addBlogId(subtopic.subtopic_id, blog._id);
    });

    return blog;
  }
};

// - deleteBlog()
const deleteBlog = async (blog_id) => {
  await BlogRepository.deleteBlog(blog_id);
};

// - editBlog() -> use it to make blog public
const editBlog = async (body) => {
  const subtopics = body.subtopics;
  const blog = await BlogRepository.addBlog({
    content: body.content,
    title: body.title,
    subtopics: subtopics,
    thumbnail: body.thumbnail,
    status: body.public,
    editor_user_id,
  });
  return blog;
};

// - saveBlog()
const saveBlog = async (editor_user_id, body) => {
  const subtopics = body.subtopics;

  if (body.blog_id) {
    const b = await BlogRepository.getABlogSilent(body.blog_id);
    b.subtopics.forEach(async (subtopic, i) => {
      await SubtopicRepository.removeBlogId(subtopic.subtopic_id, b._id);
    });

    const blog = await BlogRepository.updateBlog({
      blog_id: body.blog_id,
      content: body.content,
      title: body.title,
      thumbnail: body.thumbnail,
      editor_user_id,
      status: false,
      subtopics: body.subtopics,
    });

    blog.subtopics.forEach(async (subtopic, i) => {
      await SubtopicRepository.addBlogId(subtopic.subtopic_id, blog._id);
    });

    return blog;
  } else {
    const blog = await BlogRepository.addBlog({
      content: body.content,
      title: body.title,
      subtopics: subtopics,
      thumbnail: body.thumbnail,
      status: false,
      editor_user_id,
    });

    const user = await UserRepository.getUserById(editor_user_id);
    if (user.role === "EDITOR")
      await EditorRepository.addBlogId(editor_user_id, blog._id);
    // else if (user.role === "ADMIN")
    //   await AdminRepository.addBlogId(editor_user_id, blog._id);

    blog.subtopics.forEach(async (subtopic, i) => {
      console.log(subtopic);
      await SubtopicRepository.addBlogId(subtopic.subtopic_id, blog._id);
    });

    return blog;
  }
};

const getEditorCard = async (editor_user_id) => {
  const user = await UserRepository.getUserById(editor_user_id);
  let blogs = [];
  // if (user.role === "ADMIN")
  //   blogs = (await AdminRepository.getAdminByUserId(editor_user_id)).blog_ids;
  if (user.role === "EDITOR")
    blogs = await EditorRepository.getBlogIds(editor_user_id);
  const pfp_url = user.pfp_url;
  const name = user.name;
  return {
    name,
    pfp_url,
    blogs,
  };
};

module.exports = {
  publishBlog,
  deleteBlog,
  editBlog,
  saveBlog,
  getEditorCard,
};
