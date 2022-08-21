import {combineReducers, configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'

const rootReducer = combineReducers({
    authReducer
})

export function store() {
    return configureStore({
        reducer: rootReducer
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof store>
export type AppDispatch = AppStore['dispatch']