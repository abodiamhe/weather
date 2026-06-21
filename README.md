## Altschool details
* name: akhigbe sadiq
* student ID: ALT/SOE/BAR/026/0110 
* site: https://abodiamhe.github.io/weather/

# Weather App 

A simple and responsive weather application that automatically detects the user's location on first visit and displays the current weather along with a 5-day forecast. Users can also search for any city worldwide to view its weather information.

## Features

* 📍 Automatic location detection using the browser Geolocation API
* 🌡️ Current weather conditions
* 📅 5-day weather forecast
* 🔍 Search weather by city name
* ☁️ Weather icons and descriptions
* 💨 Wind speed, humidity, and UV index display
* ⚡ Loading and error handling states
* 📱 Responsive design for desktop and mobile devices

## Technologies Used

* HTML5
* CSS3
* JavaScript (ES6+)
* Geolocation API
* Open-Meteo Weather API
* Open-Meteo Geocoding API

## How It Works

### 1. Automatic Location Detection

When the application loads for the first time, it requests permission to access the user's location using the browser's Geolocation API.

```javascript
navigator.geolocation.getCurrentPosition(...)
```

The latitude and longitude coordinates are then used to fetch weather data from the Open-Meteo API.

### 2. City Search

Users can search for any city using the search input. The application first retrieves the city's coordinates using the Open-Meteo Geocoding API and then requests the weather data for that location.

### 3. Weather Data Retrieval

The application makes two API requests:

#### Geocoding Request

Used to convert a city name into coordinates.

```text
https://geocoding-api.open-meteo.com/v1/search
```

#### Weather Request

Used to fetch current weather and a 5-day forecast.

```text
https://api.open-meteo.com/v1/forecast
```

### 4. Data Display

The application displays:

* Current temperature
* Weather condition
* Humidity
* Wind speed
* UV index
* Maximum and minimum daily temperatures
* Weather forecast for the next 5 days

## Project Structure

```text
weather-app/
│
├── index.html
├── style.css
├── script.js
├── README.md
```

## Getting Started

1. Clone the repository

```bash
git clone <repository-url>
```

2. Open the project folder

```bash
cd weather-app
```

3. Launch `index.html` in your browser.

No additional dependencies or build tools are required.

## Author

Built as a end of semester project at Altschool of engineering.

