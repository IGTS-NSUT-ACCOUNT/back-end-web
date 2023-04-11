const { default: mongoose } = require("mongoose");
const BlogService = require("./../../services/BlogService");
const BlogRepository = require("./../../repositories/BlogRepository");
const { isAuth, isEditorOfTheBlog } = require("./AuthMiddleware");
const UserService = require("./../../services/UserService");
const EditorService = require("./../../services/EditorService");

const router = require("express").Router();

// Blog Controllers /api/blog

// -/getAllBlogs GET
router.get("/getallblogs/:pgeno", async (req, res, next) => {
  try {
    const blogLists = await BlogService.getAllBlogs(Number(req.params.pgeno));
    res.json({ blogs: blogLists, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

// -/serachBlogs/search=? GET
router.get("/searchblogs/:pgeno", async (req, res, next) => {
  try {
    const query = req.query.search;
    const blogLists = await BlogService.searchBlog(
      query,
      Number(req.params.pgeno)
    );
    res.json({ blogs: blogLists, success: true });
  } catch (error) {
    console.log(errror);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

// -/getBlogsBySubTopic/:topic GET
router.get("/:subtopicId/getblogsbynew/:pgeNo", async (req, res, next) => {
  try {
    const subtopic_id = mongoose.mongo.ObjectId(subtopic_id);
    const blogLists = await BlogService.getBlogsBySubTopic(
      Number(req.params.pgeNo),
      subtopic_id
    );
    res.json({ blogs: blogLists, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

// -/getBlogsByNew GET
router.get("/getblogsbynew/:pgeNo", async (req, res, next) => {
  try {
    const blogLists = await BlogService.getBlogsByNew(Number(req.params.pgeNo));
    res.json({ blogs: blogLists, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error: ${error}`, success: false });
  }
});
// -/getBlogsByPopular GET
router.get("/getblogsbypopular/:pgeNo", async (req, res, next) => {
  try {
    const blogLists = await BlogService.getBlogsByPopular(
      Number(req.params.pgeNo)
    );
    res.json({ blogs: blogLists, success: true });
  } catch (error) {
    console.log(errror);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

// -/:artistId/getBlogsByArtist GET
router.get("/:artistId/getblogsbyartist/:pgeNo", async (req, res, next) => {
  try {
    const artist_user_id = mongoose.mongo.ObjectId(req.params.artistId);
    const blogLists = await BlogService.getBlogsByArtist(
      artist_user_id,
      Number(req.params.pgeNo)
    );
    res.json({ blogs: blogLists, success: true });
  } catch (error) {
    console.log(errror);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

// - /:articleId/getComments GET
router.get("/:blogId/comments", async (req, res, next) => {
  try {
    const blogId = mongoose.mongo.ObjectId(req.params.blogId);
    const comments = BlogService.getComments(blogId);
    res.json({ comments: comments, success: true });
  } catch (error) {
    console.log(errror);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

// - /:id/delete DELETE
router.delete("/:blogId/delete", isEditorOfTheBlog, async (req, res, next) => {
  try {
    const blog_id = mongoose.mongo.ObjectId(req.params.blogId);
    await EditorService.deleteBlog(blog_id);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error ${error}`, success: false });
  }
});

// - /:id/edit  PUT
router.put("/:blogId/edit", isEditorOfTheBlog, async (req, res, next) => {
  try {
    const updatedBlog = await EditorService.editBlog(req.body);
    res.json({ ...updatedBlog, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error ${error}`, success: false });
  }
});

// - /:blogId/addtoReadingList PUT
router.put("/:blogId/addtoreadinglist", isAuth, async (req, res, next) => {
  try {
    const user_id = mongoose.mongo.ObjectId(req.user.id);
    const blog_id = mongoose.mongo.ObjectId(req.params.blogId);

    const updatedUser = UserService.addBlogToReadingList(blog_id, user_id);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error ${error}`, success: false });
  }
});

// - /:blogID/removeFromReadingList PUT
router.put("/:blogId/removefromreadinglist", isAuth, async (req, res, next) => {
  try {
    const user_id = mongoose.mongo.ObjectId(req.user.id);
    const blog_id = mongoose.mongo.ObjectId(req.params.blogId);

    const updatedUser = UserService.removeBlogFromReadingLIst(blog_id, user_id);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error ${error}`, success: false });
  }
});

// - /:blogId/addLike PUT
router.put("/:blogId/addlike", isAuth, async (req, res, next) => {
  try {
    const blogId = mongoose.mongo.ObjectId(req.params.blogId);
    const userId = mongoose.mongo.ObjectId(req.user.id);
    const updatedBlog = await BlogService.addLike(blog_id, user_id);
    res.json({ ...updatedBlog, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

// - /:blogId/removeLike PUT
router.put("/:blogId/removelike", isAuth, async (req, res, next) => {
  try {
    const blogId = mongoose.mongo.ObjectId(req.params.blogId);
    const userId = mongoose.mongo.ObjectId(req.user.id);
    const updatedBlog = BlogService.removeLike(blogId, userId);
    res.json({ ...blog, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

// - /:blogId GET
router.get("/:blogId", async (req, res, next) => {
  try {
    const blogId = mongoose.mongo.ObjectId(req.params.blogId);
    const blog = await BlogRepository.getABlog(blogId);
    res.json({ ...blog, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

module.exports = router;
