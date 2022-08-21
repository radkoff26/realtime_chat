import express from 'express'
import http from 'http'
import {Server} from 'socket.io'
import {MongoClient} from 'mongodb'
import bodyParser from 'body-parser'
import setRouter from "./routes/routes.js";
import cors from 'cors'

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

io.on('connection', (socket) => {
    console.log('Connected')
    socket.on('disconnect', () => {
        console.log('Disconnected')
    })
    socket.on('chat_message', msg => {
        // socket.emit('chat_message', msg)
        console.log(msg.text)
    });
});
