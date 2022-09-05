import React, {ChangeEvent, useEffect, useState} from 'react';
import DefaultButton from "../design/DefaultButton";
import {useAppDispatch} from "../../hooks/UseAppDispatch";
import {login} from '../../store/actions/userActions'
import {useAppSelector} from "../../hooks/UseAppSelector";
import {loginFormSlice} from "../../store/slices/loginFormSlice";
import styles from '../../scss/components/form.module.scss'

// TODO: create another separate slice for login error
const LoginForm = () => {
    const dispatch = useAppDispatch()
    const [userLogin, setUserLogin] = useState('')
    const [password, setPassword] = useState('')
    const selector = useAppSelector(state => state.loginFormReducer)

    useEffect(() => {
        dispatch(loginFormSlice.actions.resetError())
    }, [dispatch])

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
        <form className={styles.form_container__form} method='POST'>
            <div className={styles.input_container + " " + styles.noHint}>
                <input type="text" defaultValue={userLogin} onChange={changeEventHandler(setUserLogin)} placeholder='Login'/>
            </div>
            <div className={styles.input_container + " " + styles.noHint}>
                <input className={styles.password} type="password" defaultValue={password} onChange={changeEventHandler(setPassword)} placeholder='Password'/>
            </div>
            {selector.isError && <p className={styles.error}>{selector.message}</p>}
            <div className={styles.btn_container}>
                <DefaultButton text='Login' clickCallback={() => clickHandler()}/>
            </div>
        </form>
    );
};

export default LoginForm;
