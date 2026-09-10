import React from 'react';
import { WeatherData, PainLog } from '../types';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Home, Clock, TrendingUp, Cloud, Bell, User, FileText, Settings, ShieldAlert, Thermometer, Droplets, Wind, Sparkles } from 'lucide-react';

interface HudDashboardViewProps {
  weather: WeatherData;
  painLogs: PainLog[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLogger: () => void;
}

export const HudDashboardView: React.FC<HudDashboardViewProps> = ({
  weather,
  painLogs,
  activeTab,
  setActiveTab,
  onOpenLogger,
}) => {
  const chartData = weather.forecast.map((f, i) => ({
    time: f.time,
    pressure: f.pressure * 0.02953, // convert hPa to inHg roughly for display
  }));

  return (
    <div className="relative min-h-[900px] w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-800 text-white p-4 sm:p-6 font-sans">
      {/* Background HUD Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/assets/aistudio/orlando_pressure_map.jpg"
          alt="Pressure Map Background"
          className="w-full h-full object-cover opacity-90 mix-blend-luminosity animate-map-pan"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[0.5px]" />
      </div>

      {/* Foreground Interactive Content Grid */}
      <div className="relative z-10 grid grid-cols-12 gap-4">
        {/* Left Sidebar Navigation */}
        <div className="col-span-12 lg:col-span-2 bg-slate-950/75 backdrop-blur-[0.5px] rounded-2xl border border-sky-500/40 p-4 flex lg:flex-col justify-between items-center lg:items-stretch space-y-0 lg:space-y-6 shadow-xl shadow-sky-950/20">
          <div className="flex items-center space-x-2 lg:mb-4">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/50 flex items-center justify-center text-sky-400 shadow-lg shadow-sky-500/30">
              <Cloud className="w-5 h-5 animate-pulse" />
            </div>
            <span className="hidden lg:inline font-black text-sm tracking-widest bg-gradient-to-r from-sky-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              BAROPAIN
            </span>
          </div>

          <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'history', label: 'History', icon: Clock },
              { id: 'trends', label: 'Trends', icon: TrendingUp },
              { id: 'weather', label: 'Forecast', icon: Cloud },
              { id: 'alerts', label: 'Alerts', icon: Bell, badge: '2' },
              { id: 'sensitivity', label: 'Sensitivity', icon: User },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'dashboard' && activeTab === 'dashboard');
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'alerts' || item.id === 'sensitivity' || item.id === 'reports') {
                      setActiveTab('ai-advisor');
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-sky-600/30 border border-sky-400/70 text-sky-200 shadow-lg shadow-sky-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent hover:border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                  {item.badge && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:block pt-4 border-t border-sky-500/20 text-[10px] text-slate-400 text-center">
            NOAA + Orlando Sensors
            <div className="flex items-center justify-center space-x-1.5 mt-1 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE TELEMETRY</span>
            </div>
          </div>
        </div>

        {/* Center Main Workspace */}
        <div className="col-span-12 lg:col-span-10 space-y-4">
          {/* Top Row: Left Cloud Panel, Center Globe/Risk, Right Telemetry */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Top Left: Barometric Pressure Card */}
            <div className="lg:col-span-4 bg-slate-950/75 backdrop-blur-[0.5px] rounded-2xl border border-sky-500/40 p-5 flex flex-col justify-between shadow-xl shadow-sky-950/20 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] uppercase tracking-wider text-sky-300 font-bold flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                    <span>Location: {weather.city}</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 font-mono">STATION-01</span>
                </div>
                <div className="mb-4">
                  <p className="text-[10px] text-slate-400 tracking-wider font-bold">CURRENT PRESSURE</p>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-3xl font-black bg-gradient-to-r from-white via-sky-200 to-sky-400 bg-clip-text text-transparent">
                      {(weather.currentPressure * 0.02953).toFixed(2)}
                    </span>
                    <span className="text-xs text-sky-400 font-bold">inHg</span>
                  </div>
                  <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-600/50 text-rose-300 text-xs font-bold animate-pulse">
                    <span>↓ FALLING RAPIDLY (-0.18/hr)</span>
                  </div>
                </div>
              </div>

              {/* Weather Cloud Visual Box */}
              <div className="bg-slate-900/80 rounded-xl p-3.5 border border-sky-500/30 flex items-center justify-between shadow-inner">
                <div>
                  <p className="text-xs font-bold text-sky-200">{weather.weatherDescription}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Atmospheric Gradient Active</p>
                </div>
                <button
                  onClick={onOpenLogger}
                  className="px-3.5 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-600/30 transition-all transform hover:scale-105"
                >
                  Log Pain
                </button>
              </div>
            </div>

            {/* Top Center: Earth Globe & Pain Risk Gauge */}
            <div className="lg:col-span-4 bg-slate-950/75 backdrop-blur-[0.5px] rounded-2xl border border-sky-500/40 p-5 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl shadow-sky-950/20">
              <div className="absolute inset-0 bg-radial from-rose-500/20 via-transparent to-transparent pointer-events-none animate-pulse" />
              
              {/* Graphical Circular SVG Gauge */}
              <div className="relative w-32 h-32 flex items-center justify-center my-1">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background Track */}
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    className="text-slate-800"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  {/* Animated Value Arc */}
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    className="text-rose-500 transition-all duration-1000 ease-out"
                    strokeWidth="10"
                    strokeDasharray={326.7}
                    strokeDashoffset={326.7 * (1 - 0.87)}
                    strokeLinecap="round"
                    stroke="url(#riskGradient)"
                    fill="transparent"
                  />
                  <defs>
                    <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">PAIN RISK</span>
                  <span className="text-3xl font-black bg-gradient-to-r from-amber-400 via-rose-500 to-rose-600 bg-clip-text text-transparent drop-shadow-lg">
                    87%
                  </span>
                </div>
              </div>

              <span className="text-xs font-extrabold text-rose-400 tracking-wider uppercase bg-rose-950/80 px-3 py-1 rounded-full border border-rose-600/60 shadow-lg shadow-rose-900/50 mt-1 animate-pulse">
                ⚡ SEVERE BAROMETRIC TRIGGER
              </span>

              {weather.isRapidDrop && (
                <div className="mt-2.5 text-[11px] text-amber-300 flex items-center space-x-1.5 bg-amber-950/60 px-3 py-1 rounded-lg border border-amber-500/50 shadow">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                  <span>Rapid pressure drop detected in Orlando</span>
                </div>
              )}
            </div>

            {/* Top Right: Weather Telemetry List */}
            <div className="lg:col-span-4 bg-slate-950/75 backdrop-blur-[0.5px] rounded-2xl border border-sky-500/40 p-5 flex flex-col justify-between shadow-xl shadow-sky-950/20 relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] uppercase tracking-wider text-sky-300 font-bold">ATMOSPHERIC TELEMETRY</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-sky-500/20">
                  <span className="text-slate-400 font-medium">PRESSURE TREND</span>
                  <span className="font-bold text-sky-400 uppercase bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">{weather.pressureTrend}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-sky-500/20">
                  <span className="text-slate-400 font-medium">CHANGE (3 HR)</span>
                  <span className="font-bold text-rose-400 font-mono">-0.36 inHg</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-sky-500/20">
                  <span className="text-slate-400 font-medium">HUMIDITY</span>
                  <span className="font-bold text-white font-mono">{weather.humidity}%</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-sky-500/20">
                  <span className="text-slate-400 font-medium">TEMPERATURE</span>
                  <span className="font-bold text-white font-mono">{weather.temperature}°C ({Math.round(weather.temperature * 9/5 + 32)}°F)</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-sky-500/20">
                  <span className="text-slate-400 font-medium">WIND SPEED</span>
                  <span className="font-bold text-white font-mono">{weather.windSpeed} mph NW</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-400 font-medium">DEW POINT</span>
                  <span className="font-bold text-white font-mono">46°F</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Row: 4 Anatomical Pain Score Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'HEADACHE', score: 7, status: 'High', color: 'text-rose-400', border: 'border-rose-500/40' },
              { title: 'JOINT PAIN', score: 8, status: 'High', color: 'text-rose-500', border: 'border-rose-500/40' },
              { title: 'BACK PAIN', score: 6, status: 'Moderate', color: 'text-amber-400', border: 'border-amber-500/40' },
              { title: 'NECK PAIN', score: 5, status: 'Moderate', color: 'text-amber-400', border: 'border-amber-500/40' },
            ].map((pain, idx) => (
              <div key={idx} className={`bg-slate-950/75 backdrop-blur-[0.5px] rounded-2xl border ${pain.border} p-4 flex items-center justify-between shadow-lg shadow-sky-950/10 relative overflow-hidden group hover:border-sky-400 transition-all`}>
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <p className="text-[10px] tracking-wider text-slate-300 font-bold">{pain.title}</p>
                  <div className="flex items-baseline space-x-1 my-1">
                    <span className={`text-2xl font-black ${pain.color}`}>{pain.score}</span>
                    <span className="text-xs text-slate-500">/10</span>
                  </div>
                  <span className={`text-[10px] font-bold ${pain.color} bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800`}>● {pain.status}</span>
                </div>
                <div className="relative z-10 w-11 h-11 rounded-xl bg-slate-900/90 flex items-center justify-center border border-sky-500/30 text-xs font-bold text-sky-300 shadow-inner">
                  {pain.score * 10}%
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row: Pressure Chart & Weather Map Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Bottom Left: Pressure Trend Chart */}
            <div className="lg:col-span-7 bg-slate-950/75 backdrop-blur-[0.5px] rounded-2xl border border-sky-500/40 p-5 shadow-xl shadow-sky-950/20 relative overflow-hidden">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sky-200">Pressure Trend (48 Hours)</h3>
                  <p className="text-[10px] text-slate-400">Atmospheric pressure drop history - Orlando Station</p>
                </div>
                <span className="text-xs text-sky-300 font-bold px-2 py-1 bg-sky-950 rounded border border-sky-800">inHg</span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="hudGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                    <YAxis domain={['auto', 'auto']} stroke="#94a3b8" fontSize={10} />
                    <Area type="monotone" dataKey="pressure" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#hudGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Right: Weather System Overview */}
            <div className="lg:col-span-5 bg-slate-950/75 backdrop-blur-[0.5px] rounded-2xl border border-sky-500/40 p-5 flex flex-col justify-between shadow-xl shadow-sky-950/20 relative overflow-hidden">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sky-200">Weather System Overview</h3>
                  <span className="text-[10px] text-amber-400 font-semibold animate-pulse">FRONT COLLISION</span>
                </div>
                <p className="text-[10px] text-slate-400 mb-3">Isobar gradient & frontal convergence zones</p>
                <div className="h-28 rounded-xl bg-slate-900/90 border border-sky-500/30 overflow-hidden relative flex items-center justify-center shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/80 via-emerald-950/40 to-indigo-950/80" />
                  <div className="relative z-10 flex items-center space-x-6">
                    <div className="px-3.5 py-1.5 rounded-xl bg-blue-600/40 border border-blue-400 text-blue-200 font-bold text-xs shadow-lg shadow-blue-600/30">
                      H (High)
                    </div>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-400 via-amber-400 to-rose-500 animate-pulse rounded-full shadow" />
                    <div className="px-3.5 py-1.5 rounded-xl bg-rose-600/40 border border-rose-400 text-rose-200 font-bold text-xs shadow-lg shadow-rose-600/30">
                      L (Low Front)
                    </div>
                  </div>
                </div>
              </div>

              {/* Tip for today */}
              <div className="mt-3 pt-3 border-t border-sky-500/20 text-[11px] text-sky-200 flex items-center space-x-2 bg-sky-950/40 p-2.5 rounded-xl border border-sky-800/50">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 animate-spin" />
                <span>Tip: High barometric sensitivity detected in Orlando. Stay hydrated during frontal shifts.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
