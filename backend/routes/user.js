const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const auth = require("../middleware/auth");
const User = require("../models/User");

const multer = require("multer");
const path = require("path");


// ===============================
// MULTER CONFIG
// ===============================

const storage = multer.diskStorage({
  destination: "./uploads/",

  filename: (req, file, cb) => {
    cb(
      null,
      req.user + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    const types = /jpeg|jpg|png/;

    const ext = types.test(
      path.extname(file.originalname).toLowerCase()
    );

    const mime = types.test(file.mimetype);

    if (ext && mime) {
      cb(null, true);
    } else {
      cb("Images only (jpg, png)");
    }
  }
});


// ===============================
// REGISTER
// ===============================

router.post("/register", async (req, res) => {
  try {

    const { name, email, password } = req.body;

    // Check user
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      name,
      email,
      password: hash
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ===============================
// LOGIN
// ===============================

router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ===============================
// GET MY PROFILE
// ===============================

router.get("/me", auth, async (req, res) => {
  try {

    const user = await User.findById(req.user)
      .select("-password")
      .populate("followers", "name")
      .populate("following", "name");

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ===============================
// UPLOAD PROFILE PHOTO
// ===============================

router.post("/upload", auth, upload.single("photo"), async (req, res) => {
  try {

    const user = await User.findById(req.user);

    user.profilePic = req.file.filename;

    await user.save();

    res.json({
      msg: "Uploaded",
      file: req.file.filename
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ===============================
// GET ALL USERS
// ===============================

router.get("/", auth, async (req, res) => {
  try {

    const users = await User.find({
      _id: { $ne: req.user }
    }).select("-password");

    res.json(users);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ===============================
// FOLLOW USER
// ===============================

router.put("/follow/:id", auth, async (req, res) => {
  try {

    const userToFollow = await User.findById(req.params.id);
    const me = await User.findById(req.user);

    if (!userToFollow) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (me.following.includes(userToFollow._id)) {
      return res.status(400).json({ msg: "Already following" });
    }

    me.following.push(userToFollow._id);
    userToFollow.followers.push(me._id);

    await me.save();
    await userToFollow.save();

    res.json({ msg: "Followed successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ===============================
// UNFOLLOW USER
// ===============================

router.put("/unfollow/:id", auth, async (req, res) => {
  try {

    const userToUnfollow = await User.findById(req.params.id);
    const me = await User.findById(req.user);

    me.following = me.following.filter(
      id => id.toString() !== userToUnfollow._id.toString()
    );

    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== me._id.toString()
    );

    await me.save();
    await userToUnfollow.save();

    res.json({ msg: "Unfollowed successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
