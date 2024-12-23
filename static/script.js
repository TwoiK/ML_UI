// predict

document.addEventListener('DOMContentLoaded', function() {
    const predictForm = document.getElementById('predictForm');
    const resultsDiv = document.getElementById('results');

    if (predictForm) {  
        predictForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const cs_value = document.getElementById('cs_value').value;
            const formData = new FormData();
            formData.append('cs_value', cs_value);
            
            try {
                const response = await fetch('/predict', {
                    method: 'POST',
                    body: formData
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                
                resultsDiv.innerHTML = `
                    <h2>Results for CS = ${data.input_cs.toFixed(14)}</h2>
                    <p>Closest CS value in dataset: ${data.closest_cs_in_data.toFixed(14)}</p>
                    <table class="results-table">
                        <thead>
                            <tr>
                                <th>Parameter</th>
                                <th>Predicted</th>
                                <th>Actual</th>
                                <th>Difference</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                `;

                const tableBody = resultsDiv.querySelector('.results-table tbody');
                
                
                data.predictions.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.parameter}</td>
                        <td>${Number(item.predicted).toFixed(14)}</td>
                        <td>${Number(item.actual).toFixed(14)}</td>
                        <td class="${item.difference > 0 ? 'positive' : 'negative'}">${Number(item.difference).toFixed(4)}</td>
                    `;
                    tableBody.appendChild(row);
                });
            } catch (error) {
                console.error('Error:', error);
                resultsDiv.innerHTML = '<p class="error">An error occurred while making the prediction</p>';
            }
        });
    }

    // login

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {  
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                
                if (response.ok) {
                    window.location.href = '/predict';
                } else {
                    throw new Error('Login failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Login failed. Please try again.');
            }
        });
    }
});
