const { default: mongoose } = require("mongoose");
const { isEditor } = require("./AuthMiddleware");
const BlogService = require("./../../services/BlogService");
const EditorService = require("./../../services/EditorService");
const passport = require("passport");

const router = require("express").Router();

router.post(
  "/publish",
  passport.authenticate("jwt", { session: false }),
  isEditor,
  async (req, res, next) => {
    try {
      const editor_user_id = req.user._id;
      const publishedBlog = await EditorService.publishBlog(
        editor_user_id,
        req.body
      );
      res.json({ ...publishedBlog, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error: ${error}`, success: false });
    }
  }
);

router.post(
  "/save",
  passport.authenticate("jwt", { session: false }),
  isEditor,
  async (req, res, next) => {
    try {
      const editor_user_id = req.user._id;
      const publishedBlog = await EditorService.saveBlog(
        editor_user_id,
        req.body
      );
      res.json({ ...publishedBlog, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error: ${error}`, success: false });
    }
  }
);

router.get(
  "/getallblogs",
  passport.authenticate("jwt", { session: false }),
  isEditor,
  async (req, res) => {
    try {
      const editor_user_id = req.user._id;
      const blogs = await EditorService.getAllBlogs(editor_user_id);
      res.json({ blogs: blogs, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error: ${error}`, success: false });
    }
  }
);

router.get(
  "/searchblog",
  passport.authenticate("jwt", { session: false,failWithError:true }),
  isEditor,
  async (req, res, next) => {
    try {
      const query = req.query.search;
      const editor_user_id = req.user._id;
      const result = await EditorService.searchBlogs(query, editor_user_id);
      res.json({ blogs: result, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error: ${error}`, success: false });
    }
  }
);

router.get("/:editor_user_id", async (req, res, next) => {
  try {
    const editor_user_id = new mongoose.mongo.ObjectId(
      req.params.editor_user_id
    );
    const editorCard = await EditorService.getEditorCard(editor_user_id);
    console.log(editorCard);
    res.json({ ...editorCard, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

module.exports = router;
