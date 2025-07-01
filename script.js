document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("cityForm");
  const searchInput = document.getElementById("cityInput");
  
  // Initial run
  main();
  
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
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.village;
            document.getElementById("location").innerText = `📍 Location: ${city}`;
            resolve(city);
          } catch (error) {
            console.error("Reverse geocoding error:", error);
            document.getElementById("location").innerText = "📍 Could not determine city name";
            resolve("New York"); // Default fallback
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          document.getElementById("location").innerText = "📍 Location access denied. Using default city.";
          resolve("New York"); // Default fallback
        }
      );
    } else {
      document.getElementById("location").innerText = "📍 Geolocation not supported. Using default city.";
      resolve("New York"); // Default fallback
    }
  });
}

async function getWeather(city) {
  const apiKey = '82ef7eb8c710a4d63f28712218fd2b3e'; // Replace with your real API key
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
    document.getElementById("weather").innerText = "❌ Weather service failed";
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
  const cityTrends = {
    "New York": ["Broadway shows", "NYC food tour", "Central Park"],
    "London": ["British history", "London walks", "UK politics"],
    "Tokyo": ["Japanese cuisine", "Anime culture", "Tokyo nightlife"],
    "Paris": ["French cooking", "Eiffel Tower", "Paris fashion"],
    "Los Angeles": ["Hollywood tours", "LA beaches", "Celebrity homes"],
    "Sydney": ["Sydney Opera House", "Australian wildlife", "Bondi Beach"]
  };
  
  const trends = cityTrends[city] || ["travel", "food", "culture", "music"];
  const selected = trends[Math.floor(Math.random() * trends.length)];
  document.getElementById("trends").innerText = `🔥 Local trend: ${selected}`;
  return selected;
}

function showVideos(keywords) {
  const videoDiv = document.getElementById("videos");
  videoDiv.innerHTML = "";
  keywords.forEach(k => {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(k + " videos")}`;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    videoDiv.appendChild(iframe);
  });
}

async function main(city = null) {
  try {
    const userCity = city || await getLocation();
    const weather = await getWeather(userCity);
    const trend = getLocalTrendsMock(userCity);
    showVideos(weather ? [weather, trend] : [trend]);
  } catch (error) {
    console.error("Main function error:", error);
    document.getElementById("videos").innerHTML = "<p>Error loading recommendations. Please try again.</p>";
  }
}
