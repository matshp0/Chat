const utils = require('./utils')
const config = require('./config')

class Sessions extends Map {
    constructor() {
        super()
    }
    create(key, data, chat) {
        super.set(key, data)
        setTimeout(() => {
            super.delete(key)
            chat.unsubscribe(key)
        }, config.SESSION_EXPIRATION_TIME)
    }

    info() {
        console.log(this)
    }
}

module.exports = Sessions
