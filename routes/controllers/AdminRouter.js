const { default: mongoose } = require("mongoose");
const { isAdmin } = require("./AuthMiddleware");
const AdminService = require("./../../services/AdminService");
const passport = require("passport");
const { getUserByEmail } = require("../../repositories/UserRepository");

const router = require("express").Router();

router.put(
  "/updaterole",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req, res, next) => {
    try {
      const user_id = new mongoose.mongo.ObjectId(req.body.user_id);
      const newRole = req.body.new_role;
      const updatedUser = await AdminService.manageUserRole(user_id, newRole);
      res.json({ ...updatedUser, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error: ${error} `, success: false });
    }
  }
);

router.get(
  "/getallblogs",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req, res) => {
    try {
      const editor_user_id = req.user._id;
      const blogs = await AdminService.getAllBlogs();
      res.json({ blogs: blogs, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error: ${error}`, success: false });
    }
  }
);

router.get(
  "/searchblog",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req, res, next) => {
    try {
      const query = req.query.search;
      const result = await AdminService.searchBlogs(query);
      res.json({ blogs: result, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error: ${error}`, success: false });
    }
  }
);

router.get(
  "/searchuser",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req, res) => {
    try {
      const user = await getUserByEmail(req.query.search);
      res.json({ user: user, success: true });
    } catch (error) {
      res.json({ success: false, message: `Error: ${error}` });
    }
  }
);

module.exports = router;
