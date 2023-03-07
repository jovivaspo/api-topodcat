const PodcastInfo = require("../models/PodcastInfo");
const User = require("../models/User");

const connection = require("../database");
const mongoose = require("mongoose");

const userController = {};

const gridFsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection, {
  bucketName: "podcasts",
});

userController.test = async (req, res, next) => {
  return res.status(200).json({ message: "Testeando" });
};

userController.getAll = async (req, res, next) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(200).json({ user: "No hay usuarios registrados" });
    }
    return res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

userController.getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      const error = new Error("Usuario no encontrado");
      return next(error);
    }
    return res.status(200).json({
      name: user.name,
      uid: user.id,
      email: user.email,
      podcastsList: user.podcastsList,
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

userController.deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
      res.status(404);
      const error = new Error("Usuario no encontrado");
      return next(error);
    }

    if (user.podcastsList.length > 0) {
      const listPodcasts = user.podcastsList;

      const podcastsId = await Promise.all(
        listPodcasts.map(async (id) => {
          return await PodcastInfo.findByIdAndDelete(id);
        })
      );

      const podcasts = await Promise.all(
        podcastsId.map(async (podcast) => {
          const _id = podcast.podcastId;
          return await gridFsBucket.delete(_id);
        })
      );
    }

    await User.findByIdAndDelete(id);

    return res.status(202).json({ message: "User deleted" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

userController.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const body = req.body;

    console.log(body);

    const user = await User.findByIdAndUpdate(id, body);

    if (!user) {
      res.status(404);
      const error = new Error("User not found");
      return next(error);
    }

    const userUpdated = await User.findById(id);

    return res.status(202).json({ message: "User updated", userUpdated });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = userController;
