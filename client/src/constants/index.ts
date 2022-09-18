const constants = {
    LOCAL_STORAGE: {
        LOGIN: 'LOGIN',
        NAME: 'NAME'
    },
    COOKIE: {
        ID: 'i',
        PASSWORD: 'p'
    },
    TIME: {
        DAY: 86400,
        WEEK: 604800
    },
    CHAT_POSTFIX_DIRECTIVES: {
        CHAT_MESSAGES: '_chat',
        CHAT_PARTICIPANTS: '_participants',
    },
    EVENTS: {
        SERVER: {
            CONNECTION: 'connection',
            JOIN: 'join',
            SEND_MESSAGE: 'send_message',
            ACCEPT_USER: 'accept_user',
            DISCONNECT: 'disconnect'
        },
        CLIENT: {
            CONNECT: 'connect',
            NEW_JOIN: 'new_join',
            JOINED: 'joined',
            NEW_MESSAGE: 'new_message',
            DISCONNECTED: 'disconnected'
        }
    }
}

export default constants