import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style.scss";
import axios from "axios";
import { render } from "../../host";

const Login = () => {
  const [userData, setUserData] = useState({
    password: "",
    email: "",
  });

  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    closeOnClick: true,
  };

  const handleValidation = () => {
    const { email, password } = userData;
    if (email === "" || password === "") {
      toast.error("Email and Password are required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = userData;

    if (handleValidation()) {
      try {
        const host = `${render}/api/auth/login`;
        const response = await axios.post(host, { email, password });
        const { data } = response;

        if (data.status) {
          localStorage.setItem("user", JSON.stringify(data.userData));
          Cookie.set("jwtToken", data.jwtToken, { expires: 9 });
          setUserData({ email: "", password: "" });
          navigate("/");
        } else {
          toast.error(data.msg, toastOptions);
        }
      } catch (err) {
        toast.error("Login failed. Try again.", toastOptions);
      }
    }
  };

  const onShowPass = () => {
    setShowPass((prev) => !prev);
  };

  return (
    <div className="loginContainer">
      <div className="leftSection">
        <h1>iMovies</h1>
        <p>Your ultimate movie escape. <br />Book easy. Watch happy!</p>
      </div>

      <form onSubmit={handleSubmit} className="formContainer">
        <h2>Login to your account</h2>

        <div className="inputContainer">
          <label htmlFor="email">Email</label>
          <input
            name="email"
            id="email"
            type="email"
            placeholder="Enter your email"
            value={userData.email}
            onChange={onChange}
          />
        </div>

        <div className="inputContainer">
          <label htmlFor="password">Password</label>
          <input
            name="password"
            id="password"
            type={showPass ? "text" : "password"}
            placeholder="Enter your password"
            value={userData.password}
            onChange={onChange}
          />
        </div>

        <div className="checkbox">
          <input
            type="checkbox"
            id="showPass"
            checked={showPass}
            onChange={onShowPass}
          />
          <label htmlFor="showPass">Show Password</label>
        </div>

        <button type="submit">Login</button>

        <p>
          Don’t have an account?{" "}
          <Link to="/register">
            <span>Register</span>
          </Link>
        </p>

        <ToastContainer />
      </form>
    </div>
  );
};

export default Login;
