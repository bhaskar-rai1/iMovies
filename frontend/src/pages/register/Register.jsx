import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Cookie from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import "../style.scss";
import axios from "axios";
import { render } from "../../host";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    closeOnClick: true,
  };

  const handleValidation = () => {
    const { name, email, password, confirmPassword } = userData;

    if (password !== confirmPassword) {
      toast.error("Password and confirm password should be same.", toastOptions);
      return false;
    } else if (name.length < 3) {
      toast.error("Username should be greater than 3 characters.", toastOptions);
      return false;
    } else if (password.length < 4) {
      toast.error("Password should be equal or greater than 8 characters.", toastOptions);
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = userData;

    if (handleValidation()) {
      try {
        const host = `${render}/api/auth/register`;

        const response = await axios.post(host, {
          name,
          email,
          password,
        });

        const { data } = response;

        if (data.status) {
          localStorage.setItem("user", JSON.stringify(data.userData));
          Cookie.set("jwtToken", data.jwtToken);
          setUserData({ name: "", email: "", password: "", confirmPassword: "" });
          navigate("/");
        } else {
          toast.error(data.msg, toastOptions);
        }
      } catch (err) {
        toast.error("Something went wrong.", toastOptions);
      }
    }
  };

  const onShowPass = () => setShowPass((prev) => !prev);

  return (
    <div className="loginContainer">
      <div className="leftSection">
        <h1>iMovies</h1>
        <p>Start your cinematic journey!</p>
      </div>

      <form onSubmit={handleSubmit} className="formContainer">
        <p className="loginTitle">Register</p>

        <div className="inputContainer">
          <label htmlFor="name">Username</label>
          <input
            name="name"
            id="name"
            type="text"
            placeholder="Enter Username"
            onChange={onChange}
            value={userData.name}
          />
        </div>

        <div className="inputContainer">
          <label htmlFor="email">Email</label>
          <input
            name="email"
            id="email"
            type="email"
            placeholder="Enter your email"
            onChange={onChange}
            value={userData.email}
          />
        </div>

        <div className="inputContainer">
          <label htmlFor="pass">Password</label>
          <input
            name="password"
            id="pass"
            type={showPass ? "text" : "password"}
            placeholder="Enter your password"
            onChange={onChange}
            value={userData.password}
          />
        </div>

        <div className="inputContainer">
          <label htmlFor="confirm">Confirm Password</label>
          <input
            name="confirmPassword"
            id="confirm"
            type={showPass ? "text" : "password"}
            placeholder="Confirm your password"
            onChange={onChange}
            value={userData.confirmPassword}
          />
        </div>

        <div className="checkbox">
          <input onChange={onShowPass} id="check" type="checkbox" />
          <label htmlFor="check">Show Password</label>
        </div>

        <button type="submit">Submit</button>

        <p>
          Already have an account?{" "}
          <Link to="/login">
            <span>Login</span>
          </Link>
        </p>

        <p>
          Register as an{" "}
          <Link to="/admin/register">
            <span>Admin</span>
          </Link>
        </p>

        <ToastContainer />
      </form>
    </div>
  );
};

export default Register;