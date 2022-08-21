import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface UserState {
    login: string
    isLoggedIn: boolean
    error: string
}

const initialState: UserState = {
    login: '',
    isLoggedIn: false,
    error: ''
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        successfulLogin(state, login: PayloadAction<string>) {
            state.isLoggedIn = true
            state.login = login.payload
            state.error = ''
        },
        unsuccessfulLogin(state) {
            state.isLoggedIn = false
            state.error = 'Login or password are wrong!'
        },
        errorWhileLogin(state, error: PayloadAction<string>) {
            state.isLoggedIn = false
            state.error = error.payload
        },
        resetError(state) {
            state.error = ''
        },
        logout(state) {
            state = {...initialState}
        }
    }
})

export default authSlice.reducer