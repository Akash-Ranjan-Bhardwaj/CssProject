import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./Auth.css"; // Import the CSS file for styling

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const { email, password } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const handleError = (err) =>
    toast.error(err, { position: "bottom-left" });
  const handleSuccess = (msg) =>
    toast.success(msg, { position: "bottom-left" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3000/login",
        inputValue,
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/home"); // Redirect to protected route
        }, 1000);
      } else {
        handleError(message);
      }
      
    } catch (error) {
      console.error(error);
      handleError('Login failed. Please try again.');
    }
  };

  return (
    <div className="form_container">
      <h2 className="form_title">Login Account</h2>
      <form onSubmit={handleSubmit} className="auth_form">
        <div className="form_group">
          <label htmlFor="email" className="form_label">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleOnChange}
            className="form_input"
          />
        </div>
        <div className="form_group">
          <label htmlFor="password" className="form_label">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
            className="form_input"
          />
        </div>
        <button type="submit" className="form_button">Submit</button>
        <span className="form_link">
          Already have an account? <Link to={"/signup"}>Signup</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
