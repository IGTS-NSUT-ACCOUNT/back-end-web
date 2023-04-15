const { default: mongoose } = require("mongoose");
const { isAdmin } = require("./AuthMiddleware");
const AdminService = require("./../../services/AdminService");
const passport = require("passport");

const router = require("express").Router();

router.put(
  "/updaterole",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req, res, next) => {
    try {
      const user_id = mongoose.mongo.ObjectId(req.body.user_id);
      const newRole = req.body.new_role;
      const updatedUser = await AdminService.manageUserRole(user_id, newRole);
      res.json({ ...updatedUser, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error: ${error} `, success: false });
    }
  }
);

module.exports = router;
