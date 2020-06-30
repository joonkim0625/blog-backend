module.exports = (app) => {
  const comments = require("../controllers/postController");

  const router = require("express").Router();

  // create a new comment
  router.post("/comments", comments.createComment);

  // get all the comments on a given post

  // create a nested comment
  router.post("/comment/:commentId", comments.createNestedComment);
  // get a single comment on a given comment id
  router.get("/comment/:commentId", comments.findCommentById);

  // update a comment with its id
  router.put("/comment/:commentId", comments.updateComment);

  // delete a comment with its id

  router.delete("/comment/:commentId", comments.deleteComment);

  app.use("/api", router);
};
