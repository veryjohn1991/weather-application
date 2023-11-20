```javascript
// Variables to store references to HTML elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentConditionsContainer = document.getElementById('current-conditions');
const forecastContainer = document.getElementById('forecast');
const searchHistoryContainer = document.getElementById('search-history');

// Event listener for search form submission
searchForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const cityName = cityInput.value;

    // Make API request to get weather data for the entered city
    getWeatherData(cityName)
        .then(function (weatherData) {
            // Display the current and forecasted weather data
            displayCurrentConditions(weatherData.current);
            displayForecast(weatherData.forecast);
            
            // Store the searched city in the search history
            addToSearchHistory(cityName);
        })
        .catch(function (error) {
            // Display error message
            console.error(error);
            alert('An error occurred while fetching weather data.');
        });

    // Reset the input field value
    cityInput.value = '';
});

// Function to make API request and get weather data
function getWeatherData(cityName) {
    const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    return fetch(apiUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Failed to fetch weather data.');
            }
        
            return response.json();
        })
        .then(function (weatherData) {
            // Extract required data from API response
            const currentWeather = {
                name: weatherData.name,
                date: new Date(),
                icon: weatherData.weather[0].icon,
                temperature: weatherData.main.temp,
                humidity: weatherData.main.humidity,
                windSpeed: weatherData.wind.speed
            };

            return getForecastData(cityName)
                .then(function (forecastData) {
                    const weatherData = {
                        current: currentWeather,
                        forecast: forecastData
                    };

                    return weatherData;
                });
        });
}

// Function to make API request and get forecast data
function getForecastData(cityName) {
    const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

    return fetch(apiUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Failed to fetch forecast data.');
            }

            return response.json();
        })
        .then(function (forecastData) {
            // Extract required data from API response
            const forecasts = forecastData.list.map(function (forecast) {
                return {
                    date: new Date(forecast.dt * 1000),
                    icon: forecast.weather[0].icon,
                    temperature: forecast.main.temp,
                    humidity: forecast.main.humidity,
                    windSpeed: forecast.wind.speed
                };
            });

            return forecasts;
        });
}

// Function to display current weather conditions
function displayCurrentConditions(currentWeather) {
    currentConditionsContainer.innerHTML = `
        <div class="city-name">${currentWeather.name}</div>
        <div class="date">${currentWeather.date.toLocaleDateString()}</div>
        <img class="weather-icon" src="https://openweathermap.org/img/wn/${currentWeather.icon}.png" alt="Weather Icon">
        <div class="temperature">${convertKelvinToCelsius(currentWeather.temperature)}°C</div>
        <div class="humidity">Humidity: ${currentWeather.humidity}%</div>
        <div class="wind-speed">Wind Speed: ${currentWeather.windSpeed} m/s</div>
    `;
}

// Function to display forecast
function displayForecast(forecastData) {
    forecastContainer.innerHTML = '';

    forecastData.forEach(function (forecast) {
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <div class="date">${forecast.date.toLocaleDateString()}</div>
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${forecast.icon}.png" alt="Weather Icon">
            <div class="temperature">${convertKelvinToCelsius(forecast.temperature)}°C</div>
            <div class="humidity">Humidity: ${forecast.humidity}%</div>
            <div class="wind-speed">Wind Speed: ${forecast.windSpeed} m/s</div>
        `;

        forecastContainer.appendChild(forecastItem);
    });
}

// Function to convert temperature from Kelvin to Celsius
function convertKelvinToCelsius(temperature) {
    return Math.round(temperature - 273.15);
}

// Function to add city to search history
function addToSearchHistory(city) {
    const historyItem = document.createElement('div');
    historyItem.classList.add('history-item');
    historyItem.textContent = city;

    historyItem.addEventListener('click', function () {
        cityInput.value = city;
        searchForm.dispatchEvent(new Event('submit'));
    });

    searchHistoryContainer.appendChild(historyItem);
}
```