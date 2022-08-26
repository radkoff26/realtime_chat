import React, {useEffect, useLayoutEffect, useState} from 'react';
import Title from "../components/design/Title";
import Login from "../components/business/Login";
import Register from "../components/business/Register";
import '../scss/pages/auth.scss'
import {useAppSelector} from "../hooks/UseAppSelector";
import {useNavigate} from "react-router-dom";

const AuthPage = () => {
    const [isRegister, setRegister] = useState(false)
    const selector = useAppSelector(state => state.authReducer)
    const navigate = useNavigate()

    useLayoutEffect(() => {
        if (selector.isLoggedIn) {
            navigate('/')
        }
    }, [])

    useEffect(() => {
        if (selector.isLoggedIn) {
            navigate('/')
        }
    }, [selector, navigate])

    return (
        <div className='auth_page'>
            <Title text={isRegister ? 'Register' : 'Login'}/>
            <div className='form_container'>
                <div className="form_container__controls">
                    <div className={"form_container__controls__login" + (isRegister ? '' : ' active')} onClick={() => setRegister(false)}>Login</div>
                    <div className={"form_container__controls__register" + (!isRegister ? '' : ' active')} onClick={() => setRegister(true)}>Register</div>
                </div>
                <form className='form_container__form' method='POST'>
                    {isRegister ? <Register/> : <Login/>}
                </form>
            </div>
        </div>
    );
};

export default AuthPage;
