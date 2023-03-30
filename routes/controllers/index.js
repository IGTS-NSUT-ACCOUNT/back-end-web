const router = require("express").Router();
const adminRouter = require("./AdminRouter");
const blogRouter = require("./BlogRouter");
const commentRouter = require("./CommentRouter");
const editorRouter = require("./EditorRouter");
const subtopicRouter = require("./SubtopicRouter");
const userRouter = require("./UserRouter");

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/editor", editorRouter);
router.use("/blog", blogRouter);
router.use("/comment", commentRouter);
router.use("/subtopic", subtopicRouter);

module.exports = router;
