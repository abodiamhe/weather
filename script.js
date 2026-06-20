const cityEl = document.querySelector('.city');
const countryEl = document.querySelector('.country'); 
const temperatureEl = document.querySelector('.temperature');
const weather_iconEl = document.querySelector('.weather_icon');
const descriptionEl = document.querySelector('.description');
const humidityEl = document.querySelector('.humidity');
const windEl = document.querySelector('.wind');
const uv_indexEl = document.querySelector('.uv_index');
const dailyEl = document.querySelector('.daily');
const cityInputEl = document.querySelector('.city_input');
const searchFormEl = document.getElementById('search_form');
const errorEl = document.querySelector('.error'); 
const loaderEl = document.querySelector(".loader-container");
const current_containerEl = document.querySelector(".current_container");

// show loader spinner
function showLoader() {
  loaderEl.classList.remove("hidden");
}
// hide loader spinner
function hideLoader() {
  loaderEl.classList.add("hidden");
}
// show the current weather info on the hero section
function showCurrent() {
  current_containerEl.classList.remove("hidden");
}
// hide the current weather info on the hero section
function hideCurrent() {
  current_containerEl.classList.add("hidden");
} 

// Get user location
(function getLocation() {
  try {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude

        getReverseGeocoding(lat, lon) // pass lat$lon to reverse geocoding
      })
    } else {
      console.log('Location not allowed') 
      alert('Location not allowed')
    }
  } catch (err) {
    showError(err)
  } 

})()

// Get a reverse location from the generated coordinate
async function getReverseGeocoding(lat, lon) { 
  showLoader() //show loader when a user search for a city
  hideCurrent() //hide the curent info when user is searching a new city
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)

    if(!res.ok) throw new Error('failed to fetch data')


    const resData = await res.json() 
    const weatherData = await getWeather(lat, lon) //Fetch weather data for
    
    // pass both city and country data to display current city weather
    displayCurrentWeather(weatherData, resData.city, resData.countryName )

    displayForecast(weatherData.daily)
  } catch (err) {
    console.log(err)
    showError(err.message) //show error message
  } finally {
    hideLoader()
  }
}
 
// Get coordinates for a city name
async function getCoordinates(city) {  
  showLoader() //show loader when a user search for a city
  hideCurrent() //hide the curent info when user is searching a new city
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`)
    const resData = await res.json()

    if(!resData.results?.length) throw new Error('location not found!')
      
    const lat = resData.results[0].latitude
    const lon = resData.results[0].longitude
    
    const weatherData = await getWeather(lat, lon) //Fetch weather data for
    
    // pass both city and country data to display current city weather
    displayCurrentWeather(weatherData, resData.results[0].name, resData.results[0].country )

    displayForecast(weatherData.daily) 
  } catch (err) {
    console.log(err)
    showError(err.message) //show error message
    showCurrent() //fall-back to current city if no city found
  } finally {
    hideLoader()
  }
} 

// Fetch current weather and 5-day forecast
async function getWeather(lat, lon) {
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,uv_index,apparent_temperature&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=5&timezone=auto`)  
  
    if(!res.ok) throw new Error('failed to fetch data')

    showError()
    const resData = await res.json()
    console.log(resData)
    return resData
  } catch (err) {
    console.log(err)
    showError(err.message) //show error message
  }
}

// Update the DOM with current weather data
function displayCurrentWeather(data, cityName, country) {   
  showCurrent() //show the current info of weather
  const weather = getWeatherDescription(data.current.weather_code)

  weather_iconEl.innerHTML = weather.icon
  temperatureEl.innerHTML = `${data.current.temperature_2m}${data.current_units.temperature_2m}`
  cityEl.innerHTML = `${cityName}, ${country}` 
  descriptionEl.innerHTML = `${weather.description} - feels like ${data.current.apparent_temperature}${data.    current_units.apparent_temperature}`

  humidityEl.innerHTML = `${data.current.relative_humidity_2m} ${data.current_units.relative_humidity_2m}`
  windEl.innerHTML = `${data.current.wind_speed_10m}${data.current_units.wind_speed_10m}`
  uv_indexEl.innerHTML = `${getUvIndex(data.current.uv_index)}`
}

// Update the DOM with 5-day forecast
function displayForecast(daily) {
  dailyEl.innerHTML = ''

  const tempMax = daily.temperature_2m_max
  const tempMin = daily.temperature_2m_min
  const time = daily.time
  const weatherCode = daily.weather_code

  for (let i = 0; i < 5; i++) { 
    const date = new Date(time[i]).getDay() == new Date().getDay() ? 'Today' : new Date(time[i]).toLocaleDateString("en-US", {weekday: 'long'})
    const weather = getWeatherDescription(weatherCode[i])
     
    const html = `
      <div class='daily_des'>
        <p>${date}</p>
        <p class='daily_icon'>${weather.icon}</p>
        <div>
          <p>${tempMax[i]}°</p>
          <p class='temp_min'>${tempMin[i]}°</p>
        </div>
      </div>
    `
    dailyEl.insertAdjacentHTML("beforeend", html)
  } 
}

// Convert a WMO weather code to description and icon
function getWeatherDescription(code) { 
  const weatherCode = { 
    0: {
      icon: "☀",
      description: "Clear sky",
    },
    1: {
      icon: "⛅",
      description: "Partly cloudy",
    },
    2: {
      icon: "⛅",
      description: "Partly cloudy",
    },
    3: {
      icon: "⛅",
      description: "Partly cloudy",
    },
    45: {
      icon: "🌫",
      description: "Foggy",
    },
    48: {
      icon: "🌫",
      description: "Foggy",
    },

    51: {
      icon: "🌦",
      description: "Drizzle",
    },
    53: {
      icon: "🌦",
      description: "Drizzle",
    },
    55: {
      icon: "🌦",
      description: "Drizzle",
    },

    61: {
      icon: "🌧",
      description: "Rain",
    },
    63: {
      icon: "🌧",
      description: "Rain",
    },
    65: {
      icon: "🌧",
      description: "Rain",
    },
    71: {
      icon: "❄",
      description: "Snow",
    },
    73: {
      icon: "❄",
      description: "Snow",
    },
    75: {
      icon: "❄",
      description: "Snow",
    },
    80: {
      icon: "🌦",
      description: "Rain showers",
    },
    81: {
      icon: "🌦",
      description: "Rain showers",
    },
    82: {
      icon: "🌦",
      description: "Rain showers",
    },
    95: {
      icon: "⛈",
      description: "Thunderstorm",
    }, 
    96: {
      icon: "⛈",
      description: "Thunderstorm",
    },
    99: {
      icon: "⛈",
      description: "Thunderstorm",
    }, 
  }

  return weatherCode[code]
}


// Show an error message on the page
function showError(message) {
  message ? errorEl.innerHTML = message : errorEl.innerHTML = '';
}

// Main function triggered by the Search button
searchFormEl.addEventListener('submit', (e) => {
  e.preventDefault()

  const city = cityInputEl.value.trim()
  if(!city) return

  // pass search city to get coordinate
  getCoordinates(city)
})

 

// Getting the UV level from UV Index
function getUvIndex(index) {
  if(index <= 2) return 'Low'
  if(index <= 5) return 'Moderate'
  if(index <= 7) return 'High'
  if(index <= 10) return 'Very High'
  if(index > 10) return 'Extreme'
}
