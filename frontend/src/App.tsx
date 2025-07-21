import React, { useState } from 'react';
import HipDashboard from './components/HipDashboard';
import KneeDashboard from './components/KneeDashboard';

type View = 'hip' | 'knee';

function App() {
  const [view, setView] = useState<View>('hip');

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Models Dashboard
          </h1>
          <nav className="space-x-4">
            <button
              onClick={() => setView('hip')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                view === 'hip' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hip Data
            </button>
            <button
              onClick={() => setView('knee')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                view === 'knee' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Knee Data
            </button>
          </nav>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {view === 'hip' ? <HipDashboard /> : <KneeDashboard />}
        </div>
      </main>
    </div>
  );
}

export default App;
