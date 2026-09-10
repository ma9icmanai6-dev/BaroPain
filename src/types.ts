export interface PainLog {
  id: string;
  timestamp: string; // ISO string
  painScore: number; // 0 - 10
  painTypes: string[]; // e.g. 'Migraine', 'Arthritis', 'Joints', 'Back Pain', 'Sinus Pressure', 'Fibromyalgia'
  bodyLocations: string[]; // e.g. 'Head/Temples', 'Knees', 'Lower Back', 'Neck', 'Hands/Fingers'
  symptoms: string[]; // e.g. 'Fatigue', 'Brain Fog', 'Nausea', 'Stiffness', 'Sensitivity to Light'
  barometricPressure: number; // in hPa
  pressureTrend: 'falling' | 'rising' | 'stable';
  temperature: number; // in °C
  humidity: number; // %
  weatherDescription: string;
  notes?: string;
  medications?: string[];
  reliefMethods?: string[];
}

export interface WeatherData {
  city: string;
  lat: number;
  lon: number;
  currentPressure: number; // hPa
  pressureTrend: 'falling' | 'rising' | 'stable';
  temperature: number; // °C
  humidity: number; // %
  windSpeed: number; // km/h
  weatherCode: number;
  weatherDescription: string;
  isRapidDrop: boolean; // e.g. dropped > 4 hPa in last 3 hours
  forecast: ForecastItem[];
}

export interface ForecastItem {
  time: string;
  timestamp: number;
  pressure: number;
  temperature: number;
  humidity: number;
  weatherDescription: string;
  riskLevel: 'low' | 'moderate' | 'high';
}

export interface AICorrelationReport {
  summary: string;
  sensitivityScore: number; // 0 - 100
  primaryTriggers: string[];
  riskAnalysis: string;
  recommendations: string[];
  preventionTips: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
