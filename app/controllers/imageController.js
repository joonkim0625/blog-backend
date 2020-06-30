const fs = require("fs");
const db = require("../models");
const Image = db.images;

exports.uploadFiles = (req, res) => {
  if (req.file === undefined) {
    return res.send("You must select a file");
  }

  Image.create({
    type: req.file.mimetype,
    name: req.file.originalname,
    data: fs.readFileSync(__basedir + "/images/" + req.file.filename),
  })
    .then((image) => {
      fs.writeFileSync(__basedir + "/tmp/" + image.name, image.data);
      res.send("File has been uploaded...");
    })
    .catch((e) => {
      console.log(e);
      res.send({
        message: e.message,
      });
    });
};
