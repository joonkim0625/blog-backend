const fs = require("fs");

const db = require("../models");
const Image = db.images;

// Upload a Multipart-File then saving it to postgresql database
exports.upload = (req, res) => {
  Image.create({
    type: req.file.mimetype,
    name: req.file.originalname,
    data: fs.readFileSync(__basedir + "/images/" + req.file.filename),
  }).then((image) => {
    try {
      fs.writeFileSync(__basedir + "/tmp/" + image.name, image.data);

      // exit node.js app
      res.json({ msg: "File uploaded successfully!", file: req.file });
      // or
      //res.send("file uploaded!")
    } catch (e) {
      console.log(e);
      res.json({ err: e });
      // or
      res.send(`could not upload file due to ${error}`);
    }
  });
};
