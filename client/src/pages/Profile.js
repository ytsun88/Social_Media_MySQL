import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import BorderColorIcon from "@mui/icons-material/BorderColor";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [basicInfo, setBasicInfo] = useState({});
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  useEffect(() => {
    axios.get(`http://localhost:8080/auth/byId/${id}`).then((response) => {
      setBasicInfo(response.data);
    });
    axios.get(`http://localhost:8080/posts/byUserId/${id}`).then((response) => {
      setListOfPosts(response.data);
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
    <div className="profilePageContainer">
      <div className="basicInfo">
        {authState.id == id && (
          <button
            className="editProfileButton"
            onClick={() => {
              navigate("/changePassword");
            }}
          >
            <BorderColorIcon /> Change your password
          </button>
        )}
        <h1> Username: {basicInfo.username} </h1>
      </div>
      <div className="listOfPosts">
        {listOfPosts.map((value, key) => {
          return (
            <div key={key} className="post">
              <div className="title"> {value.title} </div>
              <div
                className="body"
                onClick={() => {
                  navigate(`/post/${value.id}`);
                }}
              >
                {value.postText}
              </div>
              <div className="footer">
                <div className="username">
                  <Link to={`/profile/${value.UserId}`}>{value.username}</Link>
                </div>
                <div className="buttons">
                  <ThumbUpAltIcon
                    onClick={() => {
                      likePosts(value.id);
                    }}
                    className={
                      likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                    }
                  />

                  <label>: {value.Likes.length}</label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
