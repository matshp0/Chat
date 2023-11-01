const username = localStorage.getItem('username');
let sendButton;
let messageInput;
let chatContainer;
let chatBox;

const drawMessage = (message) =>{


    const newMessageDiv = document.createElement('div');
    newMessageDiv.className = `msg ${message.username === username ? 'right' : 'left'}-msg`;


    newMessageDiv.innerHTML = `
            <div
                    class="msg-img"
            ></div> 

            <div class="msg-bubble">
                <div class="msg-info">
                    <div class="msg-info-name">${message.username}</div>
                    <div class="msg-info-time">${message.time}</div>
                </div>

                <div class="msg-text">
                    ${message.message}
                </div>
            </div>
`;

// Append the new message div to the chat container
    chatContainer.appendChild(newMessageDiv);
    scrollChatDown();
    clearInput();
}
const scrollChatDown = () =>{
    chatBox.scrollTop = chatBox.scrollHeight;
}

const clearInput = () =>{
    messageInput.value = '';
}

const subscribe = () =>{
    fetch('/subscribe')
        .then(res => {
            if (res.status === 401)
                window.location.href = "/"
            return res.json();
        })
        .then(data => drawMessage(data.message))
        .then(subscribe);
}

const getChatHistory = ()=>{
    fetch('/chat-history', {method : 'GET'})
        .then(res => res.json())
        .then(data =>{
            const messages = data.message.split('\n');
            console.log(messages)
            for (let message of messages){
                console.log(message.username)
                if (message) {
                    try {
                        drawMessage(JSON.parse(message))
                    }
                    catch(err){
                        console.log(err)
                    }
                }
            }
        })
}


document.addEventListener("DOMContentLoaded", () =>{
    sendButton = document.getElementById("send-msg-button");
    messageInput = document.getElementById("usernameInput");
    chatContainer = document.getElementById('chat-container');
    chatBox = document.getElementById("chat-container");

    getChatHistory()
    subscribe();


    sendButton.addEventListener("click",  (event) =>{
        event.preventDefault();
        const message = messageInput.value;
        console.log(message)
        fetch('/send-message', {
            method: 'POST',
            body: JSON.stringify({message})
        }).then(res => {
            console.log(res);
            if (res.status === 200){
                console.log('Message sent successfully')
            }
            if (res.status === 401)  window.location.href = "/"
            else{
                console.log(res.status);
            }
        })

    });
});