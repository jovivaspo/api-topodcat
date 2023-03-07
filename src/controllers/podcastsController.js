const mongoose = require("mongoose");
const User = require("../models/User");
const PodcastInfo = require("../models/PodcastInfo");

const podController = {};

const gridFsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection, {
  bucketName: "podcasts",
});

podController.getAllPodcasts = async (req, res, next) => {
  try {
    const podcasts = await gridFsBucket.find({}).toArray();
    return res.status(200).json(podcasts);
  } catch (err) {
    console.log(err);
    const error = new Error("Algo salió mal");
    next(error);
  }
};

podController.info = async (req, res, next) => {
  try {
    const info = await PodcastInfo.find();
    return res.status(200).json(info);
  } catch (err) {
    console.log(err);
    const error = new Error("Algo salió mal");
    next(error);
  }
};

podController.getAll = async (req, res, next) => {
  try {
    const uid = req.params.uid;

    const user = await User.findById(uid).populate("podcastsList");

    const list = user.podcastsList;

    res.status(200).json(list);
  } catch (err) {
    console.log(err);
    const error = new Error("No se pudo recuperar su lista");
    next(error);
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

//Esta es la que usa la app
podController.deletePodcastByIdInfo = async (req, res, next) => {
  try {
    const id = req.params.idPodInfo;
    const infoDeleted = await PodcastInfo.findByIdAndDelete(id);
    if (!infoDeleted) {
      const error = new Error("Error al eliminar...");
      return next(error);
    }
    const { uid, podcastId } = infoDeleted;
    if (!uid || !podcastId) {
      const error = new Error("Error al eliminar...");
      return next(error);
    }
    await gridFsBucket.delete(podcastId);

    const user = await User.findById(uid);
    user.podcastsList = user.podcastsList.filter((el) => el.toString() !== id);
    await user.save();
    return res.status(201).json({ message: "Podcast borrado" });
  } catch (err) {
    const error = new Error("Error al eliminar...");
    next(error);
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

    res.set("content-type", "audio/mp3");
    res.set("accept-ranges", "bytes");

    let downloadStream = gridFsBucket.openDownloadStream(id);

    downloadStream.on("error", (err) => {
      const error = new Error("Error al iniciar descarga");
      next(error);
    });

    downloadStream.pipe(res);
  } catch (err) {
    const error = new Error("Error al iniciar descarga");
    next(error);
  }
};

module.exports = podController;
