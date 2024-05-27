const http = require('http')
const Client = require('./client')
const utils = require('./utils')
const Sessions = require('./sessions')
const config = require('./config')
const Chat = require('./chat')

const PORT = 3000
const sessions = new Sessions()
const chat = new Chat()

const routing = {
    '/': (client) => {
        utils.sendFile('authorization.html', client.res)
    },

    '/authorization_style.css': (client) => {
        utils.sendFile('authorization_style.css', client.res)
    },

    '/authorization_script.js': (client) => {
        utils.sendFile('authorization_script.js', client.res)
    },

    '/chat': (client) => {
        if (!client.isAuthorized(sessions)) return
        utils.sendFile('chatbox.html', client.res)
    },

    '/chatbox_style.css': (client) => {
        if (!client.isAuthorized(sessions)) return
        utils.sendFile('chatbox_style.css', client.res)
    },

    '/chatbox_script.js': (client) => {
        if (!client.isAuthorized(sessions)) return
        utils.sendFile('chatbox_script.js', client.res)
    },

    '/login': (client) => {
        const user = utils.isValidUser(client.data)
        if (!user) {
            client.sendResponse(401)
            return
        }
        const key = utils.createKey(config.SESSION_ID_LENGTH)
        sessions.create(key, user, chat)
        client.setCookie(key)
        client.sendResponse(200, 'Authorization completed')
        sessions.info()
    },

    '/subscribe': (client) => {
        if (!client.isAuthorized(sessions)) return
        chat.subscribe(client)
    },

    '/send-message': (client) => {
        if (!client.isAuthorized(sessions)) return
        if (!utils.isValidMessage(client.data)) {
            client.sendResponse(400)
            return
        }
        chat.sendMessage(client, sessions)
        client.sendResponse(200)
    },
    '/chat-history': async (client) => {
        if (!client.isAuthorized(sessions)) return
        const data = await chat.readMessages()
        if (data) {
            client.sendResponse(200, data)
        }
    },
}

const server = http.createServer((req, res) => {
    const client = new Client(req, res)
    const { url, method } = req
    console.log(url, method)
    client.constructed.then(() => {
        if (routing[client.url]) {
            const fn = routing[client.url]
            fn(client)
        } else client.sendResponse(404)
    })
})

server.listen(PORT, () => {
    console.log(`Server is running on  localhost:${PORT}`)
})
