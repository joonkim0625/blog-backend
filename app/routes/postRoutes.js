const upload = require("../config/uploadConfig");

module.exports = (app) => {
  const posts = require("../controllers/postController");

  const router = require("express").Router();

  // Create a new post
  router.post("/posts", posts.create);

  // Retrieve all of forum posts with paging
  router.get("/posts", posts.findAll);

  // Retrieve all of my posts with paging
  router.get("/myposts", posts.findAllFromMyPosts);

  router.get("/postComments/:postId", posts.findCommentByPost);

  // Retrieve a single post with id
  router.get("/post/:id", posts.findOne);

  // search
  router.get("/search", posts.search);

  // Update a post with id
  router.put("/post/:id", posts.update);

  // Delete a post with id
  router.delete("/post/:id", posts.delete);

  app.use("/api", router);
};
