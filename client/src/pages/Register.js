import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(50).required(),
    password: Yup.string().min(8).max(1024).required(),
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:8080/auth/register", data).then(() => {
      navigate("/login");
    });
  };
  return (
    <div className="registerPage">
      <h1 className="pageTitle">Don't have an account? Register First!</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Username: </label>
          <ErrorMessage name="username" component="span" />
          <Field
            id="inputRegister"
            name="username"
            placeholder="Enter your username here"
          />
          <label>Password: </label>
          <ErrorMessage name="password" component="span" />
          <Field
            id="inputPassword"
            type="password"
            name="password"
            placeholder="Enter your password here"
          />
          <button type="submit">Register</button>
        </Form>
      </Formik>
    </div>
  );
};

export default Register;
