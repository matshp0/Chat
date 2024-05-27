const http = require('http')
const config = require('./config')

class Client {
    constructor(req, res) {
        this.url = req.url
        this.req = req
        this.res = res
        this.headers = req.headers
        this.cookies = this.headers.cookie
        try {
            this.parseCookies()
            this.constructed = new Promise((resolve) => {
                this.getData()
                    .then((data) => {
                        this.data = JSON.parse(data)
                    })
                    .catch(() => {
                        this.data = {}
                    })
                    .finally(resolve)
            })
        } catch (err) {
            console.log(err)
            this.close(err)
        }
    }
    parseCookies() {
        if (!this.cookies) return
        const str = this.headers.cookie.split('; ')
        this.cookies = Object.fromEntries(str.map((item) => item.split('=')))
        this.session_id = this.cookies.session_id
    }
    async getData() {
        const chunks = []
        for await (const chunk of this.req) {
            chunks.push(chunk)
        }
        return Buffer.concat(chunks).toString()
    }
    setCookie(value) {
        this.res.setHeader(
            'Set-Cookie',
            `session_id=${value}; Path=/; Max-Age=${config.SESSION_EXPIRATION_TIME}`
        )
    }
    isAuthorized(sessions) {
        const user = sessions.get(this.session_id)
        if (!user) {
            this.sendResponse(401, 'Unauthorized')
            return
        }
        return user
    }
    close(err) {
        this.res.statusCode = 500
        this.res.end('Error occurred')
        if (err) throw err
    }
    sendResponse(code, message = '') {
        this.res.writeHead(code)
        this.res.end(JSON.stringify({ message }))
    }
}

module.exports = Client
