const { default: mongoose } = require("mongoose");
const { isAuth, isCommentWriter } = require("./AuthMiddleware");
const BlogService = require("./../../services/BlogService");
const CommentService = require("./../../services/CommentService");
const router = require("express").Router();
const passport = require("passport");

// Comment Controllers /api/comment

// - /:articleId/addAComment POST
router.post(
  "/:blogId/addcomment",
  passport.authenticate("jwt", { session: false }),
  isAuth,
  async (req, res, next) => {
    try {
      const blogId = new mongoose.mongo.ObjectId(req.params.blogId);
      const updatedBlog = await BlogService.addAComment(
        req.user._id,
        blogId,
        req.body.content
      );
      res.json({ ...updatedBlog, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error: ${error}`, success: false });
    }
  }
);
// -/:blogId/:commentId/deleteAComment DELETE
router.delete(
  "/:blogId/:commentId/deletecomment",
  passport.authenticate("jwt", { session: false }),
  isCommentWriter,
  async (req, res, next) => {
    try {
      const blogId = new mongoose.mongo.ObjectId(req.params.blogId);
      const commentId = new mongoose.mongo.ObjectId(req.params.commentId);

      const updatedBlog = await BlogService.deleteAComment(blogId, commentId);
      res.json({ ...updatedBlog, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error: ${error}`, success: false });
    }
  }
);
// -/:commentId/upvoteAComment PUT
router.put(
  "/:commentId/upvote",
  passport.authenticate("jwt", { session: false }),
  isAuth,
  async (req, res, next) => {
    try {
      const commentId = new mongoose.mongo.ObjectId(req.params.commentId);
      const updatedComment = await CommentService.scoreAComment(
        commentId,
        req.user._id,
        1
      );
      res.json({ ...updatedComment, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error: ${error}`, success: false });
    }
  }
);

// -/:commentId/downvoteAComment PUT
router.put(
  "/:commentId/downvote",
  passport.authenticate("jwt", { session: false }),
  isAuth,
  async (req, res, next) => {
    try {
      const commentId = new mongoose.mongo.ObjectId(req.params.commentId);
      const updatedComment = await CommentService.scoreAComment(
        commentId,
        req.user._id,
        -1
      );
      res.json({ ...updatedComment, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error: ${error}`, success: false });
    }
  }
);

// -/:commentId/addAReply POST
router.post(
  "/:commentId/addreply",
  passport.authenticate("jwt", { session: false }),
  isAuth,
  async (req, res, next) => {
    try {
      const commentId = new mongoose.mongo.ObjectId(req.params.commentId);
      const updatedComment = await CommentService.addAReply(
        commentId,
        req.user._id,
        req.body.content
      );
      res.json({ ...updatedComment, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error: ${error}`, success: false });
    }
  }
);
// -/:deleted_replyId/deleteAReply DELETE
router.delete(
  "/:commentId/:replyid/deletereply",
  passport.authenticate("jwt", { session: false }),
  isAuth,
  async (req, res, next) => {
    try {
      const commentId = new mongoose.mongo.ObjectId(req.params.commentId);
      const updatedComment = await CommentService.deleteAReply(
        commentId,
        new mongoose.mongo.ObjectId(req.params.replyid)
      );
      res.json({ ...updatedComment, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error: ${error}`, success: false });
    }
  }
);

module.exports = router;
