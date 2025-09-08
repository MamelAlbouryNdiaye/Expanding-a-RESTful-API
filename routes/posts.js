const express = require("express");
const router = express.Router();

const posts = require("../data/posts");
const error = require("../utilities/error");
const comments = require("../data/comments");

router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "posts/:id",
        rel: ":id",
        type: "GET",
      },
    ];

    res.json({ posts, links });
  })
  .post((req, res, next) => {
    if (req.body.userId && req.body.title && req.body.content) {
      const post = {
        id: posts[posts.length - 1].id + 1,
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content,
      };

      posts.push(post);
      res.json(posts[posts.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);

    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];

    if (post) res.json({ post, links });
    else next();
  })
  .patch((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          posts[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  })
  .delete((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        posts.splice(i, 1);
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  });


///////////////////// GET /api/posts/////////////////////////
router.get("/", (req, res) => {
  let results = posts;
  if (req.query.userId) {
    results = results.filter(p => p.userId == req.query.userId);
  }
  res.json({ posts: results });
});

///////////////////// GET /posts/:id/comments /////////////////
router.get("/:id/comments", (req, res) => {
  const results = comments.filter(c => c.postId == req.params.id);
  if (req.query.userId) {
    return res.json(
      results.filter(c => c.userId == req.query.userId)
    );
  }
  res.json(results);
});


module.exports = router;
