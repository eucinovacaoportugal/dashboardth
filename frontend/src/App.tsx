import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PatientData {
  patient_id: string;
  surgery_type: string;
  functional_score: number;
  pain_level: number;
}

function App() {
  const [data, setData] = useState<PatientData[]>([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/patients')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Rehabilitation Dashboard
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Patient Outcomes by Surgery Type</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="surgery_type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="functional_score" fill="#8884d8" name="Avg. Functional Score" />
                  <Bar dataKey="pain_level" fill="#82ca9d" name="Avg. Pain Level" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
