const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const db = require("./models");
const cors = require("cors");
const { validateToken } = require("./middlewares/AuthMiddleware");

// Routers
const postRoute = require("./routes/Posts");
const commentRoute = require("./routes/Comments");
const userRoute = require("./routes/Users");
const likeRoute = require("./routes/Likes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/posts", postRoute);
app.use("/comments", commentRoute);
app.use("/auth", userRoute);
app.use("/likes", likeRoute);

db.sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log("server is running on port 8080.");
    });
  })
  .catch((err) => {
    console.log(err);
  });
