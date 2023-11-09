const router = require("express").Router();
const { Posts, Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { where } = require("sequelize");

router.get("/", async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: [Likes] });
  res.json(listOfPosts);
});

router.get("/byId/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Posts.findByPk(id, { include: [Likes] });
  res.json(post);
});

router.get("/byUserId/:id", async (req, res) => {
  const { id } = req.params;
  const posts = await Posts.findAll({
    where: { UserId: id },
    include: [Likes],
  });
  res.json(posts);
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  post.username = req.user.username;
  post.UserId = req.user.id;
  await Posts.create(post);
  res.json(post);
});

router.put("/edit/:id", validateToken, async (req, res) => {
  const { id } = req.params;
  const newPost = req.body;
  newPost.username = req.user.username;
  newPost.UserId = req.user.id;
  await Posts.update(
    { title: newPost.title, postText: newPost.postText },
    { where: { id: id } }
  );
  res.json(newPost);
});

router.delete("/:postId", validateToken, async (req, res) => {
  const { postId } = req.params;
  await Posts.destroy({
    where: {
      id: postId,
    },
  });
  res.json("DELETING SUCCESSFULLY");
});

module.exports = router;
