import React, {useEffect} from 'react';
import myChatsStyles from '../scss/pages/my_chats.module.scss'
import formStyles from '../scss/components/form.module.scss'
import Title from "../components/design/Title";
import ChatsList from "../components/business/ChatsList";
import {getOwnersChats} from "../store/actions/chatsListActions";
import Cookie from "../models/Cookie";
import constants from "../constants";
import {useAppSelector} from "../hooks/UseAppSelector";
import {useAppDispatch} from "../hooks/UseAppDispatch";
import {chatsListSlice} from "../store/slices/chatsListSlice";
import Loader from "../components/design/Loader";
import isUserAuthorized from "../modules/IsUserAuthorized";
import {useNavigate} from "react-router-dom";

// TODO: make circle around participants that will be displaying how much place is taken
const MyChatsPage = () => {
    const dispatch = useAppDispatch()
    const selector = useAppSelector(state => state.chatsListReducer)
    const navigate = useNavigate()

    useEffect(() => {
        if (isUserAuthorized()) {
            dispatch(chatsListSlice.actions.loading())
            dispatch(getOwnersChats(
                Cookie.getCookie(constants.COOKIE.ID) ?? '',
                Cookie.getCookie(constants.COOKIE.PASSWORD) ?? ''
            ) as unknown as any)
        } else {
            navigate('/auth')
        }
    }, [dispatch, navigate])

    return (
        <div className={myChatsStyles.my_chats}>
            <Title text='Your Chats'/>
            {selector.isLoading && <Loader/>}
            {selector.error ? <h2 className={formStyles.error}>{selector.error}</h2> :
                <ChatsList
                    list={selector.list}
                    isLoaded={selector.isLoading}
                    textIfEmpty={'You have no chats yet...'}
                />
            }
        </div>
    );
};

export default MyChatsPage;