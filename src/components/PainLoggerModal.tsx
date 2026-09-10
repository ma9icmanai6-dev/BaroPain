import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2, Sparkles, Activity } from 'lucide-react';
import { PainLog, WeatherData } from '../types';

interface PainLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLog: (log: Omit<PainLog, 'id' | 'timestamp'>) => void;
  currentWeather: WeatherData;
}

const PAIN_TYPES = [
  'Migraine / Tension Headache',
  'Arthritis / Joint Pain',
  'Fibromyalgia Flare',
  'Lower Back Pain',
  'Sinus Pressure',
  'Neck Stiffness',
  'General Muscle Ache',
];

const BODY_LOCATIONS = [
  'Head / Temples',
  'Neck & Shoulders',
  'Hands / Fingers',
  'Knees / Legs',
  'Lower Back',
  'Jaw / Sinus',
  'Full Body',
];

const COMMON_SYMPTOMS = [
  'Fatigue / Exhaustion',
  'Brain Fog',
  'Nausea',
  'Light Sensitivity',
  'Joint Stiffness',
  'Dizziness',
  'Anxiety / Restlessness',
];

const COMMON_RELIEF = [
  'Pain Relievers (NSAIDs)',
  'Triptans / Migraine Meds',
  'Heating Pad / Warm Bath',
  'Ice Pack / Cold Compress',
  'Rest / Darkness',
  'Gentle Stretching',
  'Caffeine',
];

export const PainLoggerModal: React.FC<PainLoggerModalProps> = ({
  isOpen,
  onClose,
  onSaveLog,
  currentWeather,
}) => {
  const [painScore, setPainScore] = useState<number>(4);
  const [selectedPainTypes, setSelectedPainTypes] = useState<string[]>(['Migraine / Tension Headache']);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(['Head / Temples']);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Fatigue / Exhaustion']);
  const [selectedRelief, setSelectedRelief] = useState<string[]>(['Rest / Darkness']);
  const [notes, setNotes] = useState<string>('');
  const [medications, setMedications] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleSelection = (item: string, list: string[], setList: (l: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveLog({
      painScore,
      painTypes: selectedPainTypes,
      bodyLocations: selectedLocations,
      symptoms: selectedSymptoms,
      barometricPressure: currentWeather.currentPressure,
      pressureTrend: currentWeather.pressureTrend,
      temperature: currentWeather.temperature,
      humidity: currentWeather.humidity,
      weatherDescription: currentWeather.weatherDescription,
      notes,
      medications: medications ? medications.split(',').map((m) => m.trim()) : [],
      reliefMethods: selectedRelief,
    });

    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Log Pain & Weather Snapshot</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Current Barometric Pressure: <span className="font-semibold text-sky-600 dark:text-sky-400">{currentWeather.currentPressure.toFixed(1)} hPa</span> ({currentWeather.weatherDescription})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMessage ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Pain Log Recorded Successfully!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Barometric correlation data updated.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Pain Score Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">
                  Pain Intensity Level (0 - 10)
                </label>
                <span className={`text-lg font-bold px-3 py-1 rounded-xl ${
                  painScore <= 3 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                  painScore <= 6 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
                  'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-350'
                }`}>
                  {painScore} / 10 - {
                    painScore === 0 ? 'No Pain' :
                    painScore <= 3 ? 'Mild' :
                    painScore <= 6 ? 'Moderate' :
                    painScore <= 8 ? 'Severe' : 'Extreme'
                  }
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={painScore}
                onChange={(e) => setPainScore(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0 (None)</span>
                <span>5 (Moderate)</span>
                <span>10 (Severe)</span>
              </div>
            </div>

            {/* Pain Types */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Pain Type / Category
              </label>
              <div className="flex flex-wrap gap-2">
                {PAIN_TYPES.map((type) => {
                  const isSelected = selectedPainTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleSelection(type, selectedPainTypes, setSelectedPainTypes)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-sky-600 text-white shadow-sm shadow-sky-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Body Locations */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Affected Body Areas
              </label>
              <div className="flex flex-wrap gap-2">
                {BODY_LOCATIONS.map((loc) => {
                  const isSelected = selectedLocations.includes(loc);
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => toggleSelection(loc, selectedLocations, setSelectedLocations)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {loc}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Associated Symptoms */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Associated Symptoms
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_SYMPTOMS.map((sym) => {
                  const isSelected = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSelection(sym, selectedSymptoms, setSelectedSymptoms)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Relief Methods */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Relief / Coping Methods Used
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_RELIEF.map((rel) => {
                  const isSelected = selectedRelief.includes(rel);
                  return (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => toggleSelection(rel, selectedRelief, setSelectedRelief)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {rel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Medications input */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-1">
                Medications Taken (comma separated)
              </label>
              <input
                type="text"
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
                placeholder="e.g. Ibuprofen 400mg, Sumatriptan"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-1">
                Additional Notes / Observations
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did the weather or pressure drop feel? Any specific triggers?"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-medium text-sm shadow-md hover:from-sky-700 hover:to-indigo-700"
              >
                Save Pain Log
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
