export function User(name, login, password, lastLogin, socketId, currentChatCode) {
    this.name = name
    this.login = login
    this.password = password
    this.lastLogin = lastLogin
    this.socketId = socketId
    this.currentChatCode = currentChatCode
}