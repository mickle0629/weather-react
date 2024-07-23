export function Card({top, mid, bot, preBotIcon}) {
  return (
    <section className="card-container">
      <div className="card-container__text">{ top }</div>
      <div className="card-container__text--lg">{ mid }</div>
      <div className="card-container__text">
      { bot }
        <img src={preBotIcon}/> 
      </div>
    </section>
  )
}
//prop should be the forecastday[0].hour object
//prop should be an array of 24 elements (0 to 23 index)
export function DayForecast( { locationData, forecastDaysByHour }) {
  console.log("Day forecast data:", forecastDaysByHour);
  return (
    <section className="temperature-forecast">
      <h1 className="temperature-forecast__title">Today's 24-hr Forecast</h1>  {/* VVVVV some places dont have a region name, so this makes sure there's no floating commas */}
      <h2 className="temperature-forecast__location-name">{locationData.name}{locationData.region && ","}{locationData.region}</h2>
      <div className="temperature-forecast__cards">
        <ForecastCard timestamp="Now" temperature={forecastDaysByHour[0].temp_c}/>
        {forecastDaysByHour.slice(1).map((hour) => (
          <ForecastCard key={hour.time} timestamp={hour.time} temperature={hour.temp_c}/>
        ))}
      </div>
    </section>
  )
}

function ForecastCard({ timestamp, temperature }) {
  return (
    <div className="forecast-card">
      <div className="forecast-card__text">{timestamp === "Now" ? "Now" : timestamp.slice(11)}</div>
      <div className="forecast-card__text">{`${Math.ceil(temperature)}\u00b0C`}</div>
    </div>
  )
}

