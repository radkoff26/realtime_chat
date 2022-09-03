export interface Chat extends ChatInList {
    adminId: string
    isPublic: boolean
}

export interface ChatInList {
    chatCode: string
    name: string
    maxNumberOfParticipants: number
    language: string
}