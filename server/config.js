
const SESSION_EXPIRATION_TIME = 3600000;
const SESSION_ID_LENGTH = 64;

const users = [
    {username: "admin", password: "admin"},
    {username: "qwerty", password: "12345678"},
    {username: "1111111", password: "bob123"},
    {username: "user123", password: "9999"},
    {username: "John", password: "66666"},
]

module.exports = {
    SESSION_EXPIRATION_TIME,
    SESSION_ID_LENGTH,
    users
}