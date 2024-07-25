import { Card, DayForecast } from './lib/components';
import './App.css';
import './lib/component-styles.css'
import { useEffect, useRef, useState } from 'react';
import { WeatherApi } from './lib/api/weatherApi';
import { formatDate, generateHourlyForecast, addLocationNameToLocalStorage } from './lib/utils';
function App() {
  const [forecastData, setForecastData] = useState(null);
  const [locationSearchTerm, setLocationSearchTerm] = useState(null)
  //originally, forecastDataList was to hold entire forecast objects as returned by each individual
  //API calls as a means to handle saving searches, but this was unnecessary and ineffective, so now
  //it is an array that holds the search terms (string) instead. This is to clarify any naming confusion
  const [forecastDataList, setForecastDataList] = useState([])

  useEffect(() => {
    if (!localStorage.getItem("forecastDataList")) {
      localStorage.setItem("forecastDataList", "[]");
    }
    setForecastDataList(JSON.parse(localStorage.getItem("forecastDataList")))
  }, []) //on component mount, if there's no key "forecastDataList" in localStorage or 
         //if the key has an empty value, initialize it with an empty array

  useEffect(() => {
    WeatherApi(locationSearchTerm ? locationSearchTerm : "95138").fetchForecastData(3).then(res => {
      console.log("Fetch results:", res)
      setForecastData(res);
    })
  }, [locationSearchTerm]) //pull data from API on mount or if there is a new search term.

  //if data is yet to be pulled, don't render anything
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
  //this const is to be passed as a prop into DayForecast
  const hourlyForecast = generateHourlyForecast(forecastData.forecast.forecastday);

  function handleLocationSubmit(e) {
    e.preventDefault();
    //pull location search term from input form
    const zipFormData = (new FormData(e.target)).get('zip')
    console.log("zipFormData",zipFormData);
    //set new location search term as state var
    setLocationSearchTerm(zipFormData);
    //empty the input bar
    document.querySelector(".top-bar__location-input").value = "";
    //add search term to local storage to track search history
    addLocationNameToLocalStorage(zipFormData)
    setForecastDataList([...forecastDataList, zipFormData]);
  }
  
  function handleSelectLocation(inboundForecastData) {
    setLocationSearchTerm(inboundForecastData);
  }

  return (
    <main className='app-container'>
      <nav className='top-bar'>
        <form className='top-bar__location-form' onSubmit={handleLocationSubmit}>
          <input className='top-bar__location-input' name="zip" placeholder="ZIP Code, City Name, State..." required/>
          <button className='top-bar__btn' type='submit'>Save</button>
        </form>
        {forecastDataList.map(fcd => (
          <button key={fcd} 
            className='top-bar__btn top-bar__btn--location' 
            onClick={() => (
              handleSelectLocation(fcd)
            )}>
              {fcd}
          </button>
        ))}
        <button className='top-bar__btn'>Delete</button>
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
