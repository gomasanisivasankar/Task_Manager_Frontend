import React, { useState } from 'react';
import StylesRegisterLogin from './RegisterLogin.module.css';
import LeftSideBar from '../../Components/RegisterLogin/LeftSideBar/LeftSideBar';
import Register from '../../Components/RegisterLogin/Register/Register';
import Login from '../../Components/RegisterLogin/Login/Login';

const RegisterLogin = () => {
    const [isRegisterVisible, setIsRegisterVisible] = useState(true);

    const handleToggleForm = () => {
        setIsRegisterVisible((prevIsRegisterVisible) => !prevIsRegisterVisible);
    };

    return (
        <>
            <div className={StylesRegisterLogin.registerLogin}>
              
                <div className={StylesRegisterLogin.sidebarContainer}>
                    <LeftSideBar />
                </div>
            
                <div className={StylesRegisterLogin.form}>
                    {isRegisterVisible ? (
                        <>
                            <div className={StylesRegisterLogin.formContent}>
                                <Register />
                                <div className={StylesRegisterLogin.switchContainer}>
                                    <div className={StylesRegisterLogin.font_4}>Have an account?</div>
                                    <button 
                                        className={StylesRegisterLogin.loginBut} 
                                        onClick={handleToggleForm}
                                        aria-label="Switch to Login form"
                                    >
                                        Log in
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={StylesRegisterLogin.formContent}>
                                <Login />
                                <div className={StylesRegisterLogin.switchContainer}>
                                    <div className={StylesRegisterLogin.font_4}>Have no account yet?</div>
                                    <button 
                                        className={StylesRegisterLogin.registerBut} 
                                        onClick={handleToggleForm}
                                        aria-label="Switch to Registration form"
                                    >
                                        Register
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default RegisterLogin;