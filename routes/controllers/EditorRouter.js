const { default: mongoose } = require("mongoose");
const { isEditor } = require("./AuthMiddleware");
const BlogService = require("./../../services/BlogService");
const EditorService = require("./../../services/EditorService");

const router = require("express").Router();

router.post("/publish", isEditor, async (req, res, next) => {
  try {
    const editor_user_id = mongoose.mongo.ObjectId(req.user.id);
    const publishedBlog = await EditorService.publishBlog(
      editor_user_id,
      req.body
    );
    res.json({ ...publishedBlog, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

router.post("/save", isEditor, async (req, res, next) => {
  try {
    const editor_user_id = mongoose.mongo.ObjectId(req.user.id);
    const publishedBlog = await EditorService.saveBlog(
      editor_user_id,
      req.body
    );
    res.json({ ...publishedBlog, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

module.exports = router;
