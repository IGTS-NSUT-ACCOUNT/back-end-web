const { default: mongoose } = require("mongoose");
const UserService = require("../../services/UserService");
const { isAuth } = require("./AuthMiddleware");
const { validateLoginInput } = require("./../../validation/login");
const { issueJWT } = require("../../lib/utils");
const passport = require("passport");
const { validateRegisterInput } = require("../../validation/register");
const router = require("express").Router();

// User Controllers /api/user/

// -  /  GET
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  isAuth,
  async (req, res, next) => {
    try {
      const user_id = req.user._id;
      const user = await UserService.getUser(user_id);
      return res.json({ ...user, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error ${error}`, success: false });
    }
  }
);

// - /login POST

router.post("/login", async (req, res) => {
  try {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;

    const token = await UserService.loginUser(email, password);
    if (!token) {
      return res
        .status(404)
        .json({ success: false, message: "Email or password not valid" });
    } else {
      res.json({
        success: true,
        message: "Login Successfull",
        token: token.token,
        expiresIn: token.expires,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Error: " + error, success: false });
  }
});

router.post("/register", async (req, res) => {
  try {
    // Form validation

    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const registeredUser = await UserService.registerUser(req.body);

    if (registeredUser) {
      res.json({
        success: true,
        message: "Registration Successfull",
      });
    } else {
      res.json({ success: false, message: "Failed To Create" });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

// - /logout GET
router.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      // logout logic here
      req.logout(function (err) {
        if (err) {
          return next(err);
        }
        return res.json({ success: true });
      });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error ${error}`, success: false });
    }
  }
);

// - /editprofile PUT
router.put(
  "/editprofile",
  passport.authenticate("jwt", { session: false }),
  isAuth,
  async (req, res, next) => {
    try {
      const user_id = req.user._id;
      const updatedUser = await UserService.editUserProfile(user_id, req.body);
      res.json({ ...updatedUser, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error ${error}`, success: false });
    }
  }
);

// /editpassword
router.post(
  "/editpassword",
  passport.authenticate("jwt", { session: false }),
  isAuth,
  async (req, res, next) => {
    try {
      const user_id = req.user._id;
      const response = await UserService.editUserPass(
        user_id,
        req.body.old_pass,
        req.body.new_pass
      );

      if (response.success) {
        res.json({
          success: true,
          message: "Successfully updated password",
          old_pass: true,
        });
      } else {
        res.json({
          success: false,
          message: "Old password dont match",
          old_pass: false,
        });
      }
    } catch (error) {
      console.log(error);
      res.json({ message: `Error ${error}`, success: false });
    }
  }
);

// -/editprofilepicture PUT
router.put(
  "/editprofilepic",
  passport.authenticate("jwt", { session: false }),
  isAuth,
  async (req, res, next) => {
    try {
      // logic

      const fileStr = req.body.data;
      const user_id = req.user._id;
      const updatedUser = await UserService.editUserProfilePicture(
        user_id,
        fileStr
      );

      res.json({ pfp_url: updatedUser.pfp_url, success: true });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error ${error}`, success: false });
    }
  }
);

router.post(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const user_id = req.user._id;
      req.logout();
      await UserService.deleteUser(user_id);
      res.json({ message: `Account deleted Successfully`, success: false });
    } catch (error) {
      console.log(error);
      res.json({ message: `Error ${error}`, success: false });
    }
  }
);
module.exports = router;
