import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const ChangePassword = () => {
  const navigate = useNavigate();
  const initialValues = {
    oldPassword: "",
    newPassword: "",
  };

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string().min(8).max(1024).required(),
  });

  const onSubmit = (data) => {
    axios
      .put("http://localhost:8080/auth/changePassword", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          alert("Password changed");
          navigate("/");
        }
      });
  };
  return (
    <div className="loginContainer">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Old password: </label>
          <ErrorMessage name="oldPassword" component="span" />
          <Field
            id="inputOldPassword"
            type="password"
            name="oldPassword"
            placeholder="Old password..."
          />
          <label>New password: </label>
          <ErrorMessage name="newPassword" component="span" />
          <Field
            id="inputNewPassword"
            type="password"
            name="newPassword"
            placeholder="New password..."
          />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
};

export default ChangePassword;
