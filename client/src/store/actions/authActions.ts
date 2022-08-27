import axios from "../../axios";
import {AppDispatch} from "../index";
import {authSlice, LoginResponse, UserState} from '../slices/authSlice'
import {LoginError} from "../../models/models";

export function login(login: string, password: string) {
    return async (dispatch: AppDispatch) => {
        try {
            const response = await axios.post<LoginResponse>('/login', {login: login, password: password})
            if (response.data.hasOwnProperty('error')) {
                const errorResponse = response.data as unknown as LoginError
                dispatch(authSlice.actions.errorWhileLogin(errorResponse.message))
            } else {
                if (response.data.isLoggedIn) {
                    const loginResponse = response.data as unknown as UserState
                    dispatch(authSlice.actions.successfulLogin(
                        {
                            id: loginResponse.id,
                            name: loginResponse.name,
                            login,
                            authToken: loginResponse.authToken
                        }
                    ))
                } else {
                    dispatch(authSlice.actions.unsuccessfulLogin())
                }
            }
        } catch (e) {
            dispatch(authSlice.actions.errorWhileLogin((e as Error).message))
        }
    }
}