import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface KneeData {
  patient_data: any[];
  model_results: any;
}

const KneeDashboard: React.FC = () => {
  const [kneeData, setKneeData] = useState<KneeData | null>(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/knee-data')
      .then(response => {
        setKneeData(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the knee data!", error);
      });
  }, []);

  if (!kneeData) {
    return <div>Loading Knee Data...</div>;
  }

  const { model_results: results, patient_data: patients } = kneeData;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Knee Rehabilitation Insights</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <h3 className="text-lg font-bold text-blue-800">F1 Score</h3>
          <p className="text-2xl font-semibold text-blue-900">{(results.cv_results.f1_score * 100).toFixed(2)}%</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <h3 className="text-lg font-bold text-green-800">ROC AUC</h3>
          <p className="text-2xl font-semibold text-green-900">{(results.cv_results.roc_auc * 100).toFixed(2)}%</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg text-center">
          <h3 className="text-lg font-bold text-purple-800">Accuracy</h3>
          <p className="text-2xl font-semibold text-purple-900">{(results.cv_results.accuracy * 100).toFixed(2)}%</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg text-center">
          <h3 className="text-lg font-bold text-yellow-800">Total Patients</h3>
          <p className="text-2xl font-semibold text-yellow-900">{results.dataset_info.total_samples}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Patient ROM-Flex Score Distribution</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={patients}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Patient" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ROM-Flex" fill="#82ca9d" name="ROM-Flex Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default KneeDashboard; 