import React, {ChangeEvent, useEffect, useState} from 'react';
import DefaultButton from "../design/DefaultButton";
import {useAppDispatch} from "../../hooks/UseAppDispatch";
import {login} from '../../store/actions/userActions'
import {useAppSelector} from "../../hooks/UseAppSelector";
import {loginFormSlice} from "../../store/slices/loginFormSlice";
import '../../scss/components/form.scss'
import {ActionCreatorWithPayload} from "@reduxjs/toolkit";

// TODO: create another separate slice for login error
const LoginForm = () => {
    const dispatch = useAppDispatch()
    const [userLogin, setUserLogin] = useState('')
    const [password, setPassword] = useState('')
    const selector = useAppSelector(state => state.loginFormReducer)

    useEffect(() => {
        dispatch(loginFormSlice.actions.resetError())
    }, [])

    const changeEventHandler = (setState: (s:string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
        setState(e.target.value)
    }

    const clickHandler = () => {
        if (userLogin && password) {
            dispatch(login(userLogin, password) as unknown as any)
        } else {
            dispatch(loginFormSlice.actions.error('Neither login nor password can be empty!'))
        }
    }

    return (
        <form className='form_container__form' method='POST'>
            <div className="input_container no-hint">
                <input className='login' type="text" defaultValue={userLogin} onChange={changeEventHandler(setUserLogin)} placeholder='Login'/>
            </div>
            <div className="input_container no-hint">
                <input className='password' type="password" defaultValue={password} onChange={changeEventHandler(setPassword)} placeholder='Password'/>
            </div>
            {selector.isError && <p className='error'>{selector.message}</p>}
            <div className="btn_container">
                <DefaultButton text='Login' clickCallback={() => clickHandler()}/>
            </div>
        </form>
    );
};

export default LoginForm;
