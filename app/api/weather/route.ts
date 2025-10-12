import { NextResponse } from 'next/server';

/**
 * Weather API for Fishing Conditions
 * 
 * Provides weather data optimized for fishing:
 * - Current conditions
 * - Hourly forecast
 * - Fishing conditions score
 * - Barometric pressure trends
 * - Wind conditions
 * 
 * Note: Using sample data - integrate with Weather API in production
 * (OpenWeatherMap, WeatherAPI.com, or NOAA)
 */

interface WeatherConditions {
  location: {
    name: string;
    lat: number;
    lon: number;
  };
  current: {
    timestamp: number;
    temp: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: string;
    conditions: string;
    icon: string;
    cloudCover: number;
    visibility: number;
  };
  forecast: {
    hour: number;
    temp: number;
    conditions: string;
    precipitation: number;
    windSpeed: number;
  }[];
  fishing: {
    score: number; // 0-100
    rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    factors: {
      temperature: string;
      pressure: string;
      wind: string;
      cloudCover: string;
      precipitation: string;
    };
    tips: string[];
  };
  moonPhase: {
    phase: string;
    illumination: number;
    emoji: string;
  };
  solunar: {
    majorPeriods: { start: string; end: string }[];
    minorPeriods: { start: string; end: string }[];
    rating: number; // 0-10
  };
}

