import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Chat} from "../../models/Chat";

export interface ChatsListState {
    list: Chat[]
    isLoading: boolean
    error: string
}

const initialState: ChatsListState = {
    list: [],
    isLoading: false,
    error: ''
}

export const chatsListSlice = createSlice({
    name: 'chatsList',
    initialState,
    reducers: {
        loading(state) {
            state.isLoading = true
        },
        success(state, payload: PayloadAction<Chat[]>) {
            state.list = payload.payload
            state.isLoading = false
        },
        error(state, payload: PayloadAction<string>) {
            state.error = payload.payload
        },
        reset(state) {
            state.list = initialState.list
            state.isLoading = initialState.isLoading
            state.error = initialState.error
        }
    }
})

export default chatsListSlice.reducer