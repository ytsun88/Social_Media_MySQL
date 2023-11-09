const router = require("express").Router();
const { response } = require("express");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { Likes } = require("../models");

router.get("/:userId", validateToken, async (req, res) => {
  const { userId } = req.params;
  const likedPosts = await Likes.findAll({ where: { UserId: userId } });
  res.json(likedPosts);
});

router.post("/", validateToken, async (req, res) => {
  const { PostId } = req.body;
  const UserId = req.user.id;
  const found = await Likes.findOne({
    where: { PostId: PostId, UserId, UserId },
  });
  if (!found) {
    await Likes.create({ PostId: PostId, UserId: UserId }).then((response) => {
      res.json({ liked: true });
    });
  } else {
    await Likes.destroy({ where: { PostId: PostId, UserId: UserId } }).then(
      (response) => {
        res.json({ liked: false });
      }
    );
  }
});

module.exports = router;
