export interface Chat {
    chatCode: string
    name: string
    currentNumberOfParticipants: number
    participantsRestriction: number
    language: string
    adminId: string
    isPublic: boolean
}