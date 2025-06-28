async function getLocation() {
  const res = await fetch("https://ipapi.co/json/");
  const data = await res.json();
  document.getElementById("location").innerText = `📍 Location: ${data.city}, ${data.region}, ${data.country_name}`;
  return data.city;
}

async function getWeather(city) {
  const apiKey = '82ef7eb8c710a4d63f28712218fd2b3e';  // Replace with your OpenWeatherMap API key
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
  const data = await res.json();
  const weatherDesc = data.weather[0].description;
  document.getElementById("weather").innerText = `🌦 Weather: ${weatherDesc}, ${data.main.temp}°C`;
  return data.weather[0].main;
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

async function main() {
  const city = await getLocation();
  const weather = await getWeather(city);
  const trend = getLocalTrendsMock(city);
  showVideos([weather, trend]);
}

main();