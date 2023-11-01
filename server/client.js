const http = require('http');
const config = require('./config')


class Client{
    constructor(req, res){
        this.url = req.url;
        this.req = req;
        this.res = res;
        this.headers = req.headers;
        this.cookies = this.headers.cookie
        try {
            this.parseCookies();
            this.constructed = new Promise(resolve => {
                this.getData()
                    .then((data) => {
                        this.data = data;
                    }).catch(() => {
                        this.data = {};
                        //console.log('No data')
                    }).finally(resolve)
            });
        }
        catch(err){
            this.close(err);
        }

    }
    parseCookies(){
        if (!this.cookies) return;
        const str = this.headers.cookie.split('; ');
        this.cookies = Object.fromEntries(str.map((item) => item.split('=')));
        this.session_id = this.cookies.session_id;
    }
    getData(){
        return new Promise((resolve, reject) =>{
            let data = '';
            this.req.on('data', (chunk) => data += chunk);
            this.req.on('error', (err) => reject(err));
            this.req.on('end', () => {
                try {
                    resolve(JSON.parse(data))
                } catch (err) {
                    reject();
                }
            });
        });
    }
    setCookie(value){
        this.res.setHeader('Set-Cookie', `session_id=${value}; Path=/; Max-Age=${config.SESSION_EXPIRATION_TIME}`);
    }
    isAuthorized(sessions, options = 1){
        const user = sessions.get(this.session_id);
        if (!user && options) {
            this.sendResponse(401)
            return
        }
        return user;

    }
    close(err){
        this.res.statusCode = 500;
        this.res.end('Error occurred');
        if (err) throw err;
    }
    sendResponse(code, message = ''){
        this.res.writeHead(code)
        this.res.end(JSON.stringify({message}));
    }

}

module.exports = Client;