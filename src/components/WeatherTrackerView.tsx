import React from 'react';
import { WeatherData, ForecastItem } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { CloudSun, Wind, Thermometer, Droplets, ShieldAlert, AlertTriangle } from 'lucide-react';

interface WeatherTrackerViewProps {
  weather: WeatherData;
}

export const WeatherTrackerView: React.FC<WeatherTrackerViewProps> = ({ weather }) => {
  const chartData = weather.forecast.map((f) => ({
    time: f.time,
    pressure: f.pressure,
    temperature: f.temperature,
    humidity: f.humidity,
    risk: f.riskLevel === 'high' ? 3 : f.riskLevel === 'moderate' ? 2 : 1,
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Atmospheric Forecasting • {weather.city}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Barometric Pressure & Weather Fronts
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Rapid pressure shifts below 1013 hPa or drops &gt;4 hPa in 3 hours are correlated with joint pain and migraine triggers.
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-xs text-slate-400">Current Pressure</p>
              <p className="text-xl font-extrabold text-sky-600 dark:text-sky-400">{weather.currentPressure.toFixed(1)} hPa</p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <p className="text-xs text-slate-400">Trend</p>
              <p className={`text-sm font-bold uppercase ${weather.pressureTrend === 'falling' ? 'text-rose-500' : 'text-emerald-500'}`}>
                {weather.pressureTrend}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Barometric Pressure Forecast Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Hourly Barometric Pressure Trend (hPa)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Tracking upcoming atmospheric dips and frontal arrivals</p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="flex items-center space-x-1"><span className="w-3 h-3 rounded-full bg-sky-500 inline-block" /><span>Pressure (hPa)</span></span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="pressureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
              <YAxis domain={['auto', 'auto']} stroke="#64748b" fontSize={12} unit=" hPa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="pressure" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#pressureGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7-Day / Upcoming Forecast Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Upcoming Weather Fronts & Pain Risk Analysis</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {weather.forecast.slice(0, 4).map((item, idx) => (
            <div key={idx} className={`p-5 rounded-2xl border transition-all ${
              item.riskLevel === 'high' 
                ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50' 
                : item.riskLevel === 'moderate'
                ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
            }`}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{item.time}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  item.riskLevel === 'high' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200' :
                  item.riskLevel === 'moderate' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200' :
                  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                }`}>
                  {item.riskLevel.toUpperCase()} RISK
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Pressure:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{item.pressure.toFixed(1)} hPa</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Temp:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{item.temperature}°C</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Humidity:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{item.humidity}%</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                {item.weatherDescription}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
