import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import Message from "../../models/Message";

export interface Participant {
    id: string
    name: string
    isPending: boolean
}

export interface ChatState {
    name: string
    participants: Participant[]
    messages: Message[]
    adminId: string
    error: string
    isCurrentUserPending: boolean
    restriction: number
}

const initialState: ChatState = {
    name: '',
    participants: [],
    messages: [],
    adminId: '',
    error: '',
    isCurrentUserPending: true,
    restriction: 0
}

const setInitials = (state: ChatState) => {
    state.name = initialState.name
    state.participants = initialState.participants
    state.messages = initialState.messages
    state.adminId = initialState.adminId
    state.error = initialState.error
    state.isCurrentUserPending = initialState.isCurrentUserPending
    state.restriction = initialState.restriction
}

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        onDataLoaded(state, payload: PayloadAction<ChatState>) {
            state.name = payload.payload.name
            state.messages = payload.payload.messages
            state.participants = payload.payload.participants
            state.adminId = payload.payload.adminId
            state.restriction = payload.payload.restriction
            state.isCurrentUserPending = false
            state.error = ''
        },
        onError(state, payload: PayloadAction<string>) {
            state.error = payload.payload
        },
        onMessagesUpdated(state, payload: PayloadAction<Message[]>) {
            state.messages = payload.payload
            state.error = ''
        },
        onParticipantsUpdated(state, payload: PayloadAction<Participant[]>) {
            state.participants = payload.payload
            state.error = ''
        },
        onUserPending(state) {
            state.isCurrentUserPending = true
            state.error = ''
        },
        onLeavingChat(state) {
            setInitials(state)
        }
    }
})

export default chatSlice.reducer