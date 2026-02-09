const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");


const Post = require("../models/Post");
const auth = require("../middleware/auth");
const User = require("../models/User"); 

// Storage setup
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  }

});

const upload = multer({ storage });



// ================= CREATE POST =================
router.post("/", auth, upload.single("image"), async (req, res) => {

  try {

    const post = new Post({

      user: req.user,

      text: req.body.text,

      image: req.file ? req.file.filename : ""

    });

    await post.save();

    res.json(post);

  } catch (err) {

    console.error(err.message);

    res.status(500).send("Server Error");

  }

});





// ================= ADD COMMENT =================
router.post("/comment/:id", auth, async (req, res) => {
  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    const user = await User.findById(req.user.id || req.user).select("name");

if (!user) {
  return res.status(400).json({ msg: "User not found" });
}


     const newComment = {
  text: req.body.text,
  name: user.name,
  user: user._id,   // ✅ FIXED
  date: new Date()
};


    post.comments.unshift(newComment);

    await post.save();

    res.json(post.comments);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// ================= GET ALL POSTS =================
router.get("/", auth, async (req, res) => {
  try {

    const posts = await Post.find()
  .populate("user", "name profilePic")
  .sort({ createdAt: -1 });


    res.json(posts);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= LIKE POST =================
router.put("/like/:id", auth, async (req, res) => {
  try {

    const post = await Post.findById(req.params.id);

    if (!post.likes.includes(req.user.id || req.user)) {
  post.likes.push(req.user.id || req.user);
}

    await post.save();

    res.json(post);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
