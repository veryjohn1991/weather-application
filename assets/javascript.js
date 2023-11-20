const apiKey = 'a85c611f5e768531bfda006c098acd75';
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const searchHistory = document.getElementById('search-history');

// Function to fetch current weather data
function fetchCurrentWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            // Process the data and display it in the "current-weather" section
            const cityName = data.name;
            const temperatureCelsius = data.main.temp;
            const temperatureFahrenheit = (temperatureCelsius * 9/5) + 32; // Convert to Fahrenheit
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;

            // Update the "current-weather" section with the data
            currentWeather.innerHTML = `
                <h2>${cityName}</h2>
                <p>Temperature: ${temperatureFahrenheit}°F (${temperatureCelsius}°C)</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
            `;

            // Call the fetchForecast function with latitude and longitude
            fetchForecast(data.coord.lat, data.coord.lon);

            // Store the searched city in local storage
            storeCityInLocalStorage(city);
        })
        .catch((error) => {
            console.error('Error fetching current weather:', error);
        });
}

// Function to fetch 5-day forecast data using latitude and longitude
function fetchForecast(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            // Process the data and display it in the "forecast" section
            forecast.innerHTML = ''; // Clear previous forecast data

            const forecastData = data.list; // Get the complete forecast data

            // Create an object to group forecast data by day
            const groupedData = {};

            // Loop through the forecast data and group it by day
            forecastData.forEach((item) => {
                const date = new Date(item.dt * 1000);
                const dateString = date.toDateString();

                if (!groupedData[dateString]) {
                    groupedData[dateString] = item;
                }
            });

            // Loop through the grouped data and create elements for each day's forecast
            for (const dateString in groupedData) {
                const item = groupedData[dateString];
                const date = new Date(item.dt * 1000);
                const timeString = date.toLocaleTimeString();

                const temperatureCelsius = item.main.temp;
                const temperatureFahrenheit = (temperatureCelsius * 9/5) + 32; // Convert to Fahrenheit
                const humidity = item.main.humidity;
                const windSpeed = item.wind.speed;
                const weatherIcon = item.weather[0].icon;

                // Create a container for each forecast item
                const forecastItem = document.createElement('div');
                forecastItem.classList.add('forecast-item'); 

                // Update the forecastItem element with forecast information
                forecastItem.innerHTML = `
                    <h3>${dateString} - ${timeString}</h3>
                    <img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
                    <p>Temperature: ${temperatureFahrenheit}°F (${temperatureCelsius}°C)</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Wind Speed: ${windSpeed} m/s</p>
                `;

                // Append the forecastItem to the "forecast" section
                forecast.appendChild(forecastItem);
            }
        })
        .catch((error) => {
            console.error('Error fetching forecast:', error);
        });
}

// Function to store a city in local storage
function storeCityInLocalStorage(city) {
    // Check if local storage is available in the browser
    if (typeof(Storage) !== "undefined") {
        // Retrieve the existing search history from local storage (if any)
        let searchHistoryList = JSON.parse(localStorage.getItem('searchHistory')) || [];

        // Add the new city to the search history
        searchHistoryList.push(city);

        // Save the updated search history back to local storage
        localStorage.setItem('searchHistory', JSON.stringify(searchHistoryList));

        // Update the search history UI
        updateSearchHistoryUI(searchHistoryList);
    } else {
        console.error('Local storage is not supported in this browser.');
    }
}

// Function to update the search history UI
function updateSearchHistoryUI(searchHistoryList) {
    // Clear the existing search history UI
    searchHistory.innerHTML = '';

    // Populate the search history UI with the stored cities
    searchHistoryList.forEach((city) => {
        const listItem = document.createElement('li');
        listItem.textContent = city;
        searchHistory.appendChild(listItem);

        // Add an event listener to the list item to allow clicking on a city in the history
        listItem.addEventListener('click', () => {
            fetchCurrentWeather(city);
        });
    });
}

// Event listener for the form submission
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();

    if (city) {
        fetchCurrentWeather(city);
        cityInput.value = ''; // Clear the input field
    }
});
// Function to store a city in local storage
function storeCityInLocalStorage(city) {
    // Check if local storage is available in the browser
    if (typeof(Storage) !== "undefined") {
        // Retrieve the existing search history from local storage (if any)
        let searchHistoryList = JSON.parse(localStorage.getItem('searchHistory')) || [];

        // Add the new city to the search history
        searchHistoryList.push(city);

        // Ensure that the search history contains at most 5 items
        if (searchHistoryList.length > 5) {
            searchHistoryList.shift(); // Remove the oldest search
        }

        // Save the updated search history back to local storage
        localStorage.setItem('searchHistory', JSON.stringify(searchHistoryList));

        // Update the search history UI
        updateSearchHistoryUI(searchHistoryList);
    } else {
        console.error('Local storage is not supported in this browser.');
    }
}