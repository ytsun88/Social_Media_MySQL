const router = require("express").Router();
const bcrypt = require("bcrypt");
const { Users, Posts } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

const { sign } = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const listOfPosts = await Posts.findAll();
  res.json(listOfPosts);
});

router.get("/byId/:userId", async (req, res) => {
  const { userId } = req.params;
  const foundUser = await Users.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });
  res.json(foundUser);
});

router.get("/verify", validateToken, (req, res) => {
  res.json(req.user);
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
    });
    res.json("SUCCESS");
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });
  if (!user) {
    res.json({ error: "User doesn't exist" });
  } else {
    bcrypt.compare(password, user.password).then(async (match) => {
      if (!match) {
        res.json({ error: "Wrong username or password" });
      } else {
        const accessToken = sign(
          { username: user.username, id: user.id },
          process.env.SECRET
        );
        res.json({ token: accessToken, username: user.username, id: user.id });
      }
    });
  }
});

router.put("/changePassword", validateToken, async (req, res) => {
  const id = req.user.id;
  const { oldPassword, newPassword } = req.body;
  const user = await Users.findByPk(id);
  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match) {
      res.json({ error: "Wrong old password" });
    } else {
      await bcrypt.hash(newPassword, 10).then(async (hash) => {
        await Users.update({ password: hash }, { where: { id: id } });
        res.json("SUCCESS");
      });
    }
  });
});

module.exports = router;
