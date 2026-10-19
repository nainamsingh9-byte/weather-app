
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const message = document.getElementById("message");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weatherIcon");

// City ke naam se uski location khojna
async function getWeather() {
    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name!";
        return;
    }

    message.textContent = "Weather loading...";
    searchBtn.disabled = true;

    try {
        const cityURL =
            "https://geocoding-api.open-meteo.com/v1/search?name=" +
            encodeURIComponent(city) +
            "&count=1&language=en&format=json";

        const cityResponse = await fetch(cityURL);
        if (!cityResponse.ok) throw new Error("City search failed");

        const cityData = await cityResponse.json();

        if (!cityData.results || cityData.results.length === 0) {
            message.textContent = "City nahi mili. Naam check karo!";
            return;
        }

        const place = cityData.results[0];

        // Location ke coordinates se weather lana
        const weatherURL =
            "https://api.open-meteo.com/v1/forecast" +
            "?latitude=" + place.latitude +
            "&longitude=" + place.longitude +
            "&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m" +
            "&timezone=auto";

        const weatherResponse = await fetch(weatherURL);
        if (!weatherResponse.ok) throw new Error("Weather request failed");

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        cityName.textContent = place.name +
            (place.country ? ", " + place.country : "");

        temperature.textContent =
            Math.round(current.temperature_2m) + "°C";

        humidity.textContent =
            current.relative_humidity_2m + "%";

        wind.textContent =
            current.wind_speed_10m + " km/h";

        condition.textContent = getCondition(current.weather_code);
        weatherIcon.textContent = getIcon(
            current.weather_code,
            current.is_day
        );

        message.textContent = "Weather updated successfully!";

    } catch (error) {
        message.textContent =
            "Weather load nahi hua. Internet check karke dobara try karo.";
        console.error(error);
    } finally {
        searchBtn.disabled = false;
    }
}

// Weather code ko readable condition banana
function getCondition(code) {
    if (code === 0) return "Clear sky";
    if ([1, 2, 3].includes(code)) return "Partly cloudy";
    if ([45, 48].includes(code)) return "Foggy";
    if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
        return "Rainy";
    }
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowy";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";
    return "Weather information available";
}

// Weather ke hisaab se emoji
function getIcon(code, isDay) {
    if (code === 0) return isDay ? "☀️" : "🌙";
    if ([1, 2, 3].includes(code)) return "⛅";
    if ([45, 48].includes(code)) return "🌫️";
    if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
        return "🌧️";
    }
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
    if ([95, 96, 99].includes(code)) return "⛈️";
    return "🌤️";
}

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        getWeather();
    }
});
