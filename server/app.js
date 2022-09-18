import express from 'express'
import http from 'http'
import {Server} from 'socket.io'
import {MongoClient} from 'mongodb'
import bodyParser from 'body-parser'
import setRouter from "./routes/routes.js";
import cors from 'cors'
import data from "./config.js"
import Participant from "./models/participant.js";
import {ObjectId} from "bson";
import Message from "./models/message.js";

const EVENTS_SERVER = {
    CONNECTION: 'connection',
    JOIN: 'join',
    SEND_MESSAGE: 'send_message',
    ACCEPT_USER: 'accept_user',
    DISCONNECT: 'disconnect'
}

const EVENTS_CLIENT = {
    NEW_JOIN: 'new_join',
    JOINED: 'joined',
    NEW_MESSAGE: 'new_message',
    DISCONNECTED: 'disconnected'
}

function updateUserSocketId(chatCode, userId, socketId, onSuccess) {
    MongoClient.connect(url, async (err, db) => {
        const database = db.db(data.db)
        const participants = await database.collection(chatCode + '_participants');
        const users = await database.collection('users');
        const chat = await database.collection('chats').findOne({chatCode})

        if (chat && userId) {
            await participants.insertOne(new Participant(userId, '', !chat.isPublic))

            const user = await users.findOne({_id: new Object(userId)})

            if (user.socketId) {

            }

            await users.updateOne({_id: new Object(userId)}, {$set: {currentChatCode: chatCode}})

            socket.join(chatCode)
            io.to(chatCode).emit("new_join")
            io.to(chatCode).emit("joined", {userId, flag: true})
        } else {
            io.to(chatCode).emit("joined", {userId: '', flag: false})
        }
    })
}

async function dbIncludesCollection(db, collectionName) {
    const collections = await db.collections()
    return collections.filter(value => value.collectionName === collectionName).length > 0
}

const app = express();
const server = http.createServer(app);

const port = 8000

const url = 'mongodb://localhost:27017';

const io = new Server(server, {
    cors: "*/*"
});

app.use(cors({
    origin: '*'
}))

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

MongoClient.connect(url, (err, db) => {
    if (err) console.log(err)
    setRouter(app, db)
    server.listen(port, () => {
        console.log('Server has been run on port', port)
    })
})

io.on(EVENTS_SERVER.CONNECTION, (socket) => {
    console.log('Connected')
    console.log(socket.id)

    socket.on(EVENTS_SERVER.JOIN, (chatCode, userId) => {
        console.log('Join!')
        MongoClient.connect(url, async (err, db) => {
            const database = db.db(data.db)
            const participants = await database.collection(chatCode + '_participants');
            const users = await database.collection('users');
            const chat = await database.collection('chats').findOne({chatCode})

            if (chat && userId) {
                const user = await users.findOne({_id: new ObjectId(userId)})
                const currentChatCode = user.currentChatCode
                const socketId = user.socketId

                if (currentChatCode && currentChatCode !== chatCode) {
                    if (await dbIncludesCollection(database, currentChatCode + '_participants')) {
                        const currentChat = await database.collection(currentChatCode + '_participants');
                        await currentChat.deleteOne({userId})
                        socket.to(currentChat).emit(EVENTS_CLIENT.DISCONNECTED)
                    }
                }

                if (socketId !== socket.id) {
                    await users.updateOne({_id: new ObjectId(userId)}, {$set: {socketId: socket.id}})
                }

                if (!currentChatCode || (currentChatCode && currentChatCode !== chatCode)) {
                    await users.updateOne({_id: new ObjectId(userId)}, {$set: {currentChatCode: chatCode}})
                    await participants.insertOne(new Participant(userId, user.name, !chat.isPublic && userId !== chat.adminId))
                }

                socket.join(chatCode)
                socket.to(chatCode).emit(EVENTS_CLIENT.NEW_JOIN)
                io.to(chatCode).emit(EVENTS_CLIENT.JOINED, {userId, flag: !(!chat.isPublic && userId !== chat.adminId)})
            } else {
                io.to(chatCode).emit(EVENTS_CLIENT.JOINED, {userId: '', flag: false})
            }
        })
    });

    socket.on(EVENTS_SERVER.SEND_MESSAGE, (userId, chatCode, messageText) => {
        MongoClient.connect(url, async (err, db) => {
            const database = db.db(data.db)

            if (
                (await dbIncludesCollection(database, chatCode + '_participants'))
                &&
                (await dbIncludesCollection(database, chatCode + '_chat'))
            ) {
                const participants = await database.collection(chatCode + '_participants')
                const participant = await participants.findOne({id: userId})

                if (!participant.isPending && messageText) {
                    const chat = await database.collection(chatCode + '_chat')

                    await chat.insertOne(new Message('', userId, '', messageText, Date.now()))

                    io.to(chatCode).emit(EVENTS_CLIENT.NEW_MESSAGE)
                }
            }
        })
    })

    socket.on(EVENTS_SERVER.ACCEPT_USER, (code, id) => {
        MongoClient.connect(url, async (err, db) => {
            const database = db.db(data.db)

            if (code && id) {
                if (await dbIncludesCollection(database, code + "_participants")) {
                    const participants = await database.collection(code + "_participants")
                    await participants.updateOne({id}, {$set: {isPending: false}})
                    io.to(code).emit(EVENTS_CLIENT.JOINED, {userId: id, flag: true})
                    io.to(code).emit(EVENTS_CLIENT.NEW_JOIN)
                }
            }
        })
    })

    socket.on(EVENTS_SERVER.DISCONNECT, () => {
        console.log('Disconnect!')
        MongoClient.connect(url, async (err, db) => {
            const database = db.db(data.db)
            const users = await database.collection('users');

            const user = await users.findOne({socketId: socket.id})
            const currentChatCode = user?.currentChatCode

            if (user && currentChatCode) {
                if (await dbIncludesCollection(database, currentChatCode + '_participants')) {
                    console.log('!!!')
                    const currentChat = await database.collection(currentChatCode + '_participants')
                    await currentChat.deleteOne({id: user._id.toHexString()})

                    await users.updateOne({_id: user._id}, {$set: {socketId: '', currentChatCode: ''}})
                    socket.to(currentChatCode).emit(EVENTS_CLIENT.DISCONNECTED)
                }
            }
        })
    })
});