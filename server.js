const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");
const Role = db.role;
const User = db.user;

const app = express();

var corsOption = {
  origin: "https://joonkim.herokuapp.com",
};

// middleware
app.use(cors(corsOption)); // you could possibly comment this line out

global.__basedir = __dirname;

// parsing requests of content-tpye that is application/json
app.use(bodyParser.json());
// parsing requests of content-tpye that is application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// route
app.get("/", (req, res) => {
  res.json({
    message: "Hello world from port 8080",
  });
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
}

// sync
db.sequelize.sync().then(() => {
  initial();
});

//db.sequelize.sync();

//routes
require("./app/routes/postRoutes")(app);
require("./app/routes/authRoutes")(app);
require("./app/routes/userRoutes")(app);
require("./app/routes/commentRoutes")(app);
require("./app/routes/uploadRouter")(app);

// setting port
//const PORT = process.env.PORT || 8080;
//app.listen(PORT, () => {
//console.log(`Server is running on port ${PORT}`);
//});

// creating a server
const server = app.listen(process.env.PORT || 8080, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log("App listening at http://%s:$s", host, port);
});
