import React, { useState } from 'react';
import { Settings, MapPin, Download, Trash2, Database, RefreshCw, CheckCircle2 } from 'lucide-react';
import { WeatherData, PainLog } from '../types';

interface SettingsViewProps {
  weather: WeatherData;
  onUpdateCity: (city: string, lat: number, lon: number) => void;
  onLoadSampleData: () => void;
  onClearData: () => void;
  painLogs: PainLog[];
}

const CITIES = [
  { name: 'Orlando, FL', lat: 28.5383, lon: -81.3792 },
  { name: 'New York, USA', lat: 40.7128, lon: -74.0060 },
  { name: 'London, UK', lat: 51.5074, lon: -0.1278 },
  { name: 'Seattle, USA', lat: 47.6062, lon: -122.3321 },
  { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093 },
  { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'Denver, USA', lat: 39.7392, lon: -104.9903 },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  weather,
  onUpdateCity,
  onLoadSampleData,
  onClearData,
  painLogs,
}) => {
  const [selectedCityName, setSelectedCityName] = useState(weather.city);
  const [successMsg, setSuccessMsg] = useState('');

  const handleCityChange = (cityName: string) => {
    const found = CITIES.find((c) => c.name === cityName);
    if (found) {
      setSelectedCityName(found.name);
      onUpdateCity(found.name, found.lat, found.lon);
      setSuccessMsg(`Location updated to ${found.name}`);
      setTimeout(() => setSuccessMsg(''), 2500);
    }
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(painLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `baropain_logs_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
          Preferences & Configuration
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          App Settings & Data Management
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure your monitoring location, manage your pain logs, and export telemetry for medical consultations.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Location Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Monitoring Location</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Select city for real-time barometric pressure & weather data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {CITIES.map((c) => (
            <button
              key={c.name}
              onClick={() => handleCityChange(c.name)}
              className={`p-4 rounded-xl border text-left transition-all ${
                weather.city === c.name
                  ? 'border-sky-600 bg-sky-50/50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 font-bold shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pain Log Data & Telemetry</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Export logs for your doctor or load sample data to explore analytics</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={onLoadSampleData}
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Load Sample Pain Logs</span>
          </button>

          <button
            onClick={exportData}
            disabled={painLogs.length === 0}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm flex items-center space-x-2 shadow-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export Logs (JSON)</span>
          </button>

          <button
            onClick={onClearData}
            className="px-5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/60 font-medium text-sm flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Logs</span>
          </button>
        </div>
      </div>
    </div>
  );
};
