const express = require("express");

const Post = require("../models/Post");
const auth = require("../middleware/auth");

const router = express.Router();


// CREATE POST
router.post("/", auth, async (req, res) => {
  try {

    const post = new Post({
      user: req.user,
      text: req.body.text
    });

    await post.save();

    res.json(post);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET ALL POSTS
router.get("/", auth, async (req, res) => {
  try {

    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// LIKE POST
router.put("/like/:id", auth, async (req, res) => {
  try {

    const post = await Post.findById(req.params.id);

    if (!post.likes.includes(req.user)) {
      post.likes.push(req.user);
      await post.save();
    }

    res.json(post);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// COMMENT
router.post("/comment/:id", auth, async (req, res) => {
  try {

    const post = await Post.findById(req.params.id);

    post.comments.push({
      user: req.user,
      text: req.body.text
    });

    await post.save();

    res.json(post);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
