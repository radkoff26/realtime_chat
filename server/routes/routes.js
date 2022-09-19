import {ObjectId} from "bson"
import dbInfo from '../config.js'
import {User} from '../models/user.js'
import {generateId} from "../helpers/generator.js";
import Chat from '../models/chat.js'
import Message from '../models/message.js'
import sha from 'sha.js'

const constants = {
    CHAT_POSTFIX_DIRECTIVES: {
        CHAT_MESSAGES: '_chat', CHAT_PARTICIPANTS: '_participants'
    }
}

const serverError = 'Error has occured on the server side!'
const dataError = 'Too little data in the query!'
const authError = 'User is not authenticated!'

class ChatForList {
    constructor(chat, number) {
        this.chatCode = chat.chatCode
        this.name = chat.name
        this.maxNumberOfParticipants = chat.participantsRestriction
        this.currentNumberOfParticipants = number ?? 0
        this.language = chat.language
    }
}

async function dbIncludesCollection(db, collectionName) {
    const collections = await db.collections()
    return collections.filter(value => value.collectionName === collectionName).length > 0
}

function encode(s) {
    return sha('sha256').update(s).digest('hex')
}

async function isUserAuthorized(db, id, passwordHashed) {
    const users = db.collection('users')

    const user = await users.findOne({_id: new ObjectId(id)})

    if (!user) {
        return false
    }

    const userPasswordHashed = encode(user.password)

    return userPasswordHashed === passwordHashed
}

