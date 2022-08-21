import React, {ChangeEvent, useEffect, useState} from 'react';
import DefaultButton from "../design/DefaultButton";
import {useAppDispatch} from "../../hooks/UseAppDispatch";
import {login} from '../../store/actions/authActions'
import {useAppSelector} from "../../hooks/UseAppSelector";
import {useNavigate} from "react-router-dom";
import {authSlice} from "../../store/slices/authSlice";

const Login = () => {
    const dispatch = useAppDispatch()
    const [userLogin, setUserLogin] = useState('')
    const [password, setPassword] = useState('')
    const selector = useAppSelector(state => state.authReducer)
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(authSlice.actions.resetError())
    }, [])

    useEffect(() => {
        if (selector.isLoggedIn) {
            navigate('/')
        }
    }, [selector, navigate])

    const changeEventHandler = (setState: (s: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
        setState(e.target.value)
    }

    const clickHandler = () => {
        if (login && password) {
            dispatch(login(userLogin, password))
        } else {
            dispatch(authSlice.actions.errorWhileLogin('Neither login nor password can be empty!'))
        }
    }

    return (
        <>
            <input className='login' type="text" defaultValue={userLogin} onChange={changeEventHandler(setUserLogin)} placeholder='Login'/>
            <input className='password' type="password" defaultValue={password} onChange={changeEventHandler(setPassword)} placeholder='Password'/>
            {selector.error && <p className='error'>{selector.error}</p>}
            <DefaultButton text='Login' clickCallback={() => clickHandler()}/>
        </>
    );
};

export default Login;
