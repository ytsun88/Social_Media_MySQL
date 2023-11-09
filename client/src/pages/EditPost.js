import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialValues = {
    title: "",
    postText: "",
  };
  if (location.state) {
    initialValues.title = location.state.title;
    initialValues.postText = location.state.postText;
  }
  const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    postText: Yup.string().required(),
  });
  const onSubmit = (data) => {
    axios
      .put(`http://localhost:8080/posts/edit/${id}`, data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
          navigate("/login");
        } else {
          navigate(`/post/${id}`);
        }
      });
  };
  return (
    <div className="editPostPage">
      <h3>Edit your post: </h3>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Title: </label>
          <ErrorMessage name="title" component="span" />
          <Field id="inputCreatePost" name="title" />
          <label>Post: </label>
          <ErrorMessage name="postText" component="span" />
          <Field id="inputCreatePost" name="postText" />
          <button type="submit">Edit Post</button>
        </Form>
      </Formik>
    </div>
  );
};

export default EditPost;
