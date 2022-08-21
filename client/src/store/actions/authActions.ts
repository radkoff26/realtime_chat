import axios from "../../axios";
import {AppDispatch} from "../index";
import {LoginExodus} from "../../models/models";
import {authSlice} from '../slices/authSlice'

export function login(login: string, password: string) {
    return async (dispatch: AppDispatch) => {
        console.log(1)
        try {
            const response = await axios.post<LoginExodus>('/login', {login: login, password: password})
            console.log(2)
            console.log(login)
            console.log(password)
            if (response.data.isLoggedIn) {
                dispatch(authSlice.actions.successfulLogin(login))
                console.log(3)
            } else {
                dispatch(authSlice.actions.unsuccessfulLogin())
                console.log(4)
            }
        } catch (e) {
            dispatch(authSlice.actions.errorWhileLogin((e as Error).message))
        }
    }
}