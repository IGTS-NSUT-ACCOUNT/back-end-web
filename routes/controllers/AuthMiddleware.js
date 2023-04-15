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
  if (
    req.isAuthenticated() &&
    (await getUserById(mongoose.mongo.ObjectId(req.user))).role === "ADMIN"
  ) {
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
    ((await getUserById(mongoose.mongo.ObjectId(req.user))).role === "EDITOR" ||
      (await getUserById(mongoose.mongo.ObjectId(req.user))).role === "ADMIN")
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
      (await getUserById(mongoose.mongo.ObjectId(req.user))).role === "ADMIN")
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
      (await getUserById(mongoose.mongo.ObjectId(req.user))).role === "ADMIN")
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
