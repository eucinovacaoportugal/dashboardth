import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface KneeData {
  patient_data: any[];
  model_results: any;
}

const KneeDashboard: React.FC = () => {
  const [kneeData, setKneeData] = useState<KneeData | null>(null);
  const [activePatient, setActivePatient] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/knee-data')
      .then(response => {
        if (response.data && response.data.model_results) {
          setKneeData(response.data);
        } else {
          setError('Received malformed data from the server.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("There was an error fetching the knee data!", err);
        setError('Failed to fetch data from the server.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading Knee Data...</div>;
  }
  
  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!kneeData) {
    return <div className="text-center p-4">No knee data available.</div>;
  }

  const { model_results: results, patient_data: patients } = kneeData;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Knee Rehabilitation Insights</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Metric Cards */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-700">Patient ROM-Flex Score</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={patients}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Patient_ID" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="knee flexion active ROM" name="Knee Flexion Active ROM">
                {patients.map((entry: any) => (
                  <Cell 
                    key={`cell-${entry.Patient_ID}`} 
                    fill={activePatient === entry.Patient_ID ? '#ffc658' : '#82ca9d'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="overflow-x-auto">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">Patient Recommendations</h3>
          <div className="overflow-y-auto h-96 border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prediction</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommendation</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.map((patient: any) => (
                  <tr 
                    key={patient.Patient_ID} 
                    onClick={() => setActivePatient(patient.Patient_ID)}
                    className={`cursor-pointer ${activePatient === patient.Patient_ID ? 'bg-yellow-100' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.Patient_ID}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.Predicted_Pattern}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.Recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KneeDashboard; 