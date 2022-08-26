import axios from "../../axios";
import {AppDispatch} from "../index";
import {authSlice, LoginResponse, UserState} from '../slices/authSlice'
import {LoginError} from "../../models/models";

export function login(login: string, password: string) {
    return async (dispatch: AppDispatch) => {
        console.log(1)
        try {
            const response = await axios.post<LoginResponse>('/login', {login: login, password: password})
            console.log(2)
            console.log(login)
            console.log(password)
            if (response.data.hasOwnProperty('error')) {
                const errorResponse = response.data as unknown as LoginError
                dispatch(authSlice.actions.errorWhileLogin(errorResponse.message))
            } else {
                if (response.data.isLoggedIn) {
                    const loginResponse = response.data as unknown as UserState
                    console.log(loginResponse)
                    dispatch(authSlice.actions.successfulLogin(
                        {
                            id: loginResponse.id,
                            name: loginResponse.name,
                            login,
                            authToken: loginResponse.authToken
                        }
                    ))
                    console.log(3)
                } else {
                    dispatch(authSlice.actions.unsuccessfulLogin())
                    console.log(4)
                }
            }
        } catch (e) {
            dispatch(authSlice.actions.errorWhileLogin((e as Error).message))
        }
    }
}