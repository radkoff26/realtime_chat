import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {LoginError} from "../../models/models";
import constants from '../../constants/constants'

export interface UserState {
    id: string
    name: string
    login: string
    authToken: string
}

export type LoginResponse = {isLoggedIn: boolean} & (UserState | LoginError)

const initialState = (): UserState & LoginError & {isLoggedIn: boolean} => ({
    id: localStorage.getItem(constants.LOCAL_STORAGE.ID) ?? '',
    name: localStorage.getItem(constants.LOCAL_STORAGE.NAME) ?? '',
    login: localStorage.getItem(constants.LOCAL_STORAGE.LOGIN) ?? '',
    isLoggedIn: localStorage.getItem(constants.LOCAL_STORAGE.IS_LOGGED_IN) ? Boolean(localStorage.getItem(constants.LOCAL_STORAGE.IS_LOGGED_IN)) : false,
    authToken: localStorage.getItem(constants.LOCAL_STORAGE.AUTH_TOKEN) ?? '',
    error: false,
    message: ""
})

const setDefaults = (state: ReturnType<typeof initialState>) => {
    state.id = ''
    state.name = ''
    state.login = ''
    state.isLoggedIn = false
    state.authToken = ''
    state.error = false
    state.message = ''
}

const setStorageData = (state: ReturnType<typeof initialState>) => {
    if (state.isLoggedIn) {
        localStorage.setItem(constants.LOCAL_STORAGE.ID, state.id)
        localStorage.setItem(constants.LOCAL_STORAGE.NAME, state.name)
        localStorage.setItem(constants.LOCAL_STORAGE.LOGIN, state.login)
        localStorage.setItem(constants.LOCAL_STORAGE.IS_LOGGED_IN, '1')
        localStorage.setItem(constants.LOCAL_STORAGE.AUTH_TOKEN, state.authToken)
    } else {
        localStorage.setItem(constants.LOCAL_STORAGE.ID, '')
        localStorage.setItem(constants.LOCAL_STORAGE.NAME, '')
        localStorage.setItem(constants.LOCAL_STORAGE.LOGIN, '')
        localStorage.setItem(constants.LOCAL_STORAGE.IS_LOGGED_IN, '')
        localStorage.setItem(constants.LOCAL_STORAGE.AUTH_TOKEN, '')
    }
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState(),
    reducers: {
        successfulLogin(state, payload: PayloadAction<UserState>) {
            state.isLoggedIn = true
            state.name = payload.payload.name
            state.login = payload.payload.login
            state.authToken = payload.payload.authToken
            state.id = payload.payload.id
            state.error = false
            state.message = ''
            setStorageData(state)
        },
        unsuccessfulLogin(state) {
            state.isLoggedIn = false
            state.error = true
            state.message = 'Login or password are wrong!'
            setStorageData(state)
        },
        errorWhileLogin(state, error: PayloadAction<string>) {
            state.isLoggedIn = false
            state.error = true
            state.message = error.payload
            setStorageData(state)
        },
        resetError(state) {
            state.error = false
            state.message = ''
            setStorageData(state)
        },
        logout(state) {
            console.log(123)
            setDefaults(state)
            setStorageData(state)
        }
    }
})

export default authSlice.reducer