const subtopicService = require("./../../services/SubtopicService");
const SubtopicRepository = require("./../../repositories/SubtopicRepository");
const { default: mongoose } = require("mongoose");
const UserService = require("../../services/UserService");
const { isAuth, isEditor } = require("./AuthMiddleware");

const router = require("express").Router();
const passport = require("passport");

// SubTopic Controllers /api/subtopic

// -/add POST
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  isEditor,
  async (req, res, next) => {
    try {
      const subtopic = await subtopicService.createANewSubtopic(
        req.body.subtopic_name
      );
      res.json({ ...subtopic, success: true });
    } catch (error) {}
  }
);

// - search=?query GET
router.get("/", async (req, res, next) => {
  try {
    const subtopicList = await subtopicService.getSubtopics(req.query.search);
    res.json({ subtopicList: subtopicList, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const subtopic = await SubtopicRepository.getSubtopicById(
      mongoose.mongo.ObjectId(req.params.id)
    );
    res.json({ ...subtopic, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

module.exports = router;
