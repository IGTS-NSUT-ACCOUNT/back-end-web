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

module.exports = router;
