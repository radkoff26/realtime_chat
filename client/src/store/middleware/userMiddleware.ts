import constants from "../../constants";
import Cookie from "../../models/Cookie";
import {UserState} from "../slices/userSlice";
import {Middleware} from "@reduxjs/toolkit";
import {TYPES} from "../actions/userActions";

export const setStorageData: Middleware = ({getState, dispatch}) => (next) => (action) => {
    if (typeof action !== 'function' && action.type === TYPES.SET_STORAGE_DATA) {
        const state = getState().userReducer as UserState
        if (state.isLoggedIn) {
            localStorage.setItem(constants.LOCAL_STORAGE.NAME, state.name)
            localStorage.setItem(constants.LOCAL_STORAGE.LOGIN, state.login)
            Cookie.setCookie(constants.COOKIE.ID, state.id, 300)
            Cookie.setCookie(constants.COOKIE.PASSWORD, state.password, 300)
        } else {
            localStorage.setItem(constants.LOCAL_STORAGE.NAME, '')
            localStorage.setItem(constants.LOCAL_STORAGE.LOGIN, '')
            Cookie.deleteCookie(constants.COOKIE.ID)
            Cookie.deleteCookie(constants.COOKIE.PASSWORD)
        }
    } else {
        next(action)
    }
}

export const refreshCookies: Middleware = ({getState, dispatch}) => (next) => (action) => {
    if (typeof action !== 'function' && action.type === TYPES.REFRESH_COOKIES) {
        const state = getState().userReducer as UserState
        Cookie.setCookie(constants.COOKIE.ID, state.id, 300)
        Cookie.setCookie(constants.COOKIE.PASSWORD, state.password, 300)
    } else {
        next(action)
    }
}

export const deleteCookies: Middleware = ({getState, dispatch}) => (next) => (action) => {
    if (typeof action !== 'function' && action.type === TYPES.DELETE_COOKIES) {
        Cookie.deleteCookie(constants.COOKIE.ID)
        Cookie.deleteCookie(constants.COOKIE.PASSWORD)
    } else {
        next(action)
    }
}