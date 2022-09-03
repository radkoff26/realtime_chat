import {ObjectId} from "bson"
import dbInfo from '../config.js'
import {User} from '../models/user.js'
import {generateId} from "../helpers/generator.js";
import Chat from '../models/chat.js'
import Message from '../models/message.js'
import sha from 'sha.js'

const constants = {
    CHAT_POSTFIX_DIRECTIVES: {
        CHAT_MESSAGES: '_chat',
        CHAT_PARTICIPANTS: '_participants'
    }
}

const serverError = 'Error has occured on the server side!'

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
                    isLoggedIn: true,
                    id: findResponse._id.toHexString(),
                    name: findResponse.name
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
                res.status(403).send('User is not authenticated!')
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
            res.status(400).send('Too little data in the query!')
        }
    })

    // Get chat by its code: GET {code}
    app.get('/api/getChatByCode', async (req, res) => {
        if (req.query.code) {
            const database = db.db(dbInfo.db)
            const chats = database.collection('chats')
            const chat = await chats.findOne({chatCode: req.query.code})
            if (chat) {
                res.json(chat)
            } else {
                res.json('error')
            }
        } else {
            res.json('error')
        }
    })
    // Get all message by chat code: GET {code}
    app.get('/api/getAllMessagesByChatCode', async (req, res) => {
        const code = req.query.code
        if (code) {
            const database = db.db(dbInfo.db)
            if (await dbIncludesCollection(database, code)) {
                const chat = await database.collection(code)
                const messages = chat.find({})
                res.json(messages)
            } else {
                res.json('error')
            }
        } else {
            res.json('error')
        }
    })
    // Send message: POST {chatCode, authorId, text}
    app.post('/api/sendMessage', async (req, res) => {
        const authorId = req.body.authorId
        const text = req.body.text
        const code = req.body.chatCode
        if (code && authorId && text) {
            const database = db.db(dbInfo.db)
            if (await dbIncludesCollection(database, code)) {
                const chat = await database.collection(code)
                const message = new Message(authorId, text, Date.now())
                await chat.insertOne(message)
                res.json('success')
            } else {
                console.log(2)
                res.json('error')
            }
        } else {
            console.log(1)
            res.json('error')
        }
    })
}