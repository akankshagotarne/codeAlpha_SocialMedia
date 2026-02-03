const express = require("express");

const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();


// GET MY PROFILE
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


// FOLLOW USER
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


// UNFOLLOW USER
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
