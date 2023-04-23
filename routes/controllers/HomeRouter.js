const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const { getHighlights } = require("../../services/HomeService");

router.get("/highlights", async (req, res) => {
  try {
    const highlights = await getHighlights();
    res.json({ highlights: highlights, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: `Error: ${error}`, success: false });
  }
});

module.exports = router;