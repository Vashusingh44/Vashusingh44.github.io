async function fetchWeather(city) {
    try {
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=e9a7ab9cba5a4cfaa02232505240702&q=${city}&aqi=no`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const location = data.location.name + ', ' + data.location.region + ', ' + data.location.country;
        const temperature = data.current.temp_c + '°C';
        const condition = data.current.condition.text;

        const weatherContainer = document.getElementById('weather-container');
        weatherContainer.innerHTML = `
            <h2>Current Weather</h2>
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Temperature:</strong> ${temperature}</p>
            <p><strong>Condition:</strong> ${condition}</p>
        `;

        fetchForecast(city);
    } catch (error) {
        console.error('Error fetching current weather data:', error);
        const weatherContainer = document.getElementById('weather-container');
        weatherContainer.innerHTML = '<p>Failed to fetch weather data. Please try again later.</p>';
    }
}

async function fetchForecast(city) {
    try {
        const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=25d6f610ec714dedb9903659240202&q=${city}&days=7&aqi=no`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const forecastContainer = document.getElementById('forecast-container');
        forecastContainer.innerHTML = '<h2>7-Day Forecast</h2>';

        data.forecast.forecastday.forEach((day) => {
            const date = new Date(day.date);
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            const temperatureHigh = parseFloat(day.day.maxtemp_c);
            const temperatureLow = parseFloat(day.day.mintemp_c);
            const temperature = (temperatureHigh + temperatureLow) / 2;
            const condition = day.day.condition.text;

            forecastContainer.innerHTML += `
                <div class="forecast-day">
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>High Temperature:</strong> ${temperatureHigh}°C</p>
                    <p><strong>Low Temperature:</strong> ${temperatureLow}°C</p>
                    <p><strong>Average Temperature:</strong> ${temperature.toFixed(1)}°C</p>
                    <p><strong>Condition:</strong> ${condition}</p>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        const forecastContainer = document.getElementById('forecast-container');
        forecastContainer.innerHTML = '<p>Failed to fetch forecast data. Please try again later.</p>';
    }
}

function handleCityChange() {
    const selectedCity = document.getElementById('city-selector').value;
    fetchWeather(selectedCity);
}

document.addEventListener('DOMContentLoaded', function () {
    const citySelector = document.getElementById('city-selector');
    const defaultOption = document.createElement('option');
    defaultOption.text = 'Select City';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    citySelector.add(defaultOption);
    
    const cities = ['North Vancouver', 'Squamish', 'Whistler', 'Surrey', 'Langley', 'Abbotsford', 'Burnaby', 'Delta'];
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.text = city;
        citySelector.add(option);
    });

    // Add event listener for city change
    citySelector.addEventListener('change', handleCityChange);

    // Fetch weather for the default city
    fetchWeather(citySelector.value);
});
