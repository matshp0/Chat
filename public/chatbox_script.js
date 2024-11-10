const username = localStorage.getItem('username')
let sendButton
let messageInput
let chatContainer
let chatBox

const socket = new WebSocket(`ws://${window.location.host}/ws`);
socket.addEventListener('message', (event) => {
    try {
        const message = JSON.parse(event.data);
        drawMessage(message);
    }
    catch (e) {
        console.error(e);
    }
});

const drawMessage = (message) => {
    console.log(message);
    const newMessageDiv = document.createElement('div')

    const timeFormatter = new Intl.DateTimeFormat([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    console.log(message.timestamp)
    const formattedTime = timeFormatter.format(new Date(message.timestamp));
    console.log()

    newMessageDiv.className = `msg ${message.username === username ? 'right' : 'left'}-msg`

    newMessageDiv.innerHTML = `
            <div
                    class="msg-img"
            ></div> 

            <div class="msg-bubble">
                <div class="msg-info">
                    <div class="msg-info-name">${message.username}</div>
                    <div class="msg-info-time">${formattedTime}</div>
                </div>

                <div class="msg-text">
                    ${message.content}
                </div>
            </div>
`

    // Append the new message div to the chat container
    chatContainer.appendChild(newMessageDiv)
    scrollChatDown()
}
const scrollChatDown = () => {
    chatBox.scrollTop = chatBox.scrollHeight
}

const clearInput = () => {
    messageInput.value = ''
}


const getChatHistory = () => {
    fetch('/chat', { method: 'GET' })
        .then((res) => res.json())
        .then((data) => {
            for (const message of data) {
                drawMessage(message)
            }
        })
}

document.addEventListener('DOMContentLoaded', () => {
    sendButton = document.getElementById('send-msg-button')
    messageInput = document.getElementById('usernameInput')
    chatContainer = document.getElementById('chat-container')
    chatBox = document.getElementById('chat-container')

    getChatHistory()

    sendButton.addEventListener('click', (event) => {
        event.preventDefault()
        const message = messageInput.value
        socket.send(JSON.stringify({ content: message }));
    })
})
