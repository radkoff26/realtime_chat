import {AppDispatch} from "../index";
import axios from "../../modules/axios";
import {authSlice, LoginResponse} from "../slices/userSlice";
import {loginFormSlice} from "../slices/loginFormSlice";
import User from "../../models/User";

export const TYPES = {
    SET_STORAGE_DATA: 'SET_STORAGE_DATA',
    REFRESH_COOKIES: 'REFRESH_COOKIES',
    DELETE_COOKIES: 'DELETE_COOKIES'
}

export function login(login: string, password: string) {
    return async (dispatch: AppDispatch) => {
        try {
            const response = await axios.post<LoginResponse>('/login', {login: login, password: password})
            if (response.data.isLoggedIn) {
                const loginResponse = response.data as unknown as User
                dispatch(authSlice.actions.successfulLogin(
                        {
                            ...loginResponse,
                            login,
                            password
                        }
                    )
                )
                dispatch(loginFormSlice.actions.resetError())
            } else {
                dispatch(authSlice.actions.unsuccessfulLogin())
                dispatch(loginFormSlice.actions.error('Login or password are wrong!'))
            }
        } catch (e) {
            dispatch(authSlice.actions.unsuccessfulLogin())
            dispatch(loginFormSlice.actions.error((e as Error).message))
        } finally {
            dispatch({type: TYPES.SET_STORAGE_DATA})
        }
    }
}