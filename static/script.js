
//predict
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('predictForm').onsubmit = async function(event) {
        event.preventDefault();
        const cs_value = document.getElementById('cs_value').value;
        const response = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `cs_value=${cs_value}`
        });
        const data = await response.json();
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '<h2>Predicted Values:</h2>';
        for (const [key, value] of Object.entries(data)) {
            resultsDiv.innerHTML += `<p>${key}: ${value.toFixed(2)}</p>`;
        }
    };
});

//login

document.getElementById('loginForm').onsubmit = async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (response.ok) {
        window.location.href = '/predict';
    } else {
        alert('Login failed. Please try again.');
    }
};