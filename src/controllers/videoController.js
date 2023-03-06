const youtube = require("scrape-youtube");

videoController = {};

videoController.searchVideos = async (req, res, next) => {
  try {
    const search = req.params.search;

    if (!search) {
      const error = new Error("Petición incorrecta");
      res.status(403);
      return next(error);
    }

    const results = await youtube.search(search);

    if (!results || results.length === 0) {
      const error = new Error("Error en la búsqueda...");
      res.status(500);
      return next(error);
    }

    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

module.exports = videoController;
