import React, {useEffect, useState} from 'react';
import Title from "../components/design/Title";
import LoginForm from "../components/business/LoginForm";
import RegisterForm from "../components/business/RegisterForm";
import authStyle from '../scss/pages/auth.module.scss'
import formStyle from '../scss/components/form.module.scss'
import {useAppSelector} from "../hooks/UseAppSelector";
import {useNavigate} from "react-router-dom";

const AuthPage = () => {
    const [isRegister, setRegister] = useState(false)
    const selector = useAppSelector(state => state.userReducer)
    const navigate = useNavigate()

    useEffect(() => {
        if (selector.isLoggedIn) {
            navigate('/')
        }
    }, [selector, navigate])

    return (
        <div className={authStyle.auth_page}>
            <Title text={isRegister ? 'Register' : 'Login'}/>
            <div className={formStyle.form_container}>
                <div className={authStyle.form_container__controls}>
                    <div className={isRegister ? '' : authStyle.active}
                         onClick={() => setRegister(false)}>Login
                    </div>
                    <div className={!isRegister ? '' : authStyle.active}
                         onClick={() => setRegister(true)}>Register
                    </div>
                </div>
                {isRegister ? <RegisterForm toggleBlock={() => setRegister(false)}/> : <LoginForm/>}
            </div>
        </div>
    );
};

export default AuthPage;
