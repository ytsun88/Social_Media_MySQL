const router = require("express").Router();
const { Comments } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  const comments = await Comments.findAll({ where: { PostId: postId } });
  res.json(comments);
});

router.post("/", validateToken, async (req, res) => {
  const comment = req.body;
  const username = req.user.username;
  comment.username = username;
  await Comments.create(comment).then((data) => {
    res.json(data);
  });
});

router.delete("/:commentId", validateToken, async (req, res) => {
  const { commentId } = req.params;
  await Comments.destroy({
    where: {
      id: commentId,
    },
  });
  res.json("DELETING SUCCESSFULLY");
});

module.exports = router;