// Sample weather data
const getSampleWeather = (lat: number, lon: number): WeatherConditions => {
  // Determine fishing score based on time and conditions
  const hour = new Date().getHours();
  const isGoodTime = (hour >= 6 && hour <= 10) || (hour >= 16 && hour <= 20);
  const baseScore = isGoodTime ? 75 : 60;
  
  return {
    location: {
      name: 'Central PA',
      lat,
      lon
    },
    current: {
      timestamp: Date.now(),
      temp: 68,
      feelsLike: 65,
      humidity: 62,
      pressure: 30.05,
      windSpeed: 8,
      windDirection: 'NW',
      conditions: 'Partly Cloudy',
      icon: '⛅',
      cloudCover: 45,
      visibility: 10
    },
    forecast: [
      { hour: 8, temp: 62, conditions: 'Partly Cloudy', precipitation: 0, windSpeed: 6 },
      { hour: 10, temp: 66, conditions: 'Partly Cloudy', precipitation: 0, windSpeed: 7 },
      { hour: 12, temp: 70, conditions: 'Mostly Sunny', precipitation: 0, windSpeed: 9 },
      { hour: 14, temp: 72, conditions: 'Mostly Sunny', precipitation: 0, windSpeed: 10 },
      { hour: 16, temp: 71, conditions: 'Partly Cloudy', precipitation: 0, windSpeed: 8 },
      { hour: 18, temp: 67, conditions: 'Partly Cloudy', precipitation: 5, windSpeed: 7 },
      { hour: 20, temp: 63, conditions: 'Mostly Clear', precipitation: 0, windSpeed: 5 }
    ],
    fishing: {
      score: baseScore,
      rating: baseScore >= 75 ? 'Excellent' : baseScore >= 60 ? 'Good' : baseScore >= 40 ? 'Fair' : 'Poor',
      factors: {
        temperature: '✅ Optimal (60-70°F)',
        pressure: '✅ Stable and rising',
        wind: '✅ Light breeze (5-10 mph)',
        cloudCover: '✅ Partly cloudy (ideal)',
        precipitation: '✅ No rain expected'
      },
      tips: [
        'Early morning (6-10am) and evening (4-8pm) are peak feeding times',
        'Stable barometric pressure favors active feeding',
        'Try topwater lures in partly cloudy conditions',
        'Light wind creates ideal water movement',
        'Focus on shaded areas during midday'
      ]
    },
    moonPhase: {
      phase: 'Waxing Gibbous',
      illumination: 73,
      emoji: '🌔'
    },
    solunar: {
      majorPeriods: [
        { start: '06:30', end: '08:30' },
        { start: '18:45', end: '20:45' }
      ],
      minorPeriods: [
        { start: '00:15', end: '01:15' },
        { start: '12:30', end: '13:30' }
      ],
      rating: 8
    }
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '40.8');
  const lon = parseFloat(searchParams.get('lon') || '-77.8');

  try {
    // In production, fetch from weather API:
    // const apiKey = process.env.WEATHER_API_KEY;
    // const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    // const response = await fetch(url);
    // const data = await response.json();

    const weatherData = getSampleWeather(lat, lon);

    return NextResponse.json({
      success: true,
      data: weatherData,
      source: 'Sample Data - Integrate with Weather API in production'
    });
  } catch (error) {
    console.error('Weather API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch weather data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Calculate fishing conditions score
 * Based on multiple weather factors
 */
function calculateFishingScore(weather: any): number {
  let score = 50; // Base score

  // Temperature factor (optimal 55-75°F)
  const temp = weather.main.temp;
  if (temp >= 55 && temp <= 75) {
    score += 15;
  } else if (temp >= 45 && temp <= 85) {
    score += 5;
  }

  // Pressure factor (stable/rising is best)
  const pressure = weather.main.pressure;
  if (pressure >= 30.0 && pressure <= 30.5) {
    score += 15;
  } else if (pressure >= 29.8 && pressure <= 30.8) {
    score += 5;
  }

  // Wind factor (light wind is best)
  const windSpeed = weather.wind.speed;
  if (windSpeed >= 3 && windSpeed <= 10) {
    score += 10;
  } else if (windSpeed >= 1 && windSpeed <= 15) {
    score += 5;
  }

  // Cloud cover factor
  const clouds = weather.clouds.all;
  if (clouds >= 30 && clouds <= 70) {
    score += 10; // Partly cloudy is ideal
  } else if (clouds < 30 || clouds > 70) {
    score += 5;
  }

  // Time of day bonus
  const hour = new Date().getHours();
  if ((hour >= 6 && hour <= 10) || (hour >= 16 && hour <= 20)) {
    score += 10; // Dawn and dusk
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * Get moon phase and solunar times
 * Solunar theory: Fish feeding activity peaks during moon rise/set
 */
function getSolunarTimes(lat: number, lon: number, date: Date) {
  // In production, use proper astronomical calculations
  // For now, return sample data
  
  const moonPhases = [
    { phase: 'New Moon', illumination: 0, emoji: '🌑' },
    { phase: 'Waxing Crescent', illumination: 25, emoji: '🌒' },
    { phase: 'First Quarter', illumination: 50, emoji: '🌓' },
    { phase: 'Waxing Gibbous', illumination: 75, emoji: '🌔' },
    { phase: 'Full Moon', illumination: 100, emoji: '🌕' },
    { phase: 'Waning Gibbous', illumination: 75, emoji: '🌖' },
    { phase: 'Last Quarter', illumination: 50, emoji: '🌗' },
    { phase: 'Waning Crescent', illumination: 25, emoji: '🌘' }
  ];

  const dayOfMonth = date.getDate();
  const phaseIndex = Math.floor((dayOfMonth % 29.5) / 3.7);
  const currentPhase = moonPhases[Math.min(phaseIndex, moonPhases.length - 1)];

  // Solunar rating based on moon phase
  const rating = currentPhase.illumination === 0 || currentPhase.illumination === 100 ? 10 : 
                 currentPhase.illumination === 50 ? 8 : 6;

  return {
    moonPhase: currentPhase,
    solunar: {
      majorPeriods: [
        { start: '06:30', end: '08:30' },
        { start: '18:45', end: '20:45' }
      ],
      minorPeriods: [
        { start: '00:15', end: '01:15' },
        { start: '12:30', end: '13:30' }
      ],
      rating
    }
  };
}

/**
 * TODO: Production Implementation
 * 
 * 1. Get Weather API key:
 *    - OpenWeatherMap: https://openweathermap.org/api
 *    - WeatherAPI: https://www.weatherapi.com/
 *    - NOAA: https://www.weather.gov/documentation/services-web-api
 * 
 * 2. Add to .env.local:
 *    WEATHER_API_KEY=your_key_here
 * 
 * 3. Implement astronomical calculations:
 *    - Use SunCalc library for accurate sun/moon times
 *    - Calculate solunar tables based on location
 *    - Add moon phase calculations
 * 
 * 4. Add caching:
 *    - Cache weather data for 30 minutes
 *    - Cache forecasts for 3 hours
 *    - Implement background refresh
 * 
 * 5. Add weather alerts:
 *    - Severe weather warnings
 *    - Fishing advisories
 *    - Water level alerts
 */

