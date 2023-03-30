const { default: mongoose } = require("mongoose");
const { isAuth, isCommentWriter } = require("./AuthMiddleware");
const BlogService = require("./../../services/BlogService");
const CommentService = require("./../../services/CommentService");
const router = require("express").Router();

// Comment Controllers /api/comment

// - /:articleId/addAComment POST
router.post("/:blogId/addcomment", isAuth, async (req, res, next) => {
  try {
    const blogId = mongoose.mongo.ObjectId(req.params.blogId);
    const updatedBlog = await BlogService.addAComment(
      mongoose.mongo.ObjectId(req.user.id),
      blogId,
      req.body.content
    );
    res.json({ ...updatedBlog, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error: ${error}`, success: false });
  }
});
// -/:blogId/:commentId/deleteAComment DELETE
router.post(
  "/:blogId/:commentId/deletecomment",
  isCommentWriter,
  async (req, res, next) => {
    try {
      const blogId = mongoose.mongo.ObjectId(req.params.blogId);
      const commentId = mongoose.mongo.ObjectId(req.params.commentId);

      const updatedBlog = await BlogService.deleteAComment(blogId, commentId);
      res.json({ ...updatedBlog, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error: ${error}`, success: false });
    }
  }
);
// -/:commentId/upvoteAComment PUT
router.post("/:commentId/upvote", isAuth, async (req, res, next) => {
  try {
    const commentId = mongoose.mongo.ObjectId(req.params.commentId);
    const updatedComment = await CommentService.scoreAComment(
      commentId,
      mongoose.mongo.ObjectId(req.user.id),
      1
    );
    res.json({ ...updatedComment, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

// -/:commentId/downvoteAComment PUT
router.post("/:commentId/downvote", isAuth, async (req, res, next) => {
  try {
    const commentId = mongoose.mongo.ObjectId(req.params.commentId);
    const updatedComment = await CommentService.scoreAComment(
      commentId,
      mongoose.mongo.ObjectId(req.user.id),
      -1
    );
    res.json({ ...updatedComment, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

// -/:commentId/addAReply POST
router.post("/:commentId/addreply", isAuth, async (req, res, next) => {
  try {
    const commentId = mongoose.mongo.ObjectId(req.params.commentId);
    const updatedComment = await CommentService.addAReply(
      commentId,
      mongoose.mongo.ObjectId(req.user.id),
      req.body.content
    );
    res.json({ ...updatedComment, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error: ${error}`, success: false });
  }
});
// -/:deleted_replyId/deleteAReply DELETE
router.post(
  "/:commentId/:replyid/deletereply",
  isAuth,
  async (req, res, next) => {
    try {
      const commentId = mongoose.mongo.ObjectId(req.params.commentId);
      const updatedComment = await CommentService.deleteAReply(
        commentId,
        mongoose.mongo.ObjectId(req.params.replyid)
      );
      res.json({ ...updatedComment, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error: ${error}`, success: false });
    }
  }
);

module.exports = router;
