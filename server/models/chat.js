export default function(code, name, adminId, participantsRestriction = 32, isPublic, language) {
    this.chatCode = code
    this.name = name
    this.adminId = adminId
    this.participantsRestriction = participantsRestriction
    this.isPublic = isPublic
    this.language = language
}