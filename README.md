# Weather Forecast App
This is a simple Weather Forecast app written in React. Used for practice purposes

## Author
An Dang - anppdang@gmail.com

## Installation
- Acquire an API key from [WeatherAPI](https://www.weatherapi.com/)
- Clone project
- `npm install` for dependencies
- Setup a `secrets.js` under `/src` as follows:
  ```js
  // /src/secrets.js
  export const SECRETS = {
    API_BASE_URL: "https://api.weatherapi.com/v1/",
    API_KEY: "YOUR WEATHER API KEY",
    FORECAST: "forecast.json"
  }
  ```
- `npm start` to run local dev server

## Features
- Pulls and displays weather forecast data from WeatherAPI.
- Search a location to display weather forecast data via ZIP code or city name.

## Work In Progress:
- Save search results to top-bar for later access. (Branch `feature/saved-location`)