document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("cityForm");
  const searchInput = document.getElementById("cityInput");
  main(); // run with IP initially

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = searchInput.value.trim();
    if (city) main(city);
  });
});

async function getLocation() {
  const res = await fetch("https://ipapi.co/json/");
  const data = await res.json();
  document.getElementById("location").innerText = `📍 Location: ${data.city}, ${data.region}, ${data.country_name}`;
  return data.city;
}

async function getWeather(city) {
  const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual key
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
  const data = await res.json();
  const weatherMain = data.weather[0].main;
  const weatherDesc = data.weather[0].description;
  const temp = data.main.temp;

  document.getElementById("weather").innerText = `🌦 Weather: ${weatherDesc}, ${temp}°C`;
  updateBackground(weatherMain);
  return weatherMain;
}

function updateBackground(weather) {
  const body = document.body;
  if (weather.includes("Rain")) {
    body.className = "rainy";
  } else if (weather.includes("Snow")) {
    body.className = "snowy";
  } else if (weather.includes("Clear") || weather.includes("Sunny")) {
    body.className = "sunny";
  } else {
    body.className = "cloudy";
  }
}

function getLocalTrendsMock(city) {
  const trends = ["food", "music", "sports", "movies"];
  const selected = trends[Math.floor(Math.random() * trends.length)];
  document.getElementById("trends").innerText = `🔥 Trend: ${selected}`;
  return selected;
}

function showVideos(keywords) {
  const videoDiv = document.getElementById("videos");
  videoDiv.innerHTML = "";
  keywords.forEach(keyword => {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(keyword)} videos`;
    iframe.width = "400";
    iframe.height = "225";
    iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
    videoDiv.appendChild(iframe);
  });
}

async function main(cityName = null) {
  const city = cityName || await getLocation();
  const weather = await getWeather(city);
  const trend = getLocalTrendsMock(city);
  showVideos([weather, trend]);
}
