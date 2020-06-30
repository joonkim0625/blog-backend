const dbConfig = require("../config/dbConfig");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

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
