const fs = require('fs');
const path = require('path');
const crypto = require('crypto')
const config = require('./config')

const sendFile = (fileName, res) => {
    const file = path.join(__dirname, '..', 'client', fileName)
    const extension = fileName.split('.').at(-1);
    fs.readFile(file, 'utf-8', (err, data) => {
        if (err) console.log(err);
        res.writeHead(200, { 'Content-Type': `text/${extension}`});
        res.end(data);
    });
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
    if (typeof data.message === 'string') return true
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
