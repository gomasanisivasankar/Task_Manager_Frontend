import React, { useState } from 'react';
import axios from 'axios';
import StyleSettingsForm from './SettingsForm.module.css';
import passEye from '../../../Assets/passEye.svg';
import {Url} from '../../../Utils/Url';
import { useDispatch } from 'react-redux';
import { toggleLoader } from '../../../Redux/slice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SettingsForm = () => {
    const baseUrl = Url();

    const [formData, setFormData] = useState({
        _id: localStorage.getItem('id'),
        name: '',
        password: '',
        confirmPassword: '',
    });

    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const [errors, setErrors] = useState({
        name: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        let errorMessage = '';
        if (name === 'name') {
            errorMessage = value.trim() === '' ? 'Name is required' : '';
        } else if (name === 'password') {
            errorMessage = value.length < 8 ? 'Password must be at least 8 characters long' : '';
        } else if (name === 'confirmPassword') {
            errorMessage = value !== formData.password ? 'Passwords do not match' : '';
        }

        setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    };

    const handleTogglePassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitted(true);
        
        // Validate form before submission
        const newErrors = {};
        let hasErrors = false;
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            hasErrors = true;
        }
        
        if (formData.password && formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
            hasErrors = true;
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            hasErrors = true;
        }
        
        if (hasErrors) {
            setErrors(newErrors);
            return;
        }
        
        dispatch(toggleLoader());
        try {
            const response = await axios.post(`${baseUrl}/api/updatesettings`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            localStorage.setItem('name', response.data.updatedDocument.name);
            
            if(formData.name === response.data.updatedDocument.name || formData.password === response.data.updatedDocument.password) {
                toast.success('Updated successfully!');
            }
            
            // Clear password fields after successful update
            setFormData(prev => ({ 
                ...prev, 
                password: '', 
                confirmPassword: '' 
            }));
            setErrors({ name: '', password: '', confirmPassword: '' });
            
        } catch (error) {
            console.error('Error updating settings:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Update failed. Please try again.');
        } finally {
            dispatch(toggleLoader());
        }
    };

    return (
        <div className={StyleSettingsForm.register}>
            <form onSubmit={handleSubmit}>
                {/* Name Field */}
                <div className={StyleSettingsForm.formGroup}>
                    <input
                        className={StyleSettingsForm.inputName}
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {formSubmitted && errors.name && (
                        <span className={StyleSettingsForm.error}>{errors.name}</span>
                    )}
                </div>
                
                {/* Password Field */}
                <div className={StyleSettingsForm.formGroup}>
                    <div className={StyleSettingsForm.passwordContainer}>
                        <input
                            className={StyleSettingsForm.inputPassword}
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <img
                            src={passEye}
                            alt={showPassword ? 'Hide Password' : 'Show Password'}
                            className={StyleSettingsForm.passwordIcon}
                            onClick={handleTogglePassword}
                        />
                    </div>
                    {formSubmitted && errors.password && (
                        <span className={StyleSettingsForm.error}>{errors.password}</span>
                    )}
                </div>
                
                {/* Confirm Password Field */}
                <div className={StyleSettingsForm.formGroup}>
                    <div className={StyleSettingsForm.passwordContainer}>
                        <input
                            className={StyleSettingsForm.inputPassword}
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        <img
                            src={passEye}
                            alt={showConfirmPassword ? 'Hide Confirm Password' : 'Show Confirm Password'}
                            className={StyleSettingsForm.passwordIcon}
                            onClick={handleToggleConfirmPassword}
                        />
                    </div>
                    {formSubmitted && errors.confirmPassword && (
                        <span className={StyleSettingsForm.error}>{errors.confirmPassword}</span>
                    )}
                </div>
                
                <button type="submit" className={StyleSettingsForm.updateButton}>
                    Update
                </button>
            </form>
            <ToastContainer/>
        </div>
    );
};

export default SettingsForm;