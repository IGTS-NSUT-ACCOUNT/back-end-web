const EditorRepository = require("./../repositories/EditorRepository");
const BlogRepository = require("./../repositories/BlogRepository");

// Editor Service
// - publishBlog()
const publishBlog = async (editor_user_id, body) => {
  if (body.blog_id) {
    const blog = await BlogRepository.updateBlog({
      blog_id: body.blog_id,
      content: body.content,
      title: body.title,
      thumbnail: body.thumbnail,
      editor_user_id,
      status: true,
      subtopics: body.subtopics,
    });
    return blog;
  } else {
    const blog = await BlogRepository.addBlog({
      content: body.content,
      title: body.title,
      subtopics: subtopics,
      thumbnail: body.thumbnail,
      status: true,
      editor_user_id,
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
    const blog = await BlogRepository.updateBlog({
      blog_id: body.blog_id,
      content: body.content,
      title: body.title,
      thumbnail: body.thumbnail,
      editor_user_id,
      status: false,
      subtopics: body.subtopics,
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
    return blog;
  }
};

module.exports = {
  publishBlog,
  deleteBlog,
  editBlog,
  saveBlog,
};
