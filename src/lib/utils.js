export function formatDate(date) {
  console.log("Typeof date:", date)

  return `${dayNumToString(date.getDay())}, ${monthNumToString(date.getMonth())} ${date.getDate()}, ${date.getFullYear()}`
  
}

function monthNumToString(num) {
  const monthMapping = new Map([
    [0, "January"],
    [1, "February"],
    [2, "March"],
    [3, "April"],
    [4, "May"],
    [5, "June"],
    [6, "July"],
    [7, "August"],
    [8, "September"],
    [9, "October"],
    [10, "November"],
    [11, "December"]
  ]);

  return monthMapping.get(num);
}

function dayNumToString(num) {
  const mapping = new Map([
    [0, "Sunday"],
    [1, "Monday"],
    [2, "Tuesday"],
    [3, "Wednesday"],
    [4, "Thursday"],
    [5, "Friday"],
    [6, "Saturday"]
  ]);
  return mapping.get(num)
}

 //generate array of hourly forecast entries from forecastday.hour based on current time
export function generateHourlyForecast(forecastDay) {
  const hourlyResult = [];
  //figure out NOW element
  const closestHourly = forecastDay[0].hour.reduce((closest, hour) => {
    const now_epoch = (new Date).valueOf() / 1000
    const currentAbsDifference = Math.abs(hour.time_epoch - now_epoch)
    return currentAbsDifference < Math.abs(closest.time_epoch - now_epoch) ? hour : closest
  }, forecastDay[0].hour[0])
  hourlyResult.push(...forecastDay[0].hour.slice(forecastDay[0].hour.indexOf(closestHourly)));
  console.log("First hourly forecast object: ", closestHourly);
  

  //load the rest of the hourly entries if hourlyREsult isn't 24 elements.
  let i = 0;
  while(hourlyResult.length < 24) {
    hourlyResult.push(forecastDay[1].hour[i]);
    i++;
  }
  console.log("Current state of hourlyResult:", hourlyResult)
  return hourlyResult;
}

//assumes there is a key in localStorage "forecastDataList" - an array of strings
//the strings are previous search terms submitted
//these strings are to be used to fetchData when user wants to pull forecast data related to the location again
export function addLocationNameToLocalStorage(locName) {
  const locationList = JSON.parse(localStorage.getItem('forecastDataList'));
  if (locationList.constructor !== Array) {
    throw new Error("forecastDataList in localStorage is not an array");
  }
  if (locationList.includes(locName)) {
    return;
  } 
  localStorage.setItem("forecastDataList", JSON.stringify([...locationList, locName]))
}