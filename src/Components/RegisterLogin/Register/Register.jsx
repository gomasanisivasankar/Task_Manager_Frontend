import React, { useState } from 'react';
import StylesRegister from './Register.module.css';
import passEye from '../../../Assets/passEye.svg';
import { Url } from '../../../Utils/Url';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { toggleLoader } from '../../../Redux/slice';

const Register = () => {
    const baseUrl = Url();
    const dispatch = useDispatch();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(prev => !prev);
    };

    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword(prev => !prev);
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
            isValid = false;
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitted(true);

        if (!validateForm()) {
            return;
        }

        dispatch(toggleLoader());
        try {
            const response = await axios.post(`${baseUrl}/api/register`, formData);
            toast.success(response.data.message || 'Registration successful!');
            
            // Optional: Redirect to login or auto-login
            // localStorage.setItem('token', response.data.token);
            // window.location.href = '/dashboard';
            
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            
            const errorMessage = error.response?.data?.message || 
                error.response?.data?.error ||
                'Registration failed. Please try again.';
            toast.error(errorMessage);
            
            // Handle specific error cases
            if (error.response?.status === 409) {
                setErrors(prev => ({ ...prev, email: 'Email already exists' }));
            }
        } finally {
            dispatch(toggleLoader());
        }
    };

    // Handle Enter key press for better UX
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.target.type !== 'submit') {
            handleSubmit(e);
        }
    };

    return (
        <>
            <div className={StylesRegister.register}>
                <h2 className={StylesRegister.registerTitle}>Register</h2>
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    {/* Name Field - Similar to email field in Login */}
                    <div className={StylesRegister.inputGroup}>
                        <input
                            className={StylesRegister.inputName}
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                        />
                        {(formSubmitted && errors.name) && (
                            <span className={StylesRegister.error}>{errors.name}</span>
                        )}
                    </div>

                    {/* Email Field - Same as Login */}
                    <div className={StylesRegister.inputGroup}>
                        <input
                            className={StylesRegister.inputEmail}
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                        />
                        {(formSubmitted && errors.email) && (
                            <span className={StylesRegister.error}>{errors.email}</span>
                        )}
                    </div>

                    {/* Password Field - Same as Login */}
                    <div className={StylesRegister.inputGroup}>
                        <div className={StylesRegister.passwordContainer}>
                            <input
                                className={StylesRegister.inputPassword}
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                            />
                            <img
                                src={passEye}
                                alt={showPassword ? 'Hide Password' : 'Show Password'}
                                className={StylesRegister.passwordIcon}
                                onClick={handleTogglePassword}
                                role="button"
                                tabIndex="0"
                                onKeyPress={(e) => e.key === 'Enter' && handleTogglePassword()}
                            />
                        </div>
                        {(formSubmitted && errors.password) && (
                            <span className={StylesRegister.error}>{errors.password}</span>
                        )}
                    </div>

                    {/* Confirm Password Field - Similar to Password field */}
                    <div className={StylesRegister.inputGroup}>
                        <div className={StylesRegister.passwordContainer}>
                            <input
                                className={StylesRegister.inputPassword}
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                            />
                            <img
                                src={passEye}
                                alt={showConfirmPassword ? 'Hide Confirm Password' : 'Show Confirm Password'}
                                className={StylesRegister.passwordIcon}
                                onClick={handleToggleConfirmPassword}
                                role="button"
                                tabIndex="0"
                                onKeyPress={(e) => e.key === 'Enter' && handleToggleConfirmPassword()}
                            />
                        </div>
                        {(formSubmitted && errors.confirmPassword) && (
                            <span className={StylesRegister.error}>{errors.confirmPassword}</span>
                        )}
                    </div>

                    <button type="submit" className={StylesRegister.registerButton}>
                        Register
                    </button>
                </form>
            </div>

            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
};

export default Register;