export default function (app, db) {
    app.get('/', (req, res) => {
        res.send("Hello World!")
    })
    // RegisterForm: POST {name, login, password} => {hasSucceeded}
    app.post('/api/register', async (req, res) => {
        const user = new User(req.body.name, req.body.login, req.body.password, 0)
        const users = db.db(dbInfo.db).collection('users')
        try {
            const response = await users.findOne({login: user.login})
            if (response !== null) {
                res.status(400).json('User with such login already exists!')
            } else {
                const result = await users.insertOne(user)
                if (result.acknowledged) {
                    res.json({hasSucceeded: true})
                } else {
                    res.json({hasSucceeded: false})
                }
            }
        } catch (e) {
            res.status(500).send(serverError)
        }
    })
    // LoginForm: POST {login, password} => {isLoggedIn, id, name, login}
    app.post('/api/login', async (req, res) => {
        const user = new User(null, req.body.login, req.body.password, Date.now().toString())
        const users = db.db(dbInfo.db).collection('users')
        try {
            const findResponse = await users.findOne({login: user.login, password: user.password})
            if (findResponse === null) {
                res.json({isLoggedIn: false})
            } else {
                users.updateOne({login: user.login}, {$set: {lastLogin: user.lastLogin}})
                res.json({
                    isLoggedIn: true, id: findResponse._id.toHexString(), name: findResponse.name
                })
            }
        } catch (e) {
            res.status(500).send(serverError)
        }
    })
    // Create new chat: POST {chatName, adminId, isPublic, restriction, language, p (stands for received hashed password)}
    app.post('/api/createChat', async (req, res) => {
        const chatName = req.body.chatName
        const adminId = req.body.adminId
        const restriction = req.body.restriction
        const isPublic = req.body.isPublic
        const language = req.body.language
        const passwordHashed = req.body.p

        if (chatName && adminId && restriction && (typeof isPublic === 'boolean') && language) {
            const database = db.db(dbInfo.db)

            if (!(await isUserAuthorized(database, adminId, passwordHashed))) {
                res.status(403).send(authError)
                return
            }

            let chatCode = generateId()
            while (await dbIncludesCollection(database, chatCode)) {
                chatCode = generateId()
            }
            await database.createCollection(chatCode + constants.CHAT_POSTFIX_DIRECTIVES.CHAT_MESSAGES)
            await database.createCollection(chatCode + constants.CHAT_POSTFIX_DIRECTIVES.CHAT_PARTICIPANTS)

            const chats = database.collection('chats')

            const chat = new Chat(chatCode, chatName, adminId, +restriction, isPublic, language)
            try {
                await chats.insertOne(chat)
                res.status(200).send('OK')
            } catch (e) {
                res.status(500).send(e.message)
            }
        } else {
            res.status(400).send(dataError)
        }
    })
    // Get all chats created by user: GET {id, password}
    app.get('/api/getOwnersChatsById', async (req, res) => {
        const id = req.query.id
        const password = req.query.password

        if (id && password) {
            const database = db.db(dbInfo.db)

            try {
                if (await isUserAuthorized(database, id, password)) {
                    const cursor = database.collection('chats').find({adminId: id})
                    let chats = await cursor.toArray()
                    for (let i = 0; i < chats.length;) {
                        const chat = chats[i]
                        const collectionName = chat.chatCode + constants.CHAT_POSTFIX_DIRECTIVES.CHAT_PARTICIPANTS
                        if (await dbIncludesCollection(database, collectionName)) {
                            chats[i].currentNumberOfParticipants = await database.collection(collectionName).countDocuments({isPending: false})
                            i++
                        } else {
                            chats.splice(i, 1)
                        }
                    }
                    res.status(200).json(chats)
                } else {
                    res.status(403).send(authError)
                }
            } catch (e) {
                res.status(500).send(serverError)
            }

        } else {
            res.status(400).send(dataError)
        }
    })
    // Get all messages by chat code: GET {code}
    app.get('/api/getAllMessagesByChatCode', async (req, res) => {
        const code = req.query.code
        if (code) {
            try {
                const database = db.db(dbInfo.db)
                if (!(await dbIncludesCollection(database, code + constants.CHAT_POSTFIX_DIRECTIVES.CHAT_MESSAGES))) {
                    res.status(404).send('Not found!')
                    return
                }
                let cursor = database.collection(code + constants.CHAT_POSTFIX_DIRECTIVES.CHAT_MESSAGES).find({})
                const messages = await cursor.toArray()
                const users = await database.collection('users')

                const map = new Map()

                for (const message of messages) {
                    if (!map.has(message.userId)) {
                        const user = await users.findOne({_id: new ObjectId(message.userId)})
                        map.set(message.userId, user.name)
                    }
                }

                for (let i = 0; i < messages.length; i++) {
                    messages[i].messageId = messages[i]._id.toHexString()
                    messages[i].userName = map.get(messages[i].userId)
                }

                res.status(200).json(messages)
            } catch {
                res.status(500).send(serverError)
            }
        } else {
            res.status(400).send(dataError)
        }
    })
    // Get chat by its code: GET {code}
    app.get('/api/getChatByCode', async (req, res) => {
        const code = req.query.code
        if (code) {
            try {
                const database = db.db(dbInfo.db)
                if (!(await dbIncludesCollection(database, code + constants.CHAT_POSTFIX_DIRECTIVES.CHAT_MESSAGES))) {
                    res.status(404).send('Not found!')
                    return
                }
                const users = await database.collection('users')

                let cursor = database.collection(code + constants.CHAT_POSTFIX_DIRECTIVES.CHAT_MESSAGES).find({})
                const messages = await cursor.toArray()

                for (let i = 0; i < messages.length; i++) {
                    let user = await users.findOne({_id: new ObjectId(messages[i].userId)})
                    messages[i].userName = user.name
                    messages[i].messageId = messages[i]._id.toHexString()
                }

                cursor = database.collection(code + constants.CHAT_POSTFIX_DIRECTIVES.CHAT_PARTICIPANTS).find({})
                const participants = await cursor.toArray()

                for (let i = 0; i < participants.length; i++) {
                    let user = await users.findOne({_id: new ObjectId(participants[i].id)})
                    participants[i].name = user.name
                }

                let chat = await database.collection('chats').findOne({chatCode: code})

                res.status(200).json({messages, participants, adminId: chat.adminId, name: chat.name, restriction: chat.participantsRestriction})
            } catch (e) {
                res.status(500).send(serverError)
                throw e
            }
        } else {
            res.status(400).send(dataError)
        }
    })
    // Get all participants by chat code: GET {code}
    app.get('/api/getAllParticipantsByChatCode', async (req, res) => {
        const code = req.query.code
        if (code) {
            try {
                const database = db.db(dbInfo.db)
                if (!(await dbIncludesCollection(database, code + constants.CHAT_POSTFIX_DIRECTIVES.CHAT_PARTICIPANTS))) {
                    res.status(404).send('Not found!')
                    return
                }
                let cursor = database.collection(code + constants.CHAT_POSTFIX_DIRECTIVES.CHAT_PARTICIPANTS).find({})
                const participants = await cursor.toArray()

                const users = await database.collection('users')

                for (let i = 0; i < participants.length; i++) {
                    let user = await users.findOne({_id: new ObjectId(participants[i].id)})
                    participants[i].name = user.name
                }

                res.status(200).json(participants)
            } catch {
                res.status(500).send(serverError)
            }
        } else {
            res.status(400).send(dataError)
        }
    })
    // Check if user is admin of server: GET {code, userId}
    app.get('/api/isUserAdmin', async (req, res) => {
        const code = req.query.code
        const userId = req.query.userId
        if (code && userId) {
            try {
                const database = db.db(dbInfo.db)

                const chat = await database.collection('chats').findOne({chatCode: code})

                if (userId === chat.adminId) {
                    res.status(200).json({isAdmin: true})
                } else {
                    res.status(200).json({isAdmin: false})
                }
            } catch {
                res.status(500).send(serverError)
            }
        } else {
            res.status(400).send(dataError)
        }
    })
}