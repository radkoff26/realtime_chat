import {ObjectId} from "bson"
import dbInfo from '../config.js'
import {User} from '../models/user.js'
import {generateId, generateToken} from "../helpers/generator.js";
import Chat from '../models/chat.js'
import Message from '../models/message.js'
import {dayPassed} from "../helpers/date_functions.js";
import message from "../models/message.js";

class Error {
    constructor(message) {
        this.isLoggedIn = false
        this.error = true
        this.message = message
    }
}

function execute(callback, onError) {
    try {
        callback()
    } catch (e) {
        onError(e)
    }
}

const executor = (res, callback) => {
    return execute(callback, (e) => {
        console.log(e);
        res.json(new Error(e.message))
    })
}

async function dbIncludesCollection(db, collectionName) {
    const collections = await db.collections()
    return collections.filter(value => value.collectionName === collectionName).length > 0
}


export default function (app, db) {
    app.get('/', (req, res) => {
        res.send("Hello World!")
    })
    // Register: POST {name, login, password}
    app.post('/api/register', async (req, res) => {
        const user = new User(req.body.name, req.body.login, req.body.password, '', 0)
        const users = db.db(dbInfo.db).collection('users')
        executor(res, async () => {
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
        })
    })
    // Login: POST {login, password} => {isLoggedIn, id, authToken, name, login} | Error
    app.post('/api/login', async (req, res) => {
        const user = new User(null, req.body.login, req.body.password, generateToken(), Date.now().toString())
        const users = db.db(dbInfo.db).collection('users')
        executor(res, async () => {
            const findResponse = await users.findOne({login: user.login, password: user.password})
            if (findResponse === null) {
                res.json({isLoggedIn: false, authToken: '', id: '', name: '', login: ''})
            } else {
                users.updateOne({login: user.login}, {$set: {authToken: user.authToken, lastLogin: user.lastLogin}})
                res.json({
                    isLoggedIn: true,
                    authToken: user.authToken,
                    id: findResponse._id.toHexString(),
                    name: findResponse.name,
                    login: findResponse.login
                })
            }
        })
    })
    // Refresh: POST {id}
    app.post('/api/refresh', async (req, res) => {
        const id = req.body.id
        const users = db.db(dbInfo.db).collection('users')
        try {
            const response = await users.findOne({_id: new ObjectId(id)})
            if (response === null) {
                res.json({error: true, message: 'User Not Found!'})
            } else {
                res.json({authToken: response.authToken})
            }
        } catch (e) {
            console.log(e)
            res.json(new Error(e.message))
        }
    })
    // Create new chat: POST {chatName, adminId, restriction, authToken} => {success: boolean} | Error
    app.post('/api/createChat', async (req, res) => {
        const chatName = req.body.chatName
        const adminId = req.body.adminId
        const restriction = req.body.restriction
        const authToken = req.body.authToken

        if (chatName && adminId && restriction) {
            const database = db.db(dbInfo.db)

            let chatCode = generateId()
            while (await dbIncludesCollection(database, chatCode)) {
                chatCode = generateId()
            }
            await database.createCollection(chatCode)

            const chats = database.collection('chats')
            const user = await database.collection('users').findOne({'_id': new ObjectId(adminId)})
            if (user !== null) {
                if (user.authToken === authToken) {
                    res.json(new Error('User is not authenticated!'))
                } else {
                    const chat = new Chat(chatCode, chatName, adminId, +restriction)
                    try {
                        await chats.insertOne(chat)
                        res.json({success: true})
                    } catch (e) {
                        console.log(e.message)
                        res.json(new Error(e.message))
                    }
                }
            } else {
                res.json(new Error('There is no such user!'))
            }
        } else {
            res.json(new Error('Too little data in the query!'))
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