import React, { useState } from "react";
import StylesLogin from "./Login.module.css";
import passEye from "../../../Assets/passEye.svg";
import { Url } from "../../../Utils/Url";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { toggleLoader } from "../../../Redux/slice";

const Login = () => {
  const baseUrl = Url();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const dispatch = useDispatch();
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    let errorMessage = "";
    if (name === "email") {
      errorMessage = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? ""
        : "Invalid email address";
    } else if (name === "password") {
      errorMessage =
        value.length < 8 ? "Password must be at least 8 characters long" : "";
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  };

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Validate before submission
    let hasErrors = false;
    const newErrors = { ...errors };
    
    if (!formData.email) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      hasErrors = true;
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
      hasErrors = true;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      hasErrors = true;
    }
    
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    
    dispatch(toggleLoader());
    try {
      const response = await axios.post(`${baseUrl}/api/login`, formData);
      console.log(response.data);
      toast.success(response.data.message);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("id", response.data.userId.toString());
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("das", true);
      window.location.href = "/dashboard";
      dispatch(toggleLoader());
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
      localStorage.setItem("das", false);
      dispatch(toggleLoader());
    }
  };

  return (
    <>
      <div className={StylesLogin.login}>
        <h2 className={StylesLogin.loginTitle}>Login</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
         
          <div className={StylesLogin.inputGroup}>
            <input
              className={StylesLogin.inputEmail}
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {formSubmitted && errors.email && (
              <span className={StylesLogin.error}>{errors.email}</span>
            )}
          </div>
          
       
          <div className={StylesLogin.inputGroup}>
            <div className={StylesLogin.passwordContainer}>
              <input
                className={StylesLogin.inputPassword}
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <img
                src={passEye}
                alt={showPassword ? 'Hide Password' : 'Show Password'}
                className={StylesLogin.passwordIcon}
                onClick={handleTogglePassword}
              />
            </div>
            {formSubmitted && errors.password && (
              <span className={StylesLogin.error}>{errors.password}</span>
            )}
          </div>
          
          <button type="submit" className={StylesLogin.loginButton}>
            Login
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;