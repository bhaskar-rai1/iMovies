import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Cookie from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import "../style.scss";
import axios from "axios";
import { render } from "../../host";

const AdminRegister = () => {
  const [userData, setUserData] = useState({
    name: "",
    password: "",
    email: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) =>
    setUserData({ ...userData, [e.target.name]: e.target.value });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    closeOnClick: true,
  };

  const handleValidation = () => {
    const { password, confirmPassword, name, email } = userData;
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
    const { email, password, name } = userData;

    if (handleValidation()) {
      const host = `${render}/api/auth/admin/register`;

      const response = await axios.post(host, {
        name,
        password,
        email,
      });

      const { data } = response;

      if (data.status) {
        localStorage.setItem("user", JSON.stringify(data.userData));
        Cookie.set("adminJwtToken", data.jwtToken, { expires: 2 });
        setUserData({ name: "", password: "", email: "", confirmPassword: "" });
        navigate("/admin");
      } else {
        toast.error(data.msg, toastOptions);
      }
    }
  };

  const onShowPass = () => setShowPass((prev) => !prev);

  return (
    <div className="loginContainer">
      <div className="leftSection">
        <h1>iMovies</h1>
        <p>Admin privileges are powerful. Use wisely.</p>
      </div>
      <form onSubmit={handleSubmit} className="formContainer">
        <p className="loginTitle">Admin Register</p>
        <div className="inputContainer">
          <label htmlFor="name">Username</label>
          <input
            name="name"
            id="name"
            type="text"
            placeholder="Enter Username"
            className="input"
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
            className="input"
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
            className="input"
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
            className="input"
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
          Already registered?
          <Link to={"/admin/login"} style={{ textDecoration: "none" }}>
            <span>Login</span>
          </Link>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AdminRegister;
