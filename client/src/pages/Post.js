import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";

function Post() {
  let { id } = useParams();
  const navigate = useNavigate();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`http://localhost:8080/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });
    axios.get(`http://localhost:8080/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);

  const handleAddComment = () => {
    if (newComment !== "") {
      axios
        .post(
          "http://localhost:8080/comments/",
          {
            commentBody: newComment,
            PostId: id,
          },
          {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }
        )
        .then((response) => {
          if (response.data.error) {
            setNewComment("");
            alert(response.data.error);
            navigate("/login");
          } else {
            const commentToAdd = {
              commentBody: newComment,
              username: response.data.username,
              id: response.data.id,
            };
            setComments([...comments, commentToAdd]);
            setNewComment("");
          }
        });
    }
  };

  const deleteComment = (commentId) => {
    axios
      .delete(`http://localhost:8080/comments/${commentId}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComments(
          comments.filter((comment) => {
            return comment.id !== commentId;
          })
        );
      });
  };

  const deletePost = (postId) => {
    axios
      .delete(`http://localhost:8080/posts/${postId}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        navigate("/");
      });
  };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div className="title"> {postObject.title} </div>
          <div className="body">{postObject.postText}</div>
          <div className="footer">
            <Link to={`/profile/${postObject.UserId}`}>
              {postObject.username}
            </Link>
            {authState.username === postObject.username && (
              <div>
                <BorderColorIcon
                  className="editButton"
                  onClick={() => {
                    navigate(`/editPost/${postObject.id}`, {
                      state: {
                        title: postObject.title,
                        postText: postObject.postText,
                      },
                    });
                  }}
                />
                <DeleteIcon
                  className="deleteButton"
                  onClick={() => {
                    deletePost(postObject.id);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        {authState.status && (
          <div className="addCommentContainer">
            <input
              type="text"
              placeholder="Comment..."
              value={newComment}
              onChange={(event) => {
                setNewComment(event.target.value);
              }}
            ></input>
            <button onClick={handleAddComment}>Add Comment</button>
          </div>
        )}
        {!authState.status && (
          <div className="addCommentContainer">
            <h3>
              <Link to="/login">Login</Link> to write some comments...
            </h3>
          </div>
        )}
        <h3>Comments: </h3>
        <div className="listOfComments">
          {comments.map((comment) => {
            return (
              <div className="comment" key={comment.id}>
                <div className="commentTitle">
                  <span className="user"> {comment.username}:</span>
                  {authState.username === comment.username && (
                    <DeleteIcon
                      className="deleteButton"
                      onClick={() => {
                        deleteComment(comment.id);
                      }}
                    />
                  )}
                </div>
                <p className="commentContext">{comment.commentBody}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
