const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");
const Role = db.role;
const User = db.user;

const app = express();

var corsOption = {
  origin: "http://localhost:8081",
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

function run() {
  User.create({
    username: "Joon Kim",
    email: "joonkim0625@gmail.com",
    password: "$2b$10$lgrYkR577L0kGXBGiz4ufeQHhFr1ZjxbgN1VGQ6Q0ezGtuY9CuYUy",
  }).then((user) => {
    //  user role = 1
    user.setRoles([3]).then(() => {});
  });
}

// sync
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and resync the DB");
  initial();
  run();
});

//db.sequelize.sync();

//routes
require("./app/routes/postRoutes")(app);
require("./app/routes/authRoutes")(app);
require("./app/routes/userRoutes")(app);
require("./app/routes/commentRoutes")(app);
require("./app/routes/uploadRouter")(app);

// setting port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
