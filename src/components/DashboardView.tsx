import React from 'react';
import { Wind, ShieldAlert, Thermometer, Droplets, ArrowUpRight, ArrowDownRight, Activity, Sparkles, AlertTriangle, Calendar, CloudSun } from 'lucide-react';
import { WeatherData, PainLog } from '../types';

interface DashboardViewProps {
  weather: WeatherData;
  painLogs: PainLog[];
  onOpenLogger: () => void;
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  weather,
  painLogs,
  onOpenLogger,
  onNavigate,
}) => {
  const latestLog = painLogs.length > 0 ? painLogs[painLogs.length - 1] : null;
  const avgPainScore = painLogs.length > 0 
    ? (painLogs.reduce((acc, l) => acc + l.painScore, 0) / painLogs.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-8 pb-12">
      {/* Atmospheric Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-slate-900 min-h-[220px] flex items-center p-6 sm:p-10">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/aistudio/barometric_hero.jpg"
            alt="Atmospheric Background"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold backdrop-blur-md">
            <Wind className="w-3.5 h-3.5 animate-spin" />
            <span>Barometric Pressure & Weather Sensitivity Hub</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Monitor Your Weather Triggers
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Tracking barometric pressure shifts, predicting flare-up risks, and delivering intelligent AI health insights for {weather.city}.
          </p>
        </div>
      </div>

      {/* Rapid Front Alert Banner (if pressure is falling fast or isRapidDrop) */}
      {weather.isRapidDrop && (
        <div className="bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-rose-500/10 dark:from-rose-950/40 dark:to-amber-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl p-4 sm:p-6 flex items-start space-x-4 shadow-sm animate-pulse">
          <div className="p-3 bg-rose-500 text-white rounded-xl shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200">
              ⚠️ Rapid Barometric Pressure Drop Detected!
            </h3>
            <p className="text-sm text-rose-700 dark:text-rose-300 mt-1">
              Pressure has dropped rapidly in your area ({weather.city}). Weather fronts with sharp pressure drops frequently trigger migraines, arthritis flare-ups, and joint stiffness. Prepare preventative relief measures.
            </p>
          </div>
          <button
            onClick={() => onNavigate('ai-advisor')}
            className="hidden sm:flex items-center space-x-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Advice</span>
          </button>
        </div>
      )}

      {/* Main Grid: Weather Pressure Card & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Barometric Pressure Spotlight Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-sky-500/10 to-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Live Barometric Intelligence • {weather.city}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {weather.currentPressure.toFixed(1)} <span className="text-lg font-normal text-slate-500">hPa</span>
              </h2>
            </div>
            <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-bold ${
              weather.pressureTrend === 'falling'
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                : weather.pressureTrend === 'rising'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}>
              {weather.pressureTrend === 'falling' && <ArrowDownRight className="w-4 h-4" />}
              {weather.pressureTrend === 'rising' && <ArrowUpRight className="w-4 h-4" />}
              <span className="capitalize">{weather.pressureTrend} Trend</span>
            </div>
          </div>

          {/* Sub-Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                <Thermometer className="w-4 h-4 text-amber-500" />
                <span>Temperature</span>
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{weather.temperature}°C</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                <Droplets className="w-4 h-4 text-sky-500" />
                <span>Humidity</span>
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{weather.humidity}%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                <Wind className="w-4 h-4 text-teal-500" />
                <span>Wind Speed</span>
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{weather.windSpeed} km/h</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                <CloudSun className="w-4 h-4 text-indigo-500" />
                <span>Condition</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{weather.weatherDescription}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onOpenLogger}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-medium text-sm shadow-sm flex items-center space-x-2"
            >
              <Activity className="w-4 h-4" />
              <span>Log Pain Now</span>
            </button>
            <button
              onClick={() => onNavigate('weather')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-sm"
            >
              View 7-Day Pressure Forecast →
            </button>
          </div>
        </div>

        {/* Quick Summary Sidebar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Health Summary</h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold">
                {painLogs.length} Total Logs
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">Average Pain Score</p>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{avgPainScore}</span>
                  <span className="text-xs text-slate-400">/ 10</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">Weather Sensitivity Index</p>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-extrabold text-sky-600 dark:text-sky-400">78%</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">High Barometric Reactivity</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('ai-advisor')}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium text-sm flex items-center justify-center space-x-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI Weather Doctor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Logs Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Pain & Weather Logs</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tracked symptoms alongside atmospheric pressure</p>
          </div>
          <button
            onClick={() => onNavigate('analytics')}
            className="text-sm font-semibold text-sky-600 dark:text-sky-400 hover:underline"
          >
            View Full Analytics →
          </button>
        </div>

        {painLogs.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <Activity className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-300 font-medium">No pain logs recorded yet.</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">Log your first symptom to start building barometric correlations.</p>
            <button
              onClick={onOpenLogger}
              className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold"
            >
              Log First Pain Entry
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {painLogs.slice(-5).reverse().map((log) => (
              <div key={log.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                    log.painScore <= 3 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                    log.painScore <= 6 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
                    'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-350'
                  }`}>
                    {log.painScore}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-900 dark:text-white">{log.painTypes.join(', ')}</h4>
                      <span className="text-xs text-slate-400">• {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Locations: {log.bodyLocations.join(', ')} | Symptoms: {log.symptoms.join(', ')}
                    </p>
                    {log.notes && <p className="text-xs italic text-slate-600 dark:text-slate-300 mt-1">"{log.notes}"</p>}
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-right sm:border-l sm:border-slate-200 sm:dark:border-slate-700 sm:pl-4">
                  <div>
                    <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">{log.barometricPressure.toFixed(1)} hPa</p>
                    <p className="text-xs text-slate-400 capitalize">{log.pressureTrend} • {log.temperature}°C</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
