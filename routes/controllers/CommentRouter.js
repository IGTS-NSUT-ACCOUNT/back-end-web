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
  }
);
// -/:blogId/:commentId/deleteAComment DELETE
router.post(
  "/:blogId/:commentId/deletecomment",
  passport.authenticate("jwt", { session: false }),
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
router.post(
  "/:commentId/upvote",
  passport.authenticate("jwt", { session: false }),
  isAuth,
  async (req, res, next) => {
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
  }
);

// -/:commentId/downvoteAComment PUT
router.post(
  "/:commentId/downvote",
  passport.authenticate("jwt", { session: false }),
  isAuth,
  async (req, res, next) => {
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
  }
);

// -/:commentId/addAReply POST
router.post(
  "/:commentId/addreply",
  passport.authenticate("jwt", { session: false }),
  isAuth,
  async (req, res, next) => {
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
  }
);
// -/:deleted_replyId/deleteAReply DELETE
router.post(
  "/:commentId/:replyid/deletereply",
  passport.authenticate("jwt", { session: false }),
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
