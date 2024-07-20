
const apiKey = '5529ef494c6fe7f80698b62662d0a783';

// Select HTML elements
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const locationName = document.getElementById('location-name');
const weatherIcon = document.getElementById('weather-icon');
const weatherDescription = document.getElementById('weather-description');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const forecastList = document.getElementById('forecast-list');

// Event listener for search button
searchBtn.addEventListener('click', async () => {
	const location = locationInput.value.trim();
	if (location) {
		try {
			// Fetch current weather data
			const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
			const weatherData = await weatherResponse.json();

			// Update HTML elements with current weather data
			locationName.textContent = weatherData.name;
			weatherDescription.textContent = weatherData.weather[0].description;

			const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
			weatherIcon.src = iconUrl;
			weatherIcon.alt = weatherData.weather[0].description;

			temperature.textContent = `Temperature: ${weatherData.main.temp}°C`;
			humidity.textContent = `Humidity: ${weatherData.main.humidity}%`;
			windSpeed.textContent = `Wind Speed: ${weatherData.wind.speed} m/s`;

			// Fetch forecast data
			const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`);
			const forecastData = await forecastResponse.json();

			// Clear forecast list
			forecastList.innerHTML = '';

			// Process forecast data to get daily forecasts at noon (12:00 PM)
			const dailyForecasts = {};
			forecastData.list.forEach((item) => {
				const date = new Date(item.dt * 1000);
				const day = date.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });

				// Choose the forecast closest to noon (12:00 PM)
				if (!dailyForecasts[day] || Math.abs(date.getHours() - 12) < Math.abs(new Date(dailyForecasts[day].dt * 1000).getHours() - 12)) {
					dailyForecasts[day] = item;
				}
			});

			// Add forecast items to list
			for (const day in dailyForecasts) {
				const item = dailyForecasts[day];
				const date = new Date(item.dt * 1000);
				const temp = item.main.temp;
				const forecastIcon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
				const listItem = document.createElement('li');
				listItem.innerHTML = `<img src="${forecastIcon}" alt="Forecast Icon"> ${date.toLocaleDateString('en-US', { weekday: 'long' })} - ${temp}°C`;
				forecastList.appendChild(listItem);
			}
		} catch (error) {
			console.error('Error fetching weather data:', error);
		}
	}
});

