import axios from "../axios";

export interface CreateChatRequestData {
    chatName: string
    adminId: string
    isPublic: boolean
    restriction: number
    language: string
    p: string
}

export default async function createChat(data: CreateChatRequestData) {
    try {
        await axios.post('/createChat', data)
    } catch (e) {
        throw e
    }
}