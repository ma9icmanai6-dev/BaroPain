import React from 'react';
import { Activity, CloudSun, BarChart3, Bot, Settings, Plus, Wind, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLogger: () => void;
  currentPressure: number;
  pressureTrend: 'falling' | 'rising' | 'stable';
  isRapidDrop: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenLogger,
  currentPressure,
  pressureTrend,
  isRapidDrop,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'weather', label: 'Pressure & Weather', icon: CloudSun },
    { id: 'analytics', label: 'Analytics & Trends', icon: BarChart3 },
    { id: 'ai-advisor', label: 'AI Weather Doctor', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Wind className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                BaroPain
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-medium">
                Master Intelligence
              </span>
            </div>
          </div>

          {/* Quick Weather Status Ticker */}
          <div className="hidden md:flex items-center space-x-4 bg-slate-50 dark:bg-slate-800/60 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm">
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{currentPressure.toFixed(1)} hPa</span>
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                pressureTrend === 'falling' 
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' 
                  : pressureTrend === 'rising'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                {pressureTrend === 'falling' ? '↓ Falling' : pressureTrend === 'rising' ? '↑ Rising' : '→ Stable'}
              </span>
            </div>
            {isRapidDrop && (
              <div className="flex items-center space-x-1 text-rose-600 dark:text-rose-400 font-medium text-xs animate-bounce">
                <ShieldAlert className="w-4 h-4" />
                <span>Rapid Front Alert!</span>
              </div>
            )}
          </div>

          {/* Action Buttons & Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenLogger}
              className="flex items-center space-x-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl font-medium text-sm shadow-sm transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Log Pain / Symptom</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-slate-100 dark:border-slate-800/60 pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    .toString() === 'true'
                    ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/60'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
