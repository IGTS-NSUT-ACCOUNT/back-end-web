const Blog = require("./../models/blog/Blog");

// Blogs Repository
// - add a blog
const addBlog = async ({
  content,
  thumbnail,
  title,
  subtopics,
  status,
  editor_user_id,
}) => {
  const blog = new Blog({
    content,
    thumbnail,
    title,
    subtopics,
    public: status,
    editor_user_id,
  });
  const savedBlog = await blog.save();
  return savedBlog;
};
// - getAblog
const getABlog = async (blog_id) => {
  // add view
  const blog = await Blog.findById(blog_id);
  blog.views += 1;
  const savedBlog = await blog.save();
  return savedBlog;
};
// - getAllBlogs
const getBlogs = async (pge_no, limit) => {
  const blogs = await Blog.find()
    .skip(pge_no * limit)
    .limit(limit);
  return blogs;
};
//  - serachBlogs || search by title
const searchBlogsByTitle = async (query, pge_no, limit) => {
  let results = await Blog.aggregate([
    {
      $search: {
        compound: {
          should: [
            {
              autocomplete: {
                query: query,
                path: "title",
              },
            },
          ],
        },
      },
    },
    { $skip: pge_no * limit },
    { $limit: limit },
  ]);
  return results;
};

// - getBlogsByNew
const getBlogsByNew = async (pge_no, limit) => {
  const blogs = await Blog.find()
    .sort({ createdAt: -1 })
    .skip(pge_no * limit)
    .limit(limit);
  return blogs;
};

//  - getBlogsByPopular
const getBlogsByPopular = async (pge_no, limit) => {
  const blogs = await Blog.find()
    .sort({ views: 1 })
    .skip(pge_no * limit)
    .limit(limit);
  return blogs;
};
// - updateBlog
const updateBlog = async ({
  blog_id,
  content,
  thumbnail,
  title,
  subtopics,
  status,
  editor_user_id,
}) => {
  const blog = await getABlogSilent(blog_id);
  blog = {
    ...blog,
    content,
    thumbnail,
    title,
    subtopics,
    status,
    editor_user_id,
  };
  const savedBlog = await blog.save();
  return savedBlog;
};
const getABlogSilent = async (blog_id) => {
  const blog = await Blog.findById(blog_id);
  return blog;
};
// - addCommentToBlog
const addCommentToBlog = async (blog_id, comment_id) => {
  const blog = await getABlogSilent(blog_id);
  blog.comments.push(comment_id);
  const updatedBlog = await blog.save();
  return updatedBlog;
};
// - removeCommentFromBlog
const removeCommentFromBlog = async (blog_id, comment_id) => {
  const blog = await getABlogSilent(blog_id);
  blog.comments = blog.comments.filter((x) => !x.equals(comment_id));
  const updatedBlog = await blog.save();
  return updatedBlog;
};

// - addLike
const addLike = async (blog_id, user_id) => {
  const blog = await getABlogSilent(blog_id);

  if (!blog.liked_by.has(user_id)) {
    blog.likes++;
    blog.liked_by.add(user_id);
  }

  const updatedBlog = await blog.save();
  return updatedBlog;
};
// - removeLike
const removeLike = async (blog_id, user_id) => {
  const blog = await getABlogSilent(blog_id);

  if (blog.liked_by.has(user_id)) {
    blog.likes--;
    blog.liked_by.delete(user_id);
  }

  const updatedBlog = await blog.save();
  return updatedBlog;
};

const deleteBlog = async (blog_id) => {
  await Blog.findByIdAndDelete(blog_id);
};

module.exports = {
  addBlog,
  getABlog,
  getBlogs,
  getABlogSilent,
  getBlogsByNew,
  getBlogsByPopular,
  searchBlogsByTitle,
  updateBlog,
  addCommentToBlog,
  removeCommentFromBlog,
  addLike,
  removeLike,
  deleteBlog,
};
