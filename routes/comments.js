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

module.exports = router;