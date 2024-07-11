import { SECRETS } from "../../secrets";

export function WeatherApi(location) {
  async function fetchForecastData(forecastDays) {
    try {
      const forecast = await fetch(`${SECRETS.API_BASE_URL}${SECRETS.FORECAST}?q=${location}&days=${forecastDays}&key=${SECRETS.API_KEY}`);
      const data = await forecast.json();
      return data;
    } catch (error) {
      throw new Error("FETCHING FORECAST DATA FAILED");
    } 
  }

  return {
    fetchForecastData
  }
}