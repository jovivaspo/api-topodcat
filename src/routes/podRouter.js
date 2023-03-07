const podController = require("../controllers/podcastsController");
const { Router } = require("express");
const checkJWT = require("../middleware/check-jwt");
const checkAdmin = require("../middleware/checkAdmin");

const podRouter = Router();

podRouter.get("/", checkJWT, checkAdmin, podController.getAllPodcasts);

podRouter.get("/info", checkJWT, checkAdmin, podController.info);

podRouter.get("/all/:uid", checkJWT, podController.getAll);

podRouter.get("/single/:id", podController.getPodcast);

podRouter.get("/download/:id", checkJWT, podController.downloadPodcasts);

podRouter.delete(
  "/delete/info/:idPodInfo",
  checkJWT,
  podController.deletePodcastByIdInfo
);

podRouter.delete(
  "/delete/pod/:idPod",
  checkJWT,
  podController.deletePodcastById
);

module.exports = podRouter;
