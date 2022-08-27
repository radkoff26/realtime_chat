import React, {ChangeEvent, useEffect, useState} from 'react';
import DefaultButton from "../design/DefaultButton";
import {useAppDispatch} from "../../hooks/UseAppDispatch";
import {login} from '../../store/actions/authActions'
import {useAppSelector} from "../../hooks/UseAppSelector";
import {authSlice} from "../../store/slices/authSlice";

const Login = () => {
    const dispatch = useAppDispatch()
    const [userLogin, setUserLogin] = useState('')
    const [password, setPassword] = useState('')
    const selector = useAppSelector(state => state.authReducer)

    useEffect(() => {
        dispatch(authSlice.actions.resetError())
    }, [])

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
            <div className="input_container no-hint">
                <input className='login' type="text" defaultValue={userLogin} onChange={changeEventHandler(setUserLogin)} placeholder='Login'/>
            </div>
            <div className="input_container no-hint">
                <input className='password' type="password" defaultValue={password} onChange={changeEventHandler(setPassword)} placeholder='Password'/>
            </div>
            {selector.error && <p className='error'>{selector.message}</p>}
            <div className="btn_container">
                <DefaultButton text='Login' clickCallback={() => clickHandler()}/>
            </div>
        </>
    );
};

export default Login;
