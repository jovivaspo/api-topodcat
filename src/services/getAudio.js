const ytdl = require("ytdl-core");

const connection = require("../database");
const mongoose = require("mongoose");

const PodcastInfo = require("../models/PodcastInfo");
const User = require("../models/User");

const getAudio = async (video, socket) => {
  try {
    console.log("Vamos a convertir el video");
    const gridFsBucket = new mongoose.mongo.GridFSBucket(connection, {
      bucketName: "podcasts",
    });

    let uploadStream = gridFsBucket.openUploadStream(`${video.title}.mp3`);
    const idPodcast = uploadStream.id;

    const info = await ytdl.getInfo(video.id);
    const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
    let progress = 0;

    if (audioFormats.length === 0) {
      return socket.emit("error", "Error convirtiendo el archivo");
    }
    const contentLength = parseInt(audioFormats[0].contentLength);
    const audioStream = ytdl(video.link, {
      filter: "audioonly",
    })
      .on("progress", (bytes) => {
        progress += bytes / contentLength;
        socket.emit("converting_progress", progress.toFixed(2) * 100);
      })
      .pipe(uploadStream, { end: true })
      .on("error", () => {
        return socket.emit("error", "Error subiendo archivo  el archivo");
      })
      .on("finish", async () => {
        console.log("Archivo subido con éxito id:", idPodcast);
        const podcastInfo = new PodcastInfo({
          title: video.title,
          userId: socket.decoded.id,
          podcastId: idPodcast,
          img: video.thumbnail,
          duration: video.duration,
          date: new Date(),
        });
        const podcastInfoSaved = await podcastInfo.save();

        const user = await User.findById(socket.decoded.id);

        user.podcastsList = user.podcastsList.concat(podcastInfoSaved.id);

        const userSaved = await user.save();

        socket.emit("finish", "Video convertido con éxito");
      });
  } catch (error) {
    console.log(error);
    socket.emit("error", "Algo salió mal");
  }
};

module.exports = getAudio;
