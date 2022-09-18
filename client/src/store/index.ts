import {combineReducers, configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice'
import loginFormReducer from './slices/loginFormSlice'
import chatsListReducer from './slices/chatsListSlice'
import chatReducer from './slices/chatSlice'
import {deleteCookies, refreshCookies, setStorageData} from "./middleware/userMiddleware";
import {callbackWithDispatch} from "./middleware/defaultMiddleware";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
    userReducer,
    loginFormReducer,
    chatsListReducer,
    chatReducer
})

export const store = () => (
    configureStore({
        reducer: rootReducer,
        middleware: [
            thunk,
            callbackWithDispatch,
            setStorageData,
            refreshCookies,
            deleteCookies
        ]
    })
)

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof store>
export type AppDispatch = AppStore['dispatch']