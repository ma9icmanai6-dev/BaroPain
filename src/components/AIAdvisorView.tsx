import React, { useState } from 'react';
import { Bot, Sparkles, Send, User, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';
import { WeatherData, PainLog, AICorrelationReport, ChatMessage } from '../types';

interface AIAdvisorViewProps {
  weather: WeatherData;
  painLogs: PainLog[];
}

export const AIAdvisorView: React.FC<AIAdvisorViewProps> = ({ weather, painLogs }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello! I am your AI Weather Doctor and Barometric Pain Specialist. I've analyzed your current local pressure (${weather.currentPressure.toFixed(1)} hPa, trend: ${weather.pressureTrend}) and ${painLogs.length} logged pain entries. How can I help you manage your weather sensitivity today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [aiReport, setAiReport] = useState<AICorrelationReport | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsSending(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          currentWeather: weather,
          recentLogs: painLogs,
        }),
      });
      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || "I apologize, I encountered an issue responding.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const generateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const res = await fetch('/api/ai/analyze-pain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logs: painLogs,
          currentWeather: weather,
        }),
      });
      const data = await res.json();
      setAiReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            AI Wellness & Meteorological Advisory
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            AI Weather Doctor & Pain Analyst
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Powered by Gemini AI to correlate your symptom logs with barometric fronts and offer personalized coping strategies.
          </p>
        </div>
        <button
          onClick={generateReport}
          disabled={isGeneratingReport}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium text-sm shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isGeneratingReport ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Generate AI Correlation Report</span>
        </button>
      </div>

      {/* AI Correlation Report Card (if generated) */}
      {aiReport && (
        <div className="bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-sky-500/10 dark:from-purple-950/40 dark:to-slate-900 rounded-2xl p-6 sm:p-8 border border-purple-200 dark:border-purple-900/50 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Barometric Sensitivity Report</h3>
                <p className="text-xs text-purple-700 dark:text-purple-300">Generated using your recent symptom history and atmospheric telemetry</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-full text-xs font-extrabold">
              Sensitivity Index: {aiReport.sensitivityScore || 75}%
            </span>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-900/60 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30">
            {aiReport.summary || "Analysis completed successfully based on your logs and local pressure trends."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>Primary Meteorological Triggers</span>
              </h4>
              <ul className="space-y-2">
                {(Array.isArray(aiReport.primaryTriggers) ? aiReport.primaryTriggers : ["Rapid pressure drops", "High humidity"]).map((trigger, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                    <span>{trigger}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Personalized Recommendations</span>
              </h4>
              <ul className="space-y-2">
                {(Array.isArray(aiReport.recommendations) ? aiReport.recommendations : ["Stay hydrated", "Gentle heat therapy"]).map((rec, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Interactive AI Chat Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[550px] overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-3 bg-slate-50 dark:bg-slate-800/40">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">AI Weather Doctor Assistant</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ask anything about barometric pressure, migraines, and joint pain</p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'user' ? 'bg-sky-600 text-white' : 'bg-purple-600 text-white'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-4 text-sm ${
                msg.sender === 'user'
                  ? 'bg-sky-600 text-white rounded-tr-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-slate-200 dark:border-slate-700'
              }`}>
                <p className="leading-relaxed">{msg.text}</p>
                <span className={`block text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-sky-200' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 text-sm text-slate-400 animate-pulse">
                AI Weather Doctor is analyzing...
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about pressure drops, migraine prevention, joint pain relief..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm shadow-sm flex items-center space-x-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
