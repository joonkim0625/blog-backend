module.exports = (app) => {
  const router = require("express").Router();

  const upload = require("../config/uploadConfig");
  const fileWorker = require("../controllers/uploadController");

  router.post("/images", upload.single("file"), fileWorker.upload);

  app.use("/api", router);
};
