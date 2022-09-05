import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import constants from '../../constants'
import Cookie from "../../modules/Cookie";
import encode from "../../modules/sha";
import User from "../../models/User";

export type LoginResponse = {isLoggedIn: boolean} & User

const initialState = (): User & {isLoggedIn: boolean} => ({
    id: Cookie.getCookie(constants.COOKIE.ID) ?? '',
    name: localStorage.getItem(constants.LOCAL_STORAGE.NAME) ?? '',
    login: localStorage.getItem(constants.LOCAL_STORAGE.LOGIN) ?? '',
    isLoggedIn: Boolean(Cookie.getCookie(constants.COOKIE.ID)),
    password: Cookie.getCookie(constants.COOKIE.PASSWORD) ?? ''
})

export type UserState = ReturnType<typeof initialState>

const setDefaults = (state: UserState) => {
    state.id = ''
    state.name = ''
    state.login = ''
    state.isLoggedIn = false
    state.password = ''
}

export const authSlice = createSlice({
    name: 'user',
    initialState: initialState(),
    reducers: {
        successfulLogin(state, payload: PayloadAction<User>) {
            state.id = payload.payload.id
            state.name = payload.payload.name
            state.login = payload.payload.login
            state.isLoggedIn = true
            state.password = encode(payload.payload.password)
        },
        unsuccessfulLogin(state) {
            state.isLoggedIn = false
        },
        logout(state) {
            setDefaults(state)
        }
    }
})

export default authSlice.reducer