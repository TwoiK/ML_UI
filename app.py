from flask import Flask, request, render_template, redirect, url_for

app = Flask(__name__)

# Dummy user data
users = {'user': 'password'}

@app.route('/')
def home():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if users.get(username) == password:
        return redirect(url_for('predict'))
    return 'Unauthorized', 401

@app.route('/predict')
def predict():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)