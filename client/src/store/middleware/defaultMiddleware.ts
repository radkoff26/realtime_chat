import {Middleware} from "@reduxjs/toolkit";

export const callbackWithDispatch: Middleware = ({getState, dispatch}) => (next) => (action) => {
    if (typeof action === 'function') {
        action(dispatch)
    } else {
        next(action)
    }
}