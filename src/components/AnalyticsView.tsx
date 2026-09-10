import React from 'react';
import { PainLog } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, BarChart, Bar } from 'recharts';
import { BarChart3, TrendingUp, Activity, AlertCircle } from 'lucide-react';

interface AnalyticsViewProps {
  painLogs: PainLog[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ painLogs }) => {
  const chartData = painLogs.map((log) => ({
    time: new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    painScore: log.painScore,
    pressure: log.barometricPressure,
    humidity: log.humidity,
  }));

  // Calculate pain type distribution
  const painTypeCounts: Record<string, number> = {};
  painLogs.forEach((log) => {
    log.painTypes.forEach((t) => {
      painTypeCounts[t] = (painTypeCounts[t] || 0) + 1;
    });
  });

  const typeChartData = Object.keys(painTypeCounts).map((key) => ({
    name: key,
    count: painTypeCounts[key],
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
          Advanced Analytics & Weather Correlation
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Barometric Pressure vs. Pain Score Analysis
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Visualize how atmospheric pressure shifts correlate directly with your logged symptom intensity over time.
        </p>
      </div>

      {painLogs.length < 2 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 text-center">
          <BarChart3 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">More Data Needed for Advanced Correlation</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Log at least 2 or 3 pain entries across different weather conditions to generate detailed dual-axis correlation charts.
          </p>
        </div>
      ) : (
        <>
          {/* Dual Axis Chart: Pressure vs Pain Score */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Pressure (hPa) vs Pain Intensity (0-10)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Notice inverse correlation: sudden drops in pressure often correspond with higher pain spikes.</p>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                  <YAxis yAxisId="left" domain={[0, 10]} stroke="#0ea5e9" fontSize={11} label={{ value: 'Pain Score', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} stroke="#8b5cf6" fontSize={11} label={{ value: 'Pressure (hPa)', angle: 90, position: 'insideRight' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      border: '1px solid #334155',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="painScore" name="Pain Score (0-10)" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 5 }} />
                  <Line yAxisId="right" type="monotone" dataKey="pressure" name="Barometric Pressure (hPa)" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pain Type Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Symptom Frequency Breakdown</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typeChartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} angle={-20} textAnchor="end" />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '12px',
                        border: '1px solid #334155',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" name="Frequency" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Meteoropathic Insights</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900">
                    <h4 className="font-bold text-sky-900 dark:text-sky-200 text-sm flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-sky-600" />
                      <span>Pressure Sensitivity Factor</span>
                    </h4>
                    <p className="text-xs text-sky-700 dark:text-sky-300 mt-1">
                      Your logs indicate a strong correlation when barometric pressure dips below 1012 hPa. Tissues expand against joint capsules and cranial nerves during low-pressure fronts.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900">
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-200 text-sm flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-indigo-600" />
                      <span>Recommended Action</span>
                    </h4>
                    <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
                      Ahead of forecasted rapid pressure drops, schedule lighter physical activities and maintain consistent hydration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
