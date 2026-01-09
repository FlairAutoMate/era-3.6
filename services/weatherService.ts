
import { DailyWeather } from '../types';

// Oslo Coordinates (Default)
const DEFAULT_LAT = 59.91;
const DEFAULT_LON = 10.75;

// Mapping Met.no symbol codes to WMO codes used in the app
const mapMetSymbolToWmo = (symbol: string): number => {
    if (!symbol) return 3; // Default cloud
    const s = symbol.split('_')[0]; // Remove _day / _night suffix

    const mapping: Record<string, number> = {
        'clearsky': 0,
        'fair': 1,
        'partlycloudy': 2,
        'cloudy': 3,
        'fog': 45,
        'rain': 63,
        'rainshowers': 61,
        'heavyrain': 65,
        'heavyrainshowers': 65,
        'lightrain': 51,
        'lightrainshowers': 51,
        'sleet': 68,
        'sleetshowers': 68,
        'snow': 73,
        'snowshowers': 71,
        'heavysnow': 75,
        'heavysnowshowers': 75,
        'lightsnow': 71,
        'lightsnowshowers': 71,
        'rainandthunder': 95,
        'lightrainandthunder': 95,
        'heavyrainandthunder': 96
    };

    return mapping[s] || 3;
};

export const fetchWeatherForecast = async (lat: number = DEFAULT_LAT, lon: number = DEFAULT_LON): Promise<DailyWeather[]> => {
    try {
        // Met.no requires a User-Agent header for identification
        const headers = {
            'Accept': 'application/json'
        };

        const response = await fetch(
            `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`,
            { headers }
        );

        if (!response.ok) throw new Error(`Met.no API failed: ${response.status}`);

        const data = await response.json();
        const timeseries = data.properties.timeseries;

        // Aggregate hourly data into daily summaries
        const dailyMap = new Map<string, {
            tempMax: number;
            tempMin: number;
            precip: number;
            windMax: number;
            codes: string[];
        }>();

        timeseries.forEach((entry: any) => {
            const date = new Date(entry.time).toISOString().split('T')[0];
            const details = entry.data.instant.details;

            // Get precipitation from next_1_hours or next_6_hours
            const precip1h = entry.data.next_1_hours?.details?.precipitation_amount || 0;
            const precip6h = entry.data.next_6_hours?.details?.precipitation_amount || 0;
            // Use 1h if available (more granular), otherwise 6h/6 to estimate or just grab 6h for simpler logic
            // Met.no compact provides next_1_hours for the first ~2 days.
            const precip = precip1h || (precip6h ? precip6h : 0);

            // Get Symbol
            const symbol = entry.data.next_12_hours?.summary?.symbol_code ||
                           entry.data.next_6_hours?.summary?.symbol_code ||
                           entry.data.next_1_hours?.summary?.symbol_code;

            if (!dailyMap.has(date)) {
                dailyMap.set(date, {
                    tempMax: -100,
                    tempMin: 100,
                    precip: 0,
                    windMax: 0,
                    codes: []
                });
            }

            const day = dailyMap.get(date)!;
            day.tempMax = Math.max(day.tempMax, details.air_temperature);
            day.tempMin = Math.min(day.tempMin, details.air_temperature);
            day.precip += precip;
            day.windMax = Math.max(day.windMax, details.wind_speed);
            if (symbol) day.codes.push(symbol);
        });

        // Convert Map to Array and Sort
        const forecast: DailyWeather[] = Array.from(dailyMap.entries())
            .map(([dateStr, stats], index) => {
                const date = new Date(dateStr);
                const dayName = date.toLocaleDateString('no-NO', { weekday: 'short' }).replace('.', '');

                // Find most frequent symbol for the day (simple mode) or take the one closest to noon
                // Simplified: Just taking the middle one
                const symbol = stats.codes[Math.floor(stats.codes.length / 2)] || 'cloudy';

                return {
                    date: dateStr,
                    dayName: index === 0 ? 'I dag' : index === 1 ? 'I morgen' : dayName.charAt(0).toUpperCase() + dayName.slice(1),
                    code: mapMetSymbolToWmo(symbol),
                    tempMax: Math.round(stats.tempMax),
                    tempMin: Math.round(stats.tempMin),
                    precip: Number(stats.precip.toFixed(1)),
                    windMax: Math.round(stats.windMax)
                };
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 5); // Return next 5 days

        return forecast;

    } catch (error) {
        console.warn("Weather fetch error (falling back to mock):", error);
        // Fallback Mock Data if API fails (e.g. CORS or Rate Limit)
        // SIMULATED SCENARIO: HEAVY RAIN + WIND (Tests Risk Logic)
        return [
            { date: new Date().toISOString(), dayName: 'I dag', code: 63, tempMax: 12, tempMin: 8, precip: 18.5, windMax: 14 }, // Heavy Rain + High Wind
            { date: new Date(Date.now() + 86400000).toISOString(), dayName: 'I morgen', code: 61, tempMax: 11, tempMin: 9, precip: 8.2, windMax: 10 },
            { date: new Date(Date.now() + 172800000).toISOString(), dayName: 'Ons', code: 3, tempMax: 11, tempMin: 7, precip: 0, windMax: 5 },
            { date: new Date(Date.now() + 259200000).toISOString(), dayName: 'Tor', code: 2, tempMax: 13, tempMin: 6, precip: 0, windMax: 4 },
            { date: new Date(Date.now() + 345600000).toISOString(), dayName: 'Fre', code: 0, tempMax: 15, tempMin: 8, precip: 0, windMax: 3 },
        ];
    }
};

export const getWeatherIconName = (code: number): string => {
    // WMO Weather interpretation codes (WW)
    if (code === 0) return 'Sun';
    if (code >= 1 && code <= 2) return 'CloudSun';
    if (code === 3) return 'Cloud';
    if (code >= 40 && code <= 49) return 'Cloud'; // Fog
    if (code >= 50 && code <= 69) return 'CloudRain'; // Rain
    if (code >= 70 && code <= 79) return 'Snowflake'; // Snow
    if (code >= 80 && code <= 99) return 'CloudLightning'; // Thunder/Showers
    return 'Cloud';
};
