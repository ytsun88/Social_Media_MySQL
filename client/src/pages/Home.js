import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  useEffect(() => {
    axios.get("http://localhost:8080/posts").then((response) => {
      setListOfPosts(response.data.reverse());
    });
    if (authState.id != 0 && authState.status) {
      axios
        .get(`http://localhost:8080/likes/${authState.id}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((respoense) => {
          setLikedPosts(
            respoense.data.map((like) => {
              return like.PostId;
            })
          );
        });
    }
  }, []);
  const likePosts = (postId) => {
    axios
      .post(
        "http://localhost:8080/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        }
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return {
                  ...post,
                  Likes: [
                    ...post.Likes,
                    { UserId: authState.id, PostId: postId },
                  ],
                };
              } else {
                const likeArray = post.Likes;
                const newLikeArray = likeArray.filter((like) => {
                  return like.UserId != authState.id;
                });
                return { ...post, Likes: newLikeArray };
              }
            } else {
              return post;
            }
          })
        );
        if (authState.id != 0 && authState.status) {
          if (likedPosts.includes(postId)) {
            setLikedPosts(
              likedPosts.filter((id) => {
                return id != postId;
              })
            );
          } else {
            setLikedPosts([...likedPosts, postId]);
          }
        }
      });
  };
  return (
    <div>
      {listOfPosts.map((post) => {
        return (
          <div className="post" key={post.id}>
            <div className="title">{post.title}</div>
            <div
              className="body"
              onClick={() => {
                navigate(`/post/${post.id}`);
              }}
            >
              {post.postText}
            </div>
            <div className="footer">
              <div className="username">
                <Link to={`/profile/${post.UserId}`}>{post.username}</Link>
              </div>
              <div className="buttons">
                <ThumbUpAltIcon
                  onClick={() => {
                    likePosts(post.id);
                  }}
                  className={
                    likedPosts.includes(post.id) ? "unlikeBttn" : "likeBttn"
                  }
                />

                <label>: {post.Likes.length}</label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
