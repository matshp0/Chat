const utils = require('./utils')
const fs = require('fs')

class Chat {
    constructor() {
        this.subscibed_users = new Set()
        this.writeStream = new fs.createWriteStream('messages.txt', {
            flags: 'a',
        })
    }
    sendMessage(client, sessions) {
        const message = {}
        message.message = client.data.message
        message.time = utils.currentTime()
        message.username = sessions.get(client.session_id).username
        this.writeMessage(message)

        for (const client of this.subscibed_users) {
            client.sendResponse(200, message)
            this.unsubscribe(client)
        }
    }
    subscribe(client) {
        this.subscibed_users.add(client)
    }
    unsubscribe(client) {
        this.subscibed_users.delete(client)
    }
    writeMessage(message) {
        const string = JSON.stringify(message) + '\n'
        this.writeStream.write(string)
    }
    async readMessages() {
        let messages = ''
        const rs = new fs.createReadStream('messages.txt')
        for await (const chunk of rs) {
            messages += chunk
        }
        return messages
    }
}

module.exports = Chat
