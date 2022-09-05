import React, {Reducer, useEffect, useReducer} from 'react';
import {useAppSelector} from "../hooks/UseAppSelector";
import Hint from "../components/design/Hint";
import Switch from "../components/design/Switch";
import DefaultButton from "../components/design/DefaultButton";
import isUserAuthorized from "../modules/IsUserAuthorized";
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../hooks/UseAppDispatch";
import createChatStyles from '../scss/pages/create_chat.module.scss'
import formStyles from '../scss/components/form.module.scss'
import Title from "../components/design/Title";
import {authSlice} from "../store/slices/userSlice";
import createChat, {CreateChatRequestData} from "../modules/CreateChatRequest";
import Cookie from "../modules/Cookie";
import constants from "../constants";

interface ChatInputState {
    chatName: string
    restriction: number
    isPublic: boolean
    error: string
}

const DEFAULT_RESTRICTION_MIN = 2
const DEFAULT_RESTRICTION_MAX = 32

const SET_CHAT_NAME = 'SET_CHAT_NAME'
const SET_RESTRICTION = 'SET_RESTRICTION'
const SET_PUBLIC = 'SET_PUBLIC'
const ERROR = 'ERROR'

type SET_CHAT_NAME_TYPE = typeof SET_CHAT_NAME
type SET_RESTRICTION_TYPE = typeof SET_RESTRICTION
type SET_PUBLIC_TYPE = typeof SET_PUBLIC
type ERROR_TYPE = typeof ERROR

interface StringAction {
    type: SET_CHAT_NAME_TYPE | ERROR_TYPE
    payload: string
}

interface NumberAction {
    type: SET_RESTRICTION_TYPE
    payload: number
}

interface BooleanAction {
    type: SET_PUBLIC_TYPE
    payload: boolean
}

type CommonAction = StringAction | NumberAction | BooleanAction

const setChatName = (s: string): StringAction => ({type: SET_CHAT_NAME, payload: s})
const setError = (s: string): StringAction => ({type: ERROR, payload: s})
const setRestriction = (n: number): NumberAction => ({type: SET_RESTRICTION, payload: n})
const setPublic = (f: boolean): BooleanAction => ({type: SET_PUBLIC, payload: f})

const reducer: Reducer<ChatInputState, CommonAction> = (state, action): ChatInputState => {
    switch (action.type) {
        case SET_CHAT_NAME:
            return {...state, chatName: action.payload}
        case SET_RESTRICTION:
            return {...state, restriction: action.payload}
        case SET_PUBLIC:
            return {...state, isPublic: action.payload}
        case ERROR:
            return {...state, error: action.payload}
        default:
            return state
    }
}

const initialState: ChatInputState = {
    chatName: '',
    restriction: 2,
    isPublic: false,
    error: ''
}

const CreateChatPage = () => {
    const userSelector = useAppSelector(state => state.userReducer)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [state, localDispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        if (!isUserAuthorized()) {
            navigate('/auth')
            if (userSelector.isLoggedIn) {
                dispatch(authSlice.actions.logout())
            }
        }
    }, [dispatch, navigate, userSelector])

    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        localDispatch(setChatName(e.target.value))
    }

    const handleRestriction = (e: React.ChangeEvent<HTMLInputElement>) => {
        const restriction = +e.target.value
        if (restriction === 0) {
            e.target.value = ''
        } else if (restriction > 32) {
            e.target.value = DEFAULT_RESTRICTION_MAX.toString()
        } else if (restriction < 2) {
            e.target.value = DEFAULT_RESTRICTION_MIN.toString()
        }
        localDispatch(setRestriction(+e.target.value))
    }

    // TODO: navigate user right to the chat when chat is created
    const handleSubmit = () => {
        if (state.chatName && state.restriction && isUserAuthorized()) {
            createChat({
                    ...(state as unknown as CreateChatRequestData),
                    adminId: Cookie.getCookie(constants.COOKIE.ID) ?? '',
                    p: Cookie.getCookie(constants.COOKIE.PASSWORD) ?? '',
                    language: navigator.language
                }
            )
                .then(() => navigate('/'))
                .catch(() => {
                    localDispatch(setError('Some error has occured!'))
                })
        } else {
            localDispatch(setError('Do not leave fields blank!'))
        }
    }

    return (
        <div className={createChatStyles.create_chat + " " + formStyles.form_container}>
            <Title text='Create Chat'/>
            <form className={formStyles.form_container__form}>
                <input type="text" placeholder='Chat Name'
                       onChange={handleName}/>
                <div className={formStyles.input_container}>
                    <input type="number" placeholder='Restriction'
                           onChange={handleRestriction} defaultValue={2}/>
                    <Hint text='Restriction of participants must be in the range from 2 to 32!'/>
                </div>
                <Switch label='Public Chat' callback={() => setPublic(!state.isPublic)}/>
                {state.error && <p className={formStyles.error}>{state.error}</p>}
                <div className={formStyles.btn_container}>
                    <DefaultButton text='Create' clickCallback={() => handleSubmit()}/>
                </div>
            </form>
        </div>
    );
};

export default CreateChatPage;