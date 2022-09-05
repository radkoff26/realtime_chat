import React, {memo, Reducer, useReducer, useRef, useState} from 'react';
import DefaultButton from "../design/DefaultButton";
import {useNavigate} from "react-router-dom";
import {PayloadAction} from "@reduxjs/toolkit";
import Hint from "../design/Hint";
import axios from "../../axios";
import {AxiosError} from "axios";

import '../../scss/components/form.scss'

interface RegisterProps {
    toggleBlock: () => void
}

interface ValueAndError {
    value: string
    error: string
}

interface InputData {
    username: ValueAndError
    login: ValueAndError
    password: ValueAndError
    repeatPassword: ValueAndError
}

interface RegistrationResponse {
    hasSucceeded: boolean
}

const initialState: InputData = {
    username: {
        value: '',
        error: ''
    },
    login: {
        value: '',
        error: ''
    },
    password: {
        value: '',
        error: ''
    },
    repeatPassword: {
        value: '',
        error: ''
    }
}

const TYPES = {
    USERNAME: 'USERNAME',
    USERNAME_ERROR: 'USERNAME_ERROR',
    LOGIN: 'LOGIN',
    LOGIN_ERROR: 'LOGIN_ERROR',
    PASSWORD: 'PASSWORD',
    PASSWORD_ERROR: 'PASSWORD_ERROR',
    PASSWORD_REPEAT: 'PASSWORD_REPEAT',
    PASSWORD_REPEAT_ERROR: 'PASSWORD_REPEAT_ERROR'
}

const REGEXES = {
    USERNAME: /[a-zA-Z ]+/,
    LOGIN: /[a-zA-Z0-9.\-_]{3,}/,
    PASSWORD: /([a-zA-Z0-9.\-_]{8,})/
}

const reducer: Reducer<InputData, PayloadAction<string>> = (state: InputData, action: PayloadAction<string>): InputData => {
    switch (action.type) {
        case TYPES.USERNAME:
            return {...state, username: {value: action.payload, error: ''}}
        case TYPES.USERNAME_ERROR:
            return {...state, username: {...state.username, error: 'Username doesn\'t satisfy requirements!'}}
        case TYPES.LOGIN:
            return {...state, login: {value: action.payload, error: ''}}
        case TYPES.LOGIN_ERROR:
            return {...state, login: {...state.login, error: 'Login doesn\'t satisfy requirements!'}}
        case TYPES.PASSWORD:
            return {...state, password: {value: action.payload, error: ''}}
        case TYPES.PASSWORD_ERROR:
            return {...state, password: {...state.password, error: 'Password doesn\'t satisfy requirements!'}}
        case TYPES.PASSWORD_REPEAT:
            return {...state, repeatPassword: {value: action.payload, error: ''}}
        case TYPES.PASSWORD_REPEAT_ERROR:
            return {...state, repeatPassword: {...state.repeatPassword, error: 'Passwords don\'t match!'}}
        default:
            return state
    }
}

const RegisterForm = ({toggleBlock}: RegisterProps) => {
    const [state, dispatch] = useReducer(reducer, initialState, () => initialState)
    const [passwordInputState, setPasswordInputState] = useState(false)
    const [repeatPasswordInputState, setRepeatPasswordInputState] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const submitHandler = async () => {
        if (!(state.login.value && state.username.value && state.password.value && state.repeatPassword.value)) {
            setError('You need to fill each field!')
            return
        }
        if (state.login.error || state.username.error || state.password.error || state.repeatPassword.error) {
            return
        }
        try {
            const response = await axios.post('/register', {
                name: state.username.value,
                login: state.login.value,
                password: state.password.value
            })
            const success = response.data as RegistrationResponse
            if (success.hasSucceeded) {
                toggleBlock()
            } else {
                setError('Error!')
            }
        } catch (e) {
            const response: string = (e as AxiosError).response?.data as string
            if (response) {
                setError(response)
            } else {
                setError('Error!')
            }
        }

    }

    const usernameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const regexResult = e.target.value.match(new RegExp(REGEXES.USERNAME))
        const res = regexResult ? regexResult.indexOf(e.target.value) !== -1 : false
        dispatch({type: TYPES.USERNAME, payload: e.target.value})
        if (!res) {
            dispatch({type: TYPES.USERNAME_ERROR, payload: ''})
        }
    }

    const loginChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const regexResult = e.target.value.match(new RegExp(REGEXES.LOGIN))
        const res = regexResult ? regexResult.indexOf(e.target.value) !== -1 : false
        dispatch({type: TYPES.LOGIN, payload: e.target.value})
        if (!res) {
            dispatch({type: TYPES.LOGIN_ERROR, payload: ''})
        }
    }

    const passwordChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const regexResult = e.target.value.match(new RegExp(REGEXES.PASSWORD))
        const res = regexResult ? regexResult.indexOf(e.target.value) !== -1 : false

        dispatch({type: TYPES.PASSWORD, payload: e.target.value})

        if (!res) {
            dispatch({type: TYPES.PASSWORD_ERROR, payload: ''})
        }

        console.log(state.repeatPassword.value, e.target.value)

        if (state.repeatPassword.value === e.target.value) {
            dispatch({type: TYPES.PASSWORD_REPEAT, payload: e.target.value})
        } else {
            dispatch({type: TYPES.PASSWORD_REPEAT_ERROR, payload: ''})
        }
    }

    const repeatPasswordChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({type: TYPES.PASSWORD_REPEAT, payload: e.target.value})
        if (state.password.value !== e.target.value) {
            dispatch({type: TYPES.PASSWORD_REPEAT_ERROR, payload: ''})
        }
    }

    const togglePassword = () => {
        setPasswordInputState(state => !state)
    }

    const toggleRepeatPassword = () => {
        setRepeatPasswordInputState(state => !state)
    }

    return (
        <form className='form_container__form' method='POST'>
            <div className="input_container">
                <input className='username' type="text" placeholder='Username' onChange={usernameChangeHandler}/>
                <Hint
                    text={'Your name that will be shown in chat. It can contain lowercase and upper case letters and whitespaces.'}/>
            </div>
            <p className='error'>{state.username.error}</p>
            <div className="input_container">
                <input className='login' type="text" placeholder='Login' onChange={loginChangeHandler}/>
                <Hint
                    text={'Login must be unique. It must contain at least 3 lowercase and uppercase letters, digits and symbols ".", "-", "_".'}/>
            </div>
            <p className='error'>{state.login.error}</p>
            <div className="input_container password">
                <div className="password_container">
                    <input className='password' type={passwordInputState ? "text" : "password"} placeholder='Password' onChange={passwordChangeHandler}/>
                    <div className={"toggler" + (passwordInputState ? " visible" : "")} onClick={() => togglePassword()}/>
                </div>
                <Hint
                    text={'Make your password as safe as possible. It must contain at least 8 lowercase and uppercase letters, digits and symbols ".", "-", "_".'}
                />
            </div>
            <p className='error'>{state.password.error}</p>
            <div className="input_container no-hint password">
                <div className="password_container">
                    <input className='password' type={repeatPasswordInputState ? "text" : "password"} placeholder='Repeat Password' onChange={repeatPasswordChangeHandler}/>
                    <div className={"toggler" + (repeatPasswordInputState ? " visible" : "")} onClick={() => toggleRepeatPassword()}/>
                </div>
            </div>
            <p className='error'>{state.repeatPassword.error}</p>
            {error && <><br/><p className='error'>{error}</p></>}
            <div className="btn_container">
                <DefaultButton text='Register' clickCallback={() => submitHandler()}/>
            </div>
        </form>
    );
};

export default RegisterForm;
