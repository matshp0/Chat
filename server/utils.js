const fs = require('fs');
const path = require('path');
const crypto = require('crypto')
const config = require('./config')

const TYPES = {
    'js' : 'text/js',
    'css' : 'text/css',
    'html' : 'text/html',
    'txt' : 'text/plain'
};

const sendFile = (fileName, res) => {
    const file = path.join(__dirname, '..', 'client', fileName)
    const extension = fileName.split('.').at(-1);
    const type = TYPES[extension];
    const rs = fs.createReadStream(file, 'utf-8');
    res.writeHead(200, {'Content-Type': type});
    rs.pipe(res);
}

const createKey = (size) =>{
    const key = crypto.randomBytes(size);
    return key.toString('hex')
}

const isValidUser = (data) =>{
    for (const user of config.users){
        if (data.username === user.username && data.password === user.password)
            return user;
    }
}

const isValidMessage = (data) =>{
    return typeof data.message === 'string';
}

const currentTime = () =>{
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`
}

module.exports = {
    sendFile,
    createKey,
    isValidUser,
    isValidMessage,
    currentTime
};
