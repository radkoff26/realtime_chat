import React, {useEffect} from 'react';
import WarningButton from "../components/design/WarningButton";
import Title from "../components/design/Title";
import ButtonLink from "../components/design/ButtonLink";
import '../scss/pages/main.scss'
import {useAppDispatch} from "../hooks/UseAppDispatch";
import {authSlice} from "../store/slices/userSlice";
import {useAppSelector} from "../hooks/UseAppSelector";
import {useNavigate} from "react-router-dom";
import {TYPES} from "../store/actions/userActions";
import isUserAuthorized from "../modules/IsUserAuthorized";

const MainPage = () => {
    const dispatch = useAppDispatch()
    const selector = useAppSelector(state => state.userReducer)
    const navigate = useNavigate()

    useEffect(() => {
        if (!isUserAuthorized()){
            navigate('/auth')
            if (selector.isLoggedIn) {
                dispatch(authSlice.actions.logout())
            }
        }
    }, [selector, dispatch])

    const logoutClickHandler = () => {
        dispatch(authSlice.actions.logout())
        dispatch({type: TYPES.SET_STORAGE_DATA})
    }

    return (
        <div className='main_page'>
            <div className="main_page__logout">
                <WarningButton text={'Logout'} clickCallback={() => logoutClickHandler()}/>
            </div>
            <Title text={`Hi, ${selector.name}! Isn’t it time to chat?`}/>
            <div className="main_page__links">
                <ButtonLink text={'Join Chat'} to={'#'}/>
                <ButtonLink text={'Create Chat'} to={'/createChat'}/>
                <ButtonLink text={'My Chats'} to={'/myChats'}/>
            </div>
        </div>
    );
};

export default MainPage;
