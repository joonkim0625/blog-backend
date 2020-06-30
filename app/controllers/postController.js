const db = require("../models");
const Post = db.post;
const Comment = db.comments;
const Op = db.Sequelize.Op;
const fs = require("fs");
const multer = require("multer");

// functions for pagination
const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: posts } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, posts, totalPages, currentPage };
};

// =============================

exports.findAll = (req, res) => {
  const { page, size } = req.query;

  const { limit, offset } = getPagination(page, size);

  Post.findAndCountAll({
    where: {
      boardType: "post",
    },
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving posts.",
      });
    });
};

exports.findAllFromMyPosts = (req, res) => {
  const { page, size } = req.query;

  const { limit, offset } = getPagination(page, size);

  Post.findAndCountAll({
    where: {
      boardType: "mypost",
    },
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred while retrieving posts",
      });
    });
};

// create and save a new post
exports.create = (req, res) => {
  const fileValue = req.file ? req.file.filename : "";
  const post = {
    userId: req.body.userId,
    author: req.body.author,
    title: req.body.title,
    body: req.body.body,
    boardType: req.body.boardType,
    file: fileValue,
  };

  if (fileValue === "") {
    Post.create(post)
      .then((data) => {
        res.send(data);
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    fs.rename(req.file.path, __basedir + "/uploads/" + fileValue, function (
      err
    ) {
      if (err) {
        res.send(500);
        console.log(err);
      } else {
        // saving post in the db
        Post.create(post)
          .then((data) => {
            res.send(data.get({ plain: true }));
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some errors occurred while creating post",
            });
          });
      }
    });
  }
};

// find a single post with an user id( or with a post id ?)
exports.findOne = (req, res) => {
  const postId = req.params.id;

  Post.findByPk(postId, {
    include: [
      {
        model: Comment,
        order: [[Comment, "createdAt", "DESC"]],
      },
    ],
  })
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving a post with an id = " + id,
      });
    });
};

// update a post by the user id and the post id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Post.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          num: num,
          message: "Post was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Post with id=${id}. Maybe Post was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Post with an id =" + id,
      });
    });
};

// delete a post with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Post.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Posts was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Posts with id=${id}. Maybe Posts was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Posts with id=" + id,
      });
    });
};

// search function
exports.search = (req, res) => {
  if (typeof req.query.tsquery === "string" && req.query.tsquery.trim()) {
    const tsquery = req.query.tsquery.trim();

    Post.searchText(db, tsquery)
      .then(function (posts) {
        res.send({
          tsquery: tsquery,
          posts: posts,
        });
      })
      .catch(function (err) {
        res.send({ previousTsquery: tsquery });
      });
  } else {
    res.send({
      previousTsquery: req.query["previous-tsquery"],
    });
  }
};

// comments ===========================

// create a comment
exports.createComment = (req, res) => {
  if (!req.body.comment) {
    res.status(400).send({
      message: err.message || "Content cannot be empty!",
    });
    return;
  }

  const comment = {
    postId: req.body.postId,
    userId: req.body.userId,
    author: req.body.author,
    comment: req.body.comment,
  };
  // saving post in the db
  Comment.create(comment)
    .then((data) => {
      console.log("comment created!");
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred while creating comment",
      });
    });
};

// get the comments for a given post
exports.findCommentByPost = (req, res) => {
  const postId = req.params.postId;

  Post.findByPk(postId, {
    include: [
      {
        model: Comment,
      },
    ],
  })
    .then((comments) => {
      console.log(comments);
      res.send(comments);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving a post with an id = " + id,
      });
    });
};

exports.createNestedComment = (req, res) => {
  const commentId = req.params.commentId;
  const comment = {
    postId: req.body.postId,
    userId: req.body.userId,
    author: req.body.author,
    comment: req.body.comment,
    parentId: commentId,
  };
  // saving post in the db
  Comment.create(comment)
    .then((data) => {
      console.log("nested comment created!");
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred while creating comment",
      });
    });
};
exports.findCommentById = (req, res) => {
  const commentId = req.params.commentId;
  Comment.findByPk(commentId)
    .then((comment) => {
      console.log(comment);
      res.send(comment);
    })
    .catch((err) => {
      console.log("error while finding a comment: ", err);
    });
};

exports.updateComment = (req, res) => {
  const commentId = req.params.commentId;

  Comment.update(req.body, {
    where: { id: commentId },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Comment was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Comment with id=${id}. Maybe Comment was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Comment with an id =" + id,
      });
    });
};

exports.deleteComment = (req, res) => {
  const commentId = req.params.commentId;

  Comment.destroy({
    where: { id: commentId },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Comment was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Comment with id=${id}. Maybe Comment was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Comment with id=" + id,
      });
    });
};
