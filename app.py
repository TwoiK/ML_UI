from flask import Flask, request, render_template, redirect, url_for, jsonify
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import numpy 

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


# Load and prepare the data
df = pd.read_csv('D:/Asish PAndey/ML_UI/Compressive_Strength_Data_Simu.csv') 
X = df[['CS']]

CS_MIN = df['CS'].min()
CS_MAX = df['CS'].max()

target_columns = ['FA', 'Na2O', 'Ms', 'Coarse_FA', 'Fine_FA', 'Fs', 'MaxS', 'BC', 'HM', 'CrTime', 'Age']

models = {}
for column in target_columns:
    y = df[column]
    model = LinearRegression()
    model.fit(X, y)
    models[column] = model


@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'POST':
        cs_value = float(request.form['cs_value'])
        
        # Create DataFrame with feature name for prediction
        X_pred = pd.DataFrame([[cs_value]], columns=['CS'])
        
        # Define parameter order
        parameter_order = [
            'Age', 'BC', 'Coarse_FA', 'CrTime', 'FA', 
            'Fine_FA', 'Fs', 'HM', 'MaxS', 'Ms', 'Na2O'
        ]
        
        predictions = []  # Change to list for ordered output
        closest_cs = df.iloc[(df['CS'] - cs_value).abs().argsort()[:1]]['CS'].values[0]
        actual_values = df[df['CS'] == closest_cs][target_columns].iloc[0]
        
        # Create ordered predictions
        for param in parameter_order:
            pred = float(models[param].predict(X_pred)[0])
            actual = float(actual_values[param])
            predictions.append({
                'parameter': param,
                'predicted': pred,
                'actual': actual,
                'difference': pred - actual
            })
        
        return jsonify({
            'predictions': predictions,
            'input_cs': cs_value,
            'closest_cs_in_data': float(closest_cs)
        })
    
    return render_template('index.html')
    
    

if __name__ == '__main__':
    app.run(debug=True)
