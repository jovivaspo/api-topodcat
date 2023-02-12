const podController = require("../controllers/podcastsController");
const { Router } = require("express");
const protect = require("../middleware/protect");

const podRouter = Router();

podRouter.get("/", podController.getAllPodcasts);

podRouter.get("/single/:id", podController.getPodcast);

podRouter.get("/download/:id", podController.downloadPodcasts);

podRouter.delete(
  "/delete/info/:idPodInfo",
  podController.deletePodcastByIdInfo
);

podRouter.delete("/delete/pod/:idPod", podController.deletePodcastById);

podRouter.get("/all/:userId", podController.getAll);

podRouter.get("/info", podController.info);

module.exports = podRouter;
