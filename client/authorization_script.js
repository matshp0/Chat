document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login_button')
    const usernameInput = document.getElementById('usernameInput')
    const passwordInput = document.getElementById('passwordInput')

    loginButton.addEventListener('click', (event) => {
        event.preventDefault()
        const username = usernameInput.value
        const password = passwordInput.value
        localStorage.setItem('username', username)

        fetch('/login', {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        }).then((res) => {
            if (res.status === 200) {
                window.location.href = '/chat'
            } else {
                console.log(res.status)
            }
        })
    })
})
