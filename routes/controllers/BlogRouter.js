const { default: mongoose } = require("mongoose");
const BlogService = require("./../../services/BlogService");
const BlogRepository = require("./../../repositories/BlogRepository");
const { isAuth, isEditorOfTheBlog } = require("./AuthMiddleware");
const UserService = require("./../../services/UserService");
const EditorService = require("./../../services/EditorService");
const passport = require("passport");

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
    console.log(error);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

// -/getBlogsBySubTopic/:topic GET
router.get("/:subtopicId/getblogsbynew/:pgeNo", async (req, res, next) => {
  try {
    const subtopic_id = new mongoose.mongo.ObjectId(req.params.subtopicId);
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
    console.log(error);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

// -/:artistId/getBlogsByArtist GET
router.get("/:artistId/getblogsbyartist/:pgeNo", async (req, res, next) => {
  try {
    const artist_user_id =new mongoose.mongo.ObjectId(req.params.artistId);
    const blogLists = await BlogService.getBlogsByArtist(
      artist_user_id,
      Number(req.params.pgeNo)
    );
    res.json({ blogs: blogLists, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

const authenticateUser = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.user_id = null;
    } else {
      req.user_id = user._id;
    }
    next();
  })(req, res, next);
};

// - /:articleId/getComments GET
router.get("/:blogId/comments", authenticateUser, async (req, res, next) => {
  try {
    let user_id = req.user_id;
    const blogId = new mongoose.mongo.ObjectId(req.params.blogId);
    const comments = await BlogService.getComments(blogId, user_id);
    res.json({ comments: comments, success: true });
  } catch (error) {
    console.error(`Error getting comments: ${error}`);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

// - /:id/delete DELETE
router.delete(
  "/:blogId/delete",
  passport.authenticate("jwt", { session: false }),
  isEditorOfTheBlog,
  async (req, res, next) => {
    try {
      const blog_id = new mongoose.mongo.ObjectId(req.params.blogId);
      await EditorService.deleteBlog(req.user._id,req.user.role,blog_id);
      res.json({ success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error ${error}`, success: false });
    }
  }
);

// - /:id/edit  PUT
router.put(
  "/:blogId/edit",
  passport.authenticate("jwt", { session: false }),
  isEditorOfTheBlog,
  async (req, res, next) => {
    try {
      const updatedBlog = await EditorService.editBlog(req.body);
      res.json({ ...updatedBlog, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error ${error}`, success: false });
    }
  }
);

// - /:blogId/addtoReadingList PUT
router.put(
  "/:blogId/addtoreadinglist",
  passport.authenticate("jwt", { session: false }),
  isAuth,
  async (req, res, next) => {
    try {
      const user_id = mongoose.mongo.ObjectId(req.user.id);
      const blog_id = mongoose.mongo.ObjectId(req.params.blogId);

      const updatedUser = UserService.addBlogToReadingList(blog_id, user_id);
      res.json({ success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error ${error}`, success: false });
    }
  }
);

// - /:blogID/removeFromReadingList PUT
router.put(
  "/:blogId/removefromreadinglist",
  passport.authenticate("jwt", { session: false }),
  isAuth,
  async (req, res, next) => {
    try {
      const user_id = mongoose.mongo.ObjectId(req.user.id);
      const blog_id = mongoose.mongo.ObjectId(req.params.blogId);

      const updatedUser = UserService.removeBlogFromReadingLIst(
        blog_id,
        user_id
      );
      res.json({ success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error ${error}`, success: false });
    }
  }
);

// - /:blogId/addLike PUT
router.put(
  "/:blogId/addlike",
  passport.authenticate("jwt", { session: false }),
  isAuth,
  async (req, res, next) => {
    try {
      const blogId = new mongoose.mongo.ObjectId(req.params.blogId);
      const userId = req.user._id;
      const updatedBlog = await BlogService.addLike(blogId, userId);
      res.json({ ...updatedBlog, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error: ${error}`, success: false });
    }
  }
);

// - /:blogId/removeLike PUT
router.put(
  "/:blogId/removelike",
  passport.authenticate("jwt", { session: false }),
  isAuth,
  async (req, res, next) => {
    try {
      const blogId = new mongoose.mongo.ObjectId(req.params.blogId);
      const userId = req.user._id;
      const updatedBlog = BlogService.removeLike(blogId, userId);
      res.json({ ...updatedBlog, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error: ${error}`, success: false });
    }
  }
);

// - /:blogId GET
router.get("/:blogId", authenticateUser, async (req, res, next) => {
  try {
    let user_id = req.user_id;
    const blogId = new mongoose.mongo.ObjectId(req.params.blogId);
    const blog = await BlogService.getAblog(blogId, user_id);

    if (!blog.blog) {
      res.json({ message: "Blog private", success: false });
    } else res.json({ ...blog, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

// - /:blogId GET
router.get(
  "/:blogId/draft",
  passport.authenticate("jwt", { session: false }),
  isEditorOfTheBlog,
  async (req, res, next) => {
    try {
      const blogId = new mongoose.mongo.ObjectId(req.params.blogId);
      const blog = await BlogRepository.getABlogSilent(blogId);
      res.json({ ...blog, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error: ${error}`, success: false });
    }
  }
);

module.exports = router;
