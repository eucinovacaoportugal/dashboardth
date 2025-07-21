from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os
import json

app = Flask(__name__)
CORS(app)

_app_dir = os.path.dirname(os.path.abspath(__file__))
_hip_data_path = os.path.join(_app_dir, 'data', 'hip_data.csv')
_knee_data_path = os.path.join(_app_dir, 'data', 'knee_data.csv')
_hip_results_path = os.path.join(_app_dir, 'data', 'hip_results.json')
_knee_results_path = os.path.join(_app_dir, 'data', 'knee_results.json')
_hip_recs_path = os.path.join(_app_dir, 'data', 'hip_recommendations.csv')
_knee_recs_path = os.path.join(_app_dir, 'data', 'knee_recommendations.csv')

@app.route('/api/hip-data', methods=['GET'])
def get_hip_data():
    try:
        df = pd.read_csv(_hip_data_path)
        recs_df = pd.read_csv(_hip_recs_path)
        with open(_hip_results_path, 'r') as f:
            results = json.load(f)
        
        # Merge recommendations into the main dataframe
        df = pd.merge(df, recs_df, on='Patient_ID')

        # Replace NaN with None for JSON compatibility
        df.fillna(value=pd.NA, inplace=True)

        return jsonify({
            'patient_data': df.to_dict(orient='records'),
            'model_results': results
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/knee-data', methods=['GET'])
def get_knee_data():
    try:
        df = pd.read_csv(_knee_data_path)
        recs_df = pd.read_csv(_knee_recs_path)
        with open(_knee_results_path, 'r') as f:
            results = json.load(f)

        # Merge recommendations into the main dataframe
        df = pd.merge(df, recs_df, on='Patient_ID')
        
        # Replace NaN with None for JSON compatibility
        df.fillna(value=pd.NA, inplace=True)

        return jsonify({
            'patient_data': df.to_dict(orient='records'),
            'model_results': results
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
