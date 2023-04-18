const { default: mongoose } = require("mongoose");
const CommentService = require("./../../services/CommentService");
const BlogService = require("./../../repositories/BlogRepository");
const { getUserById } = require("../../repositories/UserRepository");

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
const isAdmin = async (req, res, next) => {
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
const isEditor = async (req, res, next) => {
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
  console.log("hh");
  let blog_id = req.params.blogId;
  if (!blog_id) blog_id = new mongoose.mongo.ObjectId(req.body.blog_id);
  let blog = await BlogService.getABlogSilent(blog_id);
  console.log(blog.editor_user_id.equals(req.user._id));
  if (
    req.isAuthenticated() &&
    (blog.editor_user_id.equals(req.user._id) || req.user.role === "ADMIN")
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
