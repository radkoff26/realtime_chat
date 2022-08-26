import React, {useEffect, useLayoutEffect} from 'react';
import WarningButton from "../components/design/WarningButton";
import Title from "../components/design/Title";
import ButtonLink from "../components/design/ButtonLink";
import '../scss/pages/main.scss'
import {useAppDispatch} from "../hooks/UseAppDispatch";
import {authSlice} from "../store/slices/authSlice";
import {useAppSelector} from "../hooks/UseAppSelector";
import {useNavigate} from "react-router-dom";

const MainPage = () => {
    const dispatch = useAppDispatch()
    const selector = useAppSelector(state => state.authReducer)
    const navigate = useNavigate()

    useLayoutEffect(() => {
        if (!selector.isLoggedIn){
            navigate('/auth')
        }
    }, [])

    useEffect(() => {
        if (!selector.isLoggedIn){
            navigate('/auth')
        }
    }, [selector, dispatch])

    return (
        <div className='main_page'>
            <div className="main_page__logout">
                <WarningButton text={'Logout'} clickCallback={() => dispatch(authSlice.actions.logout())}/>
            </div>
            <Title text={`Hi, ${selector.name}! Isn’t it time to chat?`}/>
            <div className="main_page__links">
                <ButtonLink text={'Join Chat'} to={'#'}/>
                <ButtonLink text={'Create Chat'} to={'#'}/>
                <ButtonLink text={'Recent Chats'} to={'#'}/>
            </div>
        </div>
    );
};

export default MainPage;
