from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

_app_dir = os.path.dirname(os.path.abspath(__file__))
_csv_path = os.path.join(_app_dir, 'patient_data.csv')

@app.route('/api/patients', methods=['GET'])
def get_patients():
    df = pd.read_csv(_csv_path)
    return jsonify(df.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)
