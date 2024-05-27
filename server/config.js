const SESSION_EXPIRATION_TIME = 3600000
const SESSION_ID_LENGTH = 64

const users = [
    { username: 'admin', password: 'admin' },
    { username: 'qwerty', password: '12345678' },
]

module.exports = {
    SESSION_EXPIRATION_TIME,
    SESSION_ID_LENGTH,
    users,
}
