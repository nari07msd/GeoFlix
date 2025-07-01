document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("cityForm");
  const searchInput = document.getElementById("cityInput");
  main(); // initial run

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = searchInput.value.trim();
    if (city.length > 0) {
      console.log("Searching for:", city);
      main(city);
    }
  });
});

async function getLocation() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    document.getElementById("location").innerText = `📍 Location: ${data.city}, ${data.region}, ${data.country_name}`;
    return data.city;
  } catch (err) {
    console.error("Location error:", err);
    document.getElementById("location").innerText = "❌ Failed to get location";
    return "Bangalore";
  }
}

async function getWeather(city) {
  const apiKey = '82ef7eb8c710a4d63f28712218fd2b3e'; // put your real key here
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await res.json();
    if (data.cod !== 200) {
      document.getElementById("weather").innerText = "❌ Weather not found";
      return null;
    }
    const main = data.weather[0].main;
    const desc = data.weather[0].description;
    const temp = data.main.temp;
    document.getElementById("weather").innerText = `🌦 Weather: ${desc}, ${temp}°C`;
    updateBackground(main);
    return main;
  } catch (err) {
    console.error("Weather fetch error:", err);
    document.getElementById("weather").innerText = "❌ Weather failed";
    return null;
  }
}

function updateBackground(weather) {
  document.body.className = "";
  if (!weather) return;
  if (weather.includes("Rain")) document.body.classList.add("rainy");
  else if (weather.includes("Snow")) document.body.classList.add("snowy");
  else if (weather.includes("Clear")) document.body.classList.add("sunny");
  else document.body.classList.add("cloudy");
}

function getLocalTrendsMock(city) {
  const trends = ["music", "sports", "movies", "gaming"];
  const selected = trends[Math.floor(Math.random() * trends.length)];
  document.getElementById("trends").innerText = `🔥 Trend: ${selected}`;
  return selected;
}

function showVideos(keywords) {
  const videoDiv = document.getElementById("videos");
  videoDiv.innerHTML = "";
  keywords.forEach(k => {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(k + " videos")}`;
    iframe.width = "400";
    iframe.height = "225";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    videoDiv.appendChild(iframe);
  });
}

async function main(city = null) {
  const userCity = city || await getLocation();
  const weather = await getWeather(userCity);
  const trend = getLocalTrendsMock(userCity);
  showVideos(weather ? [weather, trend] : [trend]);
}
