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
    await Promise.all(
      b.subtopics.map(async (subtopic) => {
        await SubtopicRepository.removeBlogId(subtopic.subtopic_id, b._id);
      })
    );

    await Promise.all(
      b.subtopics.map(async (subtopic) => {
        await SubtopicRepository.DeleteSubtopicIfNull(subtopic.subtopic_id);
      })
    );

    const blog = await BlogRepository.updateBlog({
      blog_id: body.blog_id,
      content: body.content,
      title: body.title,
      thumbnail: body.thumbnail,
      editor_user_id,
      status: true,
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
      subtopics: body.subtopics,
      thumbnail: body.thumbnail,
      status: true,
      editor_user_id,
    });

    const user = await UserRepository.getUserById(editor_user_id);
    if (user.role === "EDITOR")
      await EditorRepository.addBlogId(editor_user_id, blog._id);
    else if (user.role === "ADMIN")
      await AdminRepository.addBlogId(editor_user_id, blog._id);

    blog.subtopics.forEach(async (subtopic, i) => {
      await SubtopicRepository.addBlogId(subtopic.subtopic_id, blog._id);
    });

    return blog;
  }
};

// - deleteBlog()
const deleteBlog = async (editor_user_id, role, blog_id) => {

  // delte blog id from editor
  if (role === 'EDITOR') {
    await EditorRepository.deleteBlog(editor_user_id, blog_id);
  } else if (role === 'ADMIN') {
    await AdminRepository.deleteBlog(editor_user_id, blog_id);
  }

  const b = await BlogRepository.getABlogSilent(blog_id);
    await Promise.all(
      b.subtopics.map(async (subtopic) => {
        await SubtopicRepository.removeBlogId(subtopic.subtopic_id, b._id);
      })
    );

    await Promise.all(
      b.subtopics.map(async (subtopic) => {
        await SubtopicRepository.DeleteSubtopicIfNull(subtopic.subtopic_id);
      })
    );

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
    else if (user.role === "ADMIN")
      await AdminRepository.addBlogId(editor_user_id, blog._id);

    blog.subtopics.forEach(async (subtopic, i) => {
      await SubtopicRepository.addBlogId(subtopic.subtopic_id, blog._id);
    });

    return blog;
  }
};

const getEditorCard = async (editor_user_id) => {
  const user = await UserRepository.getUserById(editor_user_id);
  let blogs = [];
  if(user){
  if (user.role === "ADMIN")
    blogs = (await AdminRepository.getAdminByUserId(editor_user_id)).blog_ids;
  if (user.role === "EDITOR")
    blogs = await EditorRepository.getBlogIds(editor_user_id);
  const pfp_url = user.pfp_url;
  const name = user.name;
  return {
    name,
    pfp_url,
    blogs,
  };
}
else{
  return{
    name:"Deleted User",
    pfp_url:"https://media.gettyimages.com/id/1389019209/vector/ghost-doodle-5.jpg?s=612x612&w=gi&k=20&c=rIEN506sx3wa05ezS4BEGmbXwrU1gQJYSDv_NdjeEjg=",
    blogs:[]
  }
}
};

const getAllBlogs = async (editor_user_id) => {
  const user = await UserRepository.getUserById(editor_user_id);
  if (user.role === "EDITOR") {
    const blog_ids = await EditorRepository.getBlogIds(editor_user_id);
    const result = await generateResultFromBlogIds(blog_ids);
    return result;
  } else if (user.role === "ADMIN") {
    const blog_ids = await AdminRepository.getBlogIds(editor_user_id);
    const result = await generateResultFromBlogIds(blog_ids);
    return result;
  }
};

const generateResultFromBlogIds = async (blog_ids) => {
  console.log(blog_ids);
  let result = await Promise.all(
    blog_ids.map(async (el, i) => {


      var blog = await BlogRepository.getABlogSilent(el);

      if (blog)
        return {
          title: blog.title,
          content: blog.content,
          thumbnail: blog.thumbnail,
          subtopics: blog.subtopics,
          blog_id: blog._id,
          editor_user_id: blog.editor_user_id,
          public: blog.public
        };
    })
  );

  result = result.filter((el) => el != null)

  return result;
}


const searchBlogs = async (query, editor_user_id) => {
  const blogs = await BlogRepository.searchBlogsByTitle(query, 0, 5000);
  const result = blogs.filter((el) => el.editor_user_id.equals(editor_user_id));
  return result;
};

module.exports = {
  publishBlog,
  deleteBlog,
  editBlog,
  saveBlog,
  getEditorCard,
  getAllBlogs,
  searchBlogs,
};