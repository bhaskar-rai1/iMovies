import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "../style.scss";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { render } from "../../host";

const AdminLogin = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const onShowPass = () => setShowPass((prev) => !prev);

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

    if (handleValidation()) {
      try {
        const response = await axios.post(`${render}/api/auth/admin/login`, {
          email: userData.email,
          password: userData.password,
          admin: true,
        });

        const { data } = response;

        if (data.status) {
          localStorage.setItem("user", JSON.stringify(data.userData));
          Cookie.set("adminJwtToken", data.jwtToken, { expires: 9 });
          setUserData({ email: "", password: "" });
          navigate("/admin");
        } else {
          toast.error(data.msg, toastOptions);
        }
      } catch (err) {
        toast.error("Something went wrong.", toastOptions);
      }
    }
  };

  return (
    <div className="loginContainer">
      <div className="leftSection">
        <h1>iMovies</h1>
        <p>Your admin dashboard awaits.</p>
      </div>

      <form onSubmit={handleSubmit} className="formContainer">
        <h2>Admin Login</h2>

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
          Don’t have an admin account?
          <Link to="/admin/register">
            <span>Register</span>
          </Link>
        </p>

        <ToastContainer />
      </form>
    </div>
  );
};

export default AdminLogin;
