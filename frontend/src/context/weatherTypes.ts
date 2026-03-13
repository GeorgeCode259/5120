export interface WeatherData {
  name: string;
  current: {
    uv: number;
    temp: number;
    sunrise: number;
    sunset: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    };
  };
  hourly: Array<{
    dt: number;
    temp: number;
    uvi: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
  }>;
}

export const defaultWeatherData: WeatherData = {
  name: '--',
  current: {
    uv: 0,
    temp: 0,
    sunrise: Math.floor(Date.now() / 1000),
    sunset: Math.floor(Date.now() / 1000),
    weather: {
      id: 800,
      main: 'Clear',
      description: 'clear sky',
      icon: '01d',
    },
  },
  hourly: Array(5).fill({
    dt: Math.floor(Date.now() / 1000),
    temp: 0,
    uvi: 0,
    weather: [{
      id: 800,
      main: 'Clear',
      description: 'clear sky',
      icon: '01d',
    }]
  }),
};

export interface WeatherContextType {
  weatherData: WeatherData;
  loading: boolean;
  error: string | null;
  fetchWeather: (lat?: string, lon?: string, q?: string) => Promise<void>;
  lastUpdated: number | null;
}