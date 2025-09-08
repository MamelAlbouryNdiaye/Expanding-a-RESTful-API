const express = require("express");
const router = express.Router();

const comments = require("../data/comments");
const error = require("../utilities/error");

/////////////////////////// GET /comments  ///////////////////
router.get("/", (req, res) => {
  let results = comments;

  if (req.query.userId) {
    results = results.filter(c => c.userId == req.query.userId);
  }
  if (req.query.postId) {
    results = results.filter(c => c.postId == req.query.postId);
  }

  res.json({ comments: results });
});

///////////////////////// POST comments ////////////////////////
router.post("/", (req, res, next) => {
  if (req.body.userId && req.body.postId && req.body.body) {
    const comment = {
      id: comments.length ? comments[comments.length - 1].id + 1 : 1,
      userId: req.body.userId,
      postId: req.body.postId,
      body: req.body.body,
    };
    comments.push(comment);
    res.json(comment);
  } else {
    next(error(400, "Insufficient Data"));
  }
});

///////////////// GET /comments/:id ////////////////////////////
router.get("/:id", (req, res, next) => {
  const comment = comments.find(c => c.id == req.params.id);
  if (comment) res.json(comment);
  else next(error(404, "Comment Not Found"));
});

///////////////////// PATCH /comments/:id ///////////////////////
router.patch("/:id", (req, res, next) => {
  const comment = comments.find((c, i) => {
    if (c.id == req.params.id) {
      for (const key in req.body) {
        comments[i][key] = req.body[key];
      }
      return true;
    }
  });
  if (comment) res.json(comment);
  else next(error(404, "Comment Not Found"));
});

module.exports = router;