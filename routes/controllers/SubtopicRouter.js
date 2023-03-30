const subtopicService = require("./../../services/SubtopicService");
const { default: mongoose } = require("mongoose");
const UserService = require("../../services/UserService");
const { isAuth, isEditor } = require("./AuthMiddleware");

const router = require("express").Router();

// SubTopic Controllers /api/subtopic

// -/add POST
router.post("/add", isEditor, async (req, res, next) => {
  try {
    const subtopic = await subtopicService.createANewSubtopic(
      req.body.subtopic_name
    );
    res.json({ ...subtopic, success: true });
  } catch (error) {}
});

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

module.exports = router;
