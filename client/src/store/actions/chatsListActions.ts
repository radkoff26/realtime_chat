import {AppDispatch} from "../index";
import axios from "../../modules/axios";
import {chatsListSlice} from "../slices/chatsListSlice";
import {AxiosError} from "axios";
import {Chat} from "../../models/Chat";

export const getOwnersChats = (id: string, password: string) => {
    return async (dispatch:AppDispatch) => {
        try {
            const data = await axios.get<Chat[]>('/getOwnersChatsById', {params: {id, password}})
            dispatch(chatsListSlice.actions.success(data.data))
        } catch (e) {
            dispatch(chatsListSlice.actions.error((e as AxiosError).response?.data as string))
        }
    }
}