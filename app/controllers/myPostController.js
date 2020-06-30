const db = require("../models");
const MyPost = db.mypost;
const MyPostComment = db.mypostcomments;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.title) {
    res.status(400).send({
      message: err.message || "Content cannot be empty!",
    });
    return;
  }

  // create a post
  const post = {
    userId: req.body.userId,
    author: req.body.author,
    title: req.body.title,
    body: req.body.body,
  };

  // saving post in the db
  MyPost.create(post)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some errors occurred while creating post",
      });
    });
};
exports.findAll = (req, res) => {
  MyPost.findAll({
    order: [["createdAt", "DESC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error occurred!",
      });
    });
};

exports.getByPage = (req, res) => {
  let pageNum = req.params.page;
  let offset = 0;

  if (pageNum > 1) {
    offset = 2 * (pageNum - 1);
  }

  MyPost.findAndCountAll({
    offset: offset,
    limit: 2,
    order: [["createdAt", "DESC"]],
  })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error occurred!",
      });
    });
};

exports.findOne = (req, res) => {
  const postId = req.params.id;

  MyPost.findByPk(postId, {
    include: [
      {
        model: MyPostComment,
        order: [[MyPostComment, "createdAt", "DESC"]],
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

  MyPost.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
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

  MyPost.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Tutorial was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id,
      });
    });
};
// create a comment

exports.createMyPostComment = (req, res) => {
  if (!req.body.comment) {
    res.status(400).send({
      message: err.message || "Content cannot be empty!",
    });
    return;
  }

  const comment = {
    mypostId: req.body.postId,
    userId: req.body.userId,
    author: req.body.author,
    comment: req.body.comment,
  };
  // saving post in the db
  MyPostComment.create(comment)
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

  MyPost.findByPk(postId, {
    include: [
      {
        model: MyPostComment,
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
    mypostId: req.body.postId,
    userId: req.body.userId,
    author: req.body.author,
    comment: req.body.comment,
    parentId: commentId,
  };
  // saving post in the db
  MyPostComment.create(comment)
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
  MyPostComment.findByPk(commentId)
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

  MyPostComment.update(req.body, {
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

  MyPostComment.destroy({
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
