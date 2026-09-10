import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { HudDashboardView } from './components/HudDashboardView';
import { WeatherTrackerView } from './components/WeatherTrackerView';
import { AnalyticsView } from './components/AnalyticsView';
import { AIAdvisorView } from './components/AIAdvisorView';
import { SettingsView } from './components/SettingsView';
import { PainLoggerModal } from './components/PainLoggerModal';
import { PainLog, WeatherData } from './types';

const INITIAL_WEATHER: WeatherData = {
  city: 'Orlando, FL',
  lat: 28.5383,
  lon: -81.3792,
  currentPressure: 1014.2,
  pressureTrend: 'stable',
  temperature: 28,
  humidity: 75,
  windSpeed: 14,
  weatherCode: 1,
  weatherDescription: 'Warm & Humid with Afternoon Showers',
  isRapidDrop: false,
  forecast: [
    { time: '12:00 PM', timestamp: Date.now() - 3600000 * 4, pressure: 1015.0, temperature: 27, humidity: 72, weatherDescription: 'Sunny', riskLevel: 'low' },
    { time: '03:00 PM', timestamp: Date.now() - 3600000 * 2, pressure: 1014.6, temperature: 29, humidity: 70, weatherDescription: 'Partly Cloudy', riskLevel: 'low' },
    { time: '06:00 PM (Now)', timestamp: Date.now(), pressure: 1014.2, temperature: 28, humidity: 75, weatherDescription: 'Humid Front', riskLevel: 'moderate' },
    { time: '09:00 PM', timestamp: Date.now() + 3600000 * 2, pressure: 1011.8, temperature: 26, humidity: 82, weatherDescription: 'Rain Shower', riskLevel: 'moderate' },
    { time: '12:00 AM', timestamp: Date.now() + 3600000 * 5, pressure: 1010.5, temperature: 25, humidity: 88, weatherDescription: 'Humid Night', riskLevel: 'high' },
    { time: '03:00 AM', timestamp: Date.now() + 3600000 * 8, pressure: 1011.0, temperature: 24, humidity: 86, weatherDescription: 'Clear', riskLevel: 'low' },
  ],
};

