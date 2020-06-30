module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("comment", {
    userId: {
      // UUID
      type: Sequelize.UUID,
    },
    author: {
      type: Sequelize.STRING,
    },
    comment: {
      type: Sequelize.STRING,
    },
  });

  return Comment;
};
