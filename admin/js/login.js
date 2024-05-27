// login.js
var x = document.getElementById("login");
var y = document.getElementById("register");
var z = document.getElementById("btn");

function register() {
    x.style.left = "-400px";
    y.style.left = "50px";
    z.style.left = "110px";
}

function login() {
    x.style.left = "50px";
    y.style.left = "450px";
    z.style.left = "0px";
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('https://v2.api.noroff.dev/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        const token = data.data.accessToken; // Extract access token from response
        const apiKey = data.data.key; // Extract API key from response
        const username = data.data.name; // Extract username from response
        localStorage.setItem('token', token);
        localStorage.setItem('apiKey', apiKey); // Store the API key in localStorage
        localStorage.setItem('username', username); // Store the username in localStorage
        localStorage.setItem(`bearerToken_${username}`, token); // Store the access token with the username as part of the key
        localStorage.setItem(`apiKey_${username}`, apiKey); // Store the API key with the username as part of the key
        alert('Login successful');
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert(error.message);
    }
}


async function handleRegister(event) {
    event.preventDefault();
    const userId = document.getElementById('register-user-id').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch('https://v2.api.noroff.dev/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, email, password }),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        const data = await response.json();
        alert('Registration successful');
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert(error.message);
    }
}
