import {AppDispatch} from "../index";
import axios from "../../modules/axios";
import {chatSlice, ChatState, Participant} from "../slices/chatSlice";
import Message from "../../models/Message";

interface ChatResponse {
    name: string
    adminId: string
    participants: Participant[]
    messages: Message[]
}

interface IsUserAdminResponse {
    isAdmin: boolean
}

export const loadData = (code: string, userId: string) => {
    return async (dispatch: AppDispatch) => {
        try {
            const response = await axios.get<ChatResponse>("/getChatByCode", {params: {code, userId}})

            if (response) {
                dispatch(chatSlice.actions.onDataLoaded(response.data as unknown as ChatState))
            } else {
                dispatch(chatSlice.actions.onError("Error!"))
            }
        } catch {
            dispatch(chatSlice.actions.onError("Error!"))
        }
    }
}

export const updateMessages = (code: string) => {
    return async (dispatch: AppDispatch) => {
        try {
            const response = await axios.get<Message[]>("/getAllMessagesByChatCode", {params: {code}})

            if (response) {
                dispatch(chatSlice.actions.onMessagesUpdated(response.data))
            } else {
                dispatch(chatSlice.actions.onError("Error!"))
            }
        } catch {
            dispatch(chatSlice.actions.onError("Error!"))
        }
    }
}

export const updateParticipants = (code: string) => {
    return async (dispatch: AppDispatch) => {
        try {
            const response = await axios.get<Participant[]>("/getAllParticipantsByChatCode", {params: {code}})

            if (response) {
                dispatch(chatSlice.actions.onParticipantsUpdated(response.data))
            } else {
                dispatch(chatSlice.actions.onError("Error!"))
            }
        } catch {
            dispatch(chatSlice.actions.onError("Error!"))
        }
    }
}