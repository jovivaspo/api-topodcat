const mongoose = require("mongoose");
const connection = require("../database");
const User = require("../models/User");
const PodcastInfo = require("../models/PodcastInfo");

const podController = {};

const gridFsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection, {
  bucketName: "podcasts",
});

podController.getAllPodcasts = async (req, res, next) => {
  const podcasts = await gridFsBucket.find({}).toArray();
  return res.status(200).json(podcasts);
};

podController.info = async (req, res, next) => {
  const info = await PodcastInfo.find();
  return res.status(200).json(info);
};

podController.getAll = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).populate("podcastsList");

    const list = user.podcastsList;

    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

podController.getPodcast = async (req, res, next) => {
  try {
    const id = new mongoose.mongo.ObjectId(req.params.id);

    res.set("content-type", "audio/mp3");
    res.set("accept-ranges", "bytes");

    let downloadStream = gridFsBucket.openDownloadStream(id);

    //console.log(downloadStream);

    downloadStream.on("data", (chunk) => {
      res.write(chunk);
    });

    downloadStream.on("error", () => {
      const error = new Error("Error al enviar");
      next(error);
    });
    downloadStream.on("end", () => {
      res.end();
    });
  } catch (err) {
    next(err);
  }
};

podController.deletePodcastByIdInfo = async (req, res, next) => {
  try {
    const id = req.params.idPodInfo;
    const infoDeleted = await PodcastInfo.findByIdAndDelete(id);
    const { userId, podcastId } = infoDeleted;
    await gridFsBucket.delete(podcastId);

    const user = await User.findById(userId);
    user.podcastsList = user.podcastsList.filter((el) => el.toString() !== id);
    await user.save();
    return res.status(201).json({ message: "Podcast borrado" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

podController.deletePodcastById = async (req, res, next) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.params.idPod);
    await gridFsBucket.delete(_id);
    return res.status(202).json({ message: "podcast deleted" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

podController.downloadPodcasts = async (req, res, next) => {
  try {
    const id = new mongoose.mongo.ObjectId(req.params.id);

    console.log("Descargando: ", id);

    res.set("content-type", "audio/mp3");
    res.set("accept-ranges", "bytes");

    let downloadStream = gridFsBucket.openDownloadStream(id);

    downloadStream.pipe(res);
  } catch (err) {
    next(err);
  }
};

module.exports = podController;
