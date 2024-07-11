import clsx from "clsx";

export function Card({top, mid, bot, preBotIcon, isForecastCard}) {
  return (
    <section className={clsx("card-container", isForecastCard && "card-container--forecast-card")}>
      <div className="card-container__text">{ top }</div>
      <div className="card-container__text">{ mid }</div>
      <div className="card-container__text">{ bot }</div>
    </section>
  )
}
//prop should be the forecastday[0].hour object
//prop should be an array of 24 elements (0 to 23 index)
export function DayForecast( { locationData, forecastDaysByHour }) {
  console.log("Day forecast data:", forecastDaysByHour);
  return (
    <section className="temperature-forecast">
      <h1 className="temperature-forecast__title">Today's Forecast</h1>
      <h2 className="temperature-forecast__location-name">{locationData.name}, {locationData.region}</h2>
      <div className="temperature-forecast__cards">
        <Card top="Now" mid={forecastDaysByHour[0].temp_c} isForecastCard={true}/>
        {forecastDaysByHour.slice(1).map((hour) => (
          <Card top={hour.time.slice(11)} mid={hour.temp_c} isForecastCard={true}/>
        ))}
      </div>
    </section>
  )
}

