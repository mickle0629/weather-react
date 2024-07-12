import { Card, DayForecast } from './lib/components';
import './App.css';
import './lib/component-styles.css'
import { useEffect, useRef, useState } from 'react';
import { WeatherApi } from './lib/api/weatherApi';
import { formatDate, generateHourlyForecast } from './lib/utils';

function App() {
  const [forecastData, setForecastData] = useState(null);
  const [locationSearchTerm, setLocationSearchTerm] = useState(null)
  useEffect(() => {
    WeatherApi(locationSearchTerm ? locationSearchTerm : "95138").fetchForecastData(3).then(res => {
      console.log("Fetch results:", res)
      setForecastData(res);
    })
  }, [locationSearchTerm])

  if (!forecastData) {
    return <></>
  }

  //destructuring data for current weather card
  const {
    last_updated_epoch: currentTimeEpoch, 
    temp_c: currentTempC, 
    condition: { text: conditionText, icon: conditionIcon } 
  } = forecastData.current;
  //destructuring data for lows-high forecast card + precip + uvi
  const {
    mintemp_c: minTempC,
    maxtemp_c: maxTempC,
    totalprecip_mm: totalPrecipitationMM,
    uv
  } = forecastData.forecast.forecastday[0].day;

  const { location } = forecastData;
  //generate array of hourly forecast entries from forecastday.hour based on current time
  const hourlyForecast = generateHourlyForecast(forecastData.forecast.forecastday);

  function handleLocationSubmit(e) {
    e.preventDefault();
    const zipFormData = (new FormData(e.target)).get('zip')
    console.log(zipFormData);
    setLocationSearchTerm(zipFormData);

  }
  

  return (
    <main className='app-container'>
      <nav className='top-bar'>
        <form className='top-bar__location-form' onSubmit={handleLocationSubmit}>
          <input className='top-bar__location-input' name="zip" placeholder="ZIP Code, City Name, State..."/>
        </form>
      </nav>
      <section className='weather-container'>
        {/* currentTimeEpoch is in seconds, so i gotta convert it to ms */}
        <div className='weather-container__current-weather'>
          <Card top={formatDate(new Date(currentTimeEpoch * 1000))} mid={`${Math.ceil(currentTempC)}\u00b0C`} bot={conditionText} preBotIcon={conditionIcon}/>
          <Card top="Lows - Highs" mid={`${Math.ceil(minTempC)}\u00b0C - ${Math.ceil(maxTempC)}\u00b0C`}/>
          <Card top="Precipitation" mid={`${totalPrecipitationMM}mm`} bot="DESC PLCHDR"/>
          <Card top="UV Index" mid={uv} bot="DESC PLCHDR"/>
        </div>
        <div className='weather-container__forecast'>
          <DayForecast locationData={location} forecastDaysByHour={hourlyForecast}/>
        </div>
      </section>
    </main>
  )
}

export default App;
