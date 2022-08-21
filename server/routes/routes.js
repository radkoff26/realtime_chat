import {ObjectId} from "bson"
import dbInfo from '../config.js'
import {User} from '../models/user.js'
import {generateId, generateToken} from "../helpers/generator.js";
import Chat from '../models/chat.js'
import Message from '../models/message.js'
import {dayPassed} from "../helpers/date_functions.js";

async function dbIncludesCollection(db, collectionName) {
    const collections = await db.collections()
    return collections.filter(value => value.collectionName === collectionName).length > 0
}

export default function (app, db) {
    app.get('/', (req, res) => {
        res.send("Hello World!")
    })
    // Register: POST {name, login, password}
    app.post('/api/register', (req, res) => {
        const user = new User(req.body.name, req.body.login, req.body.password, '', 0)
        const users = db.db(dbInfo.db).collection('users')
        users.findOne({login: user.login}, (err, result) => {
            if (err || result !== null) {
                res.send('Error!')
            } else {
                users.insertOne(user, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.send('Error!')
                    } else {
                        res.send(result)
                    }
                });
            }
        })
    })
    // Login: POST {login, password}
    app.post('/api/login', async (req, res) => {
        const user = new User(null, req.body.login, req.body.password, generateToken(), Date.now().toString())
        const users = db.db(dbInfo.db).collection('users')
        try {
            const findResponse = users.findOne({login: user.login, password: user.password})
            if (findResponse === null) {
                res.json({'isLoggedIn': false, 'authToken': ''})
            } else {
                users.updateOne({login: user.login}, {$set: {authToken: user.authToken, lastLogin: user.lastLogin}})
                res.json({'isLoggedIn': true, 'authToken': user.authToken})
            }
        } catch (err) {
            res.json({'isLoggedIn': false, 'authToken': ''})
            console.log(err)
        }
    })
    // Refresh: POST {id, authToken}
    app.post('/api/refresh', async (req, res) => {
        const id = req.body.id
        const authToken = req.body.authToken
        const users = db.db(dbInfo.db).collection('users')
        try {
            const response = await users.findOne({_id: new ObjectId(id)})
            if (response === null) {
                res.json({'error': true, 'message': 'User Not Found!'})
            } else {
                if (response.authToken === authToken) {
                    res.json({'needsRefresh': false})
                } else {
                    if (dayPassed(response.lastLogin)) {
                        res.json({'needsRefresh': true})
                    } else {
                        res.json({'needsRefresh': false, authToken: response.authToken})
                    }
                }
            }
        } catch (e) {
            console.log(e)
            res.json({'match': false})
        }
    })
    // Create new chat: POST {name, adminId, restriction}
    app.post('/api/createChat', async (req, res) => {
        const name = req.body.name
        const adminId = req.body.adminId
        const restriction = req.body.restriction
        if (name && adminId && restriction) {
            const database = db.db(dbInfo.db)

            let chatCode = generateId()
            while (await dbIncludesCollection(database, chatCode)) {
                chatCode = generateId()
            }
            await database.createCollection(chatCode)

            const chats = database.collection('chats')
            const user = await database.collection('users').findOne({'_id': new ObjectId(adminId)})
            if (user !== null) {
                const chat = new Chat(chatCode, name, adminId, +restriction)
                try {
                    await chats.insertOne(chat)
                } catch (e) {
                    console.log(e.message)
                }
                res.json('success')
            } else {
                res.json('error')
            }
        } else {
            res.json("error")
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