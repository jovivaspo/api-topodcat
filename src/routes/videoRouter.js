const { Router } = require("express");
const videoController = require("../controllers/videoController");

const router = Router();

router.get("/:search", videoController.searchVideos);

module.exports = router;
