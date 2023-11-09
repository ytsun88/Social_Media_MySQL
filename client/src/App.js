import "./App.css";
import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthContext } from "./helpers/AuthContext";
import axios from "axios";

import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import EditPost from "./pages/EditPost";
import ChangePassword from "./pages/ChangePassword";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });
  useEffect(() => {
    axios
      .get("http://localhost:8080/auth/verify", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  const logout = () => {
    setAuthState({
      username: "",
      id: 0,
      status: false,
    });
    localStorage.removeItem("accessToken");
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <div className="links">
              <Link to="/"> Home Page</Link>
              {authState.status && <Link to="/createpost"> Create A Post</Link>}
              {!authState.status && (
                <>
                  <Link to="/login"> Login</Link>
                  <Link to="/register"> Register</Link>
                </>
              )}
              {authState.status && (
                <Link to="/" onClick={logout}>
                  Logout
                </Link>
              )}
            </div>
            <div className="loggedInContainer">
              {authState.status && <h1>Hello, {authState.username} </h1>}
            </div>
          </div>
          <Routes>
            <Route element={<Home />} path="/" exact />
            <Route element={<CreatePost />} path="/createpost" exact />
            <Route element={<Post />} path="/post/:id" exact />
            <Route element={<Register />} path="/register" exact />
            <Route element={<Login />} path="/login" exact />
            <Route element={<Profile />} path="/profile/:id" exact />
            <Route element={<EditPost />} path="/editPost/:id" exact />
            <Route element={<ChangePassword />} path="/changePassword" exact />
            <Route element={<PageNotFound />} path="*" exact />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