const SAMPLE_LOGS: PainLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    painScore: 7,
    painTypes: ['Migraine / Tension Headache'],
    bodyLocations: ['Head / Temples'],
    symptoms: ['Light Sensitivity', 'Nausea', 'Brain Fog'],
    barometricPressure: 1008.2,
    pressureTrend: 'falling',
    temperature: 16,
    humidity: 86,
    weatherDescription: 'Storm Front Approaching',
    notes: 'Sudden pressure drop before the afternoon rain. Severe temple throbbing.',
    medications: ['Sumatriptan 50mg'],
    reliefMethods: ['Rest / Darkness', 'Ice Pack / Cold Compress'],
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    painScore: 5,
    painTypes: ['Arthritis / Joint Pain'],
    bodyLocations: ['Knees / Legs', 'Hands / Fingers'],
    symptoms: ['Joint Stiffness'],
    barometricPressure: 1011.0,
    pressureTrend: 'stable',
    temperature: 17,
    humidity: 80,
    weatherDescription: 'Overcast',
    notes: 'Stiffness in knees upon waking up.',
    medications: ['Ibuprofen 400mg'],
    reliefMethods: ['Heating Pad / Warm Bath', 'Gentle Stretching'],
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoggerOpen, setIsLoggerOpen] = useState<boolean>(false);
  const [weather, setWeather] = useState<WeatherData>(INITIAL_WEATHER);
  const [painLogs, setPainLogs] = useState<PainLog[]>(() => {
    const saved = localStorage.getItem('baropain_logs');
    return saved ? JSON.parse(saved) : SAMPLE_LOGS;
  });

  useEffect(() => {
    localStorage.setItem('baropain_logs', JSON.stringify(painLogs));
  }, [painLogs]);

  // Fetch live weather from Open-Meteo API when location changes
  const fetchWeatherForLocation = async (cityName: string, lat: number, lon: number) => {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,weather_code,wind_speed_10m&hourly=temperature_2m,surface_pressure,relative_humidity_2m,weather_code`);
      const data = await res.json();
      if (data && data.current) {
        const currentPressure = data.current.surface_pressure || 1013;
        const temp = data.current.temperature_2m || 20;
        const hum = data.current.relative_humidity_2m || 70;
        const wind = data.current.wind_speed_10m || 15;

        // Check recent hourly pressure trend
        const hourlyPressures = data.hourly?.surface_pressure || [];
        const currentIndex = Math.floor(data.hourly?.time?.length / 2) || 12;
        const pastPressure = hourlyPressures[Math.max(0, currentIndex - 3)] || currentPressure;
        const pressureDiff = currentPressure - pastPressure;
        const pressureTrend = pressureDiff < -2 ? 'falling' : pressureDiff > 2 ? 'rising' : 'stable';
        const isRapidDrop = pressureDiff < -3.5;

        const forecastItems = [];
        for (let i = 0; i < 6; i++) {
          const idx = currentIndex + i * 2;
          if (idx < hourlyPressures.length) {
            const p = hourlyPressures[idx];
            const risk = p < 1010 ? 'high' : p < 1014 ? 'moderate' : 'low';
            forecastItems.push({
              time: new Date(data.hourly.time[idx]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              timestamp: new Date(data.hourly.time[idx]).getTime(),
              pressure: p,
              temperature: data.hourly.temperature_2m[idx],
              humidity: data.hourly.relative_humidity_2m[idx],
              weatherDescription: 'Atmospheric Data',
              riskLevel: risk as 'low' | 'moderate' | 'high',
            });
          }
        }

        setWeather({
          city: cityName,
          lat,
          lon,
          currentPressure,
          pressureTrend,
          temperature: temp,
          humidity: hum,
          windSpeed: wind,
          weatherCode: data.current.weather_code,
          weatherDescription: 'Live Atmospheric Telemetry',
          isRapidDrop,
          forecast: forecastItems.length > 0 ? forecastItems : INITIAL_WEATHER.forecast,
        });
      }
    } catch (e) {
      console.error('Failed to fetch live weather:', e);
    }
  };

  const handleSaveLog = (logData: Omit<PainLog, 'id' | 'timestamp'>) => {
    const newLog: PainLog = {
      ...logData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setPainLogs((prev) => [...prev, newLog]);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all pain logs?')) {
      setPainLogs([]);
    }
  };

  const handleLoadSampleData = () => {
    setPainLogs(SAMPLE_LOGS);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogger={() => setIsLoggerOpen(true)}
        currentPressure={weather.currentPressure}
        pressureTrend={weather.pressureTrend}
        isRapidDrop={weather.isRapidDrop}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'dashboard' && (
          <HudDashboardView
            weather={weather}
            painLogs={painLogs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenLogger={() => setIsLoggerOpen(true)}
          />
        )}
        {activeTab === 'weather' && <WeatherTrackerView weather={weather} />}
        {activeTab === 'analytics' && <AnalyticsView painLogs={painLogs} />}
        {activeTab === 'ai-advisor' && <AIAdvisorView weather={weather} painLogs={painLogs} />}
        {activeTab === 'settings' && (
          <SettingsView
            weather={weather}
            onUpdateCity={(cityName, lat, lon) => fetchWeatherForLocation(cityName, lat, lon)}
            onLoadSampleData={handleLoadSampleData}
            onClearData={handleClearData}
            painLogs={painLogs}
          />
        )}
      </main>

      <PainLoggerModal
        isOpen={isLoggerOpen}
        onClose={() => setIsLoggerOpen(false)}
        onSaveLog={handleSaveLog}
        currentWeather={weather}
      />
    </div>
  );
}
