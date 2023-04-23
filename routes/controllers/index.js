const router = require("express").Router();
const adminRouter = require("./AdminRouter");
const blogRouter = require("./BlogRouter");
const commentRouter = require("./CommentRouter");
const editorRouter = require("./EditorRouter");
const subtopicRouter = require("./SubtopicRouter");
const userRouter = require("./UserRouter");
const homeRouter = require("./HomeRouter");

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/editor", editorRouter);
router.use("/blog", blogRouter);
router.use("/comment", commentRouter);
router.use("/subtopic", subtopicRouter);
router.use("/home", homeRouter);

module.exports = router;
