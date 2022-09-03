import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import FormError from "../../models/FormError";

const initialState: FormError = {
    isError: false,
    message: ''
}

export type LoginFormState = typeof initialState

const setErrorToDefaults = (state: LoginFormState) => {
    state.isError = initialState.isError
    state.message = initialState.message
}

export const loginFormSlice = createSlice({
    name: 'loginForm',
    initialState,
    reducers: {
        error(state, action: PayloadAction<string>) {
            state.isError = true
            state.message = action.payload
        },
        resetError(state) {
            setErrorToDefaults(state)
        }
    }
})

export default loginFormSlice.reducer