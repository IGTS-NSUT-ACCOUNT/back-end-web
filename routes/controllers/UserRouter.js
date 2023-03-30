const { default: mongoose } = require("mongoose");
const UserService = require("../../services/UserService");
const { isAuth } = require("./AuthMiddleware");

const router = require("express").Router();

// User Controllers /api/user/

// -  /  GET
router.get("/", isAuth, async (req, res, next) => {
  try {
    const user_id = mongoose.mongo.ObjectId(req.user.id);
    const user = await UserService.getUser(user_id);
    return res.json({ ...user, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error ${error}`, success: false });
  }
});

// - /login POST
router.post("/login", async (req, res, next) => {
  try {
    // login logic

    return res.json({ ...user, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error ${error}`, success: false });
  }
});

// - /register POST
router.post("/register", async (req, res, next) => {
  try {
    // register logic

    return res.json({ ...user, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error ${error}`, success: false });
  }
});

// - /logout POST
router.post("/logout", async (req, res, next) => {
  try {
    // logout logic
    return res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error ${error}`, success: false });
  }
});

// - /editprofile PUT
router.put("/editprofile", isAuth, async (req, res, next) => {
  try {
    const user_id = mongoose.mongo.ObjectId(req.user.id);
    const updatedUser = await UserService.editUserProfile(user_id, req.body);
    res.json({ ...updatedUser, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error ${error}`, success: false });
  }
});

// -/editprofilepicture PUT
router.put("/editprofilepic", isAuth, async (req, res, next) => {
  try {
    // logic
    res.json({ pfp_url: "", success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error ${error}`, success: false });
  }
});

module.exports = router;
