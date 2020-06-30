const db = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

const Op = db.Sequelize.Op;
const User = db.user;
const Role = db.role;

exports.signup = (req, res) => {
  // save user data to DB
  const { username, email, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const bcryptPassword = bcrypt.hashSync(password, salt);

  User.create({
    username,
    email,
    password: bcryptPassword,
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({
              message:
                "Registered successfully!\nNow you are being moved login page.",

              roles: roles,
            });
          });
        });
      } else {
        //  user role = 1
        user.setRoles([1]).then(() => {
          res.send({
            message:
              "Registered successfully!\nNow you are being moved login page.",
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}; // signup

exports.signin = (req, res) => {
  const { username, password } = req.body;

  User.findOne({
    where: {
      username: username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found!" });
      }

      const passwordIsValid = bcrypt.compareSync(password, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid password!",
        });
      }

      const token = jwt.sign({ id: user.id }, process.env.jwtSecret, {
        expiresIn: "1h",
      });

      let authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        const { id, username, email } = user;
        res.status(200).send({
          id: id,
          username: username,
          email: email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
