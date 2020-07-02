require("dotenv").config();

const Sequelize = require("sequelize");
//const sequelize = new Sequelize(
//process.env.DB_DEV_DATABASE,
//process.env.DB_DEV_USER,
//process.env.DB_DEV_PASSWORD,
//{
//host: process.env.DB_DEV_HOST,
//dialect: process.env.DIALECT,
//operatorsAliases: false,

//pool: {
//max: +process.env.MAX,
//min: +process.env.MIN,
//acquire: +process.env.ACQUIRE,
//idle: +process.env.IDLE,
//},
//}
//);

const sequelize = new Sequelize(
  "deufl768fb3i3u",
  "wanekzmadaokri",
  "08d510398645623b06e91307d0b3c924285caf2ff5b521aefd848ce69255f6d6",
  {
    host: "ec2-35-172-73-125.compute-1.amazonaws.com",
    dialect: "postgres",
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.post = require("./postModel")(sequelize, Sequelize);
db.comments = require("./commentModel")(sequelize, Sequelize);
db.user = require("./userModel")(sequelize, Sequelize);
db.role = require("./roleModel")(sequelize, Sequelize);
//db.mypost = require("./myPostModel")(sequelize, Sequelize);
//db.mypostcomments = require("./myPostCommentModel")(sequelize, Sequelize);
db.images = require("./imageModel")(sequelize, Sequelize);

// ============================
db.post.hasMany(db.comments, {
  onDelete: "CASCADE",
  hooks: true,
});

db.comments.belongsTo(db.post, {
  foreignKeyConstraint: true,
  foreignKey: "postId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

// self-reference relation for comments
db.comments.hasMany(db.comments, {
  foreignKey: "parentId",
  onDelete: "CASCADE",
  hooks: true,
});
db.comments.belongsTo(db.comments, {
  as: "parent",
  foreignKeyConstraint: true,
  foreignKey: "parentId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

db.post.hasMany(db.images, {
  onDelete: "CASCADE",
  hooks: true,
});

db.images.belongsTo(db.post, {
  foreignKeyConstraint: true,
  foreignKey: "postId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
