export default function(code, name, adminId, maxNumberOfParticipants = 32, isPublic, language) {
    this.chatCode = code
    this.name = name
    this.adminId = adminId
    this.maxNumberOfParticipants = maxNumberOfParticipants
    this.isPublic = isPublic
    this.language = language
}