const { default: mongoose } = require("mongoose");
const CommentService = require("./../../services/CommentService");
const BlogService = require("./../../repositories/BlogRepository");

// AuthMiddleware -
//   IsAuth -
const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({
      message: "You are not authorized to view this resource",
      success: false,
    });
  }
};
//   IsAdmin -
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "ADMIN") {
    next();
  } else {
    res.status(401).json({
      message: "You are not authorized to view this resource",
      success: false,
    });
  }
};

//   IsEditor -
const isEditor = (req, res, next) => {
  if (
    req.isAuthenticated() &&
    (req.user.role === "EDITOR" || req.user.role === "ADMIN")
  ) {
    next();
  } else {
    res.status(401).json({
      message: "You are not authorized to view this resource",
      success: false,
    });
  }
};

//   IsCommentWriter -
const isCommentWriter = async (req, res, next) => {
  if (
    req.isAuthenticated() &&
    ((await CommentService.getAComment())._id.equals(
      mongoose.mongo.ObjectId(req.body.comment_id)
    ) ||
      req.user.role === "ADMIN")
  ) {
    next();
  } else {
    res.status(401).json({
      message: "You are not authorized to view this resource",
      success: false,
    });
  }
};

//   isEditorOfTheBlog;
const isEditorOfTheBlog = async (req, res, next) => {
  if (
    req.isAuthenticated() &&
    ((await BlogService.getABlogSilent(
      mongoose.mongo.ObjectId(req.body.blog_id)
    )) ||
      req.user.role === "ADMIN")
  ) {
    next();
  } else {
    res.status(401).json({
      message: "You are not authorized to view this resource",
      success: false,
    });
  }
};

module.exports = {
  isAuth,
  isAdmin,
  isEditor,
  isCommentWriter,
  isEditorOfTheBlog,
};
