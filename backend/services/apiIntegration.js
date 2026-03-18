// backend/services/apiIntegration.js
const fetch = require("node-fetch");
const { LOCATIONS } = require("../utils/constants");

// ----------------- Weather Impact -----------------
function fetchWeatherImpact(locationIndex) {
  const loc = LOCATIONS[locationIndex] || { lat: 37.3, lon: -121.9 };
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&hourly=temperature_2m&temperature_unit=fahrenheit&timezone=America/Los_Angeles`;

  return fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const temps = data.hourly?.temperature_2m || [];
      const times = data.hourly?.time || [];
      if (temps.length === 0 || times.length === 0)
        return { temp: null, cashChange: 0, moraleChange: 0, coffeeChange: 0 };

      const nowHourStr = new Date().toISOString().slice(0, 13);
      let closestIndex = times.findIndex((t) => t.startsWith(nowHourStr));
      if (closestIndex === -1) closestIndex = 0;

      const currentTemp = temps[closestIndex];

      return {
        temp: currentTemp,
        cashChange: 0,
        moraleChange: currentTemp > 90 ? -1 : 1,
        coffeeChange: 0,
      };
    })
    .catch((err) => {
      console.error("Weather API fetch error:", err);
      return { temp: null, cashChange: 0, moraleChange: 0, coffeeChange: 0 };
    });
}

// ----------------- GitHub Market Pressure -----------------
function fetchGitHubMarketPressure() {
  return fetch(
    "https://api.github.com/search/repositories?q=stars:>100&sort=stars&order=desc",
  )
    .then((res) => res.json())
    .then((data) => {
      const topRepos = data.items.slice(0, 2);
      const pressure =
        topRepos.reduce((sum, r) => sum + r.stargazers_count, 0) / 1000;
      return {
        pressure: Math.min(Math.floor(pressure), 5), // 0–5 effect
        repos: topRepos.map((r) => ({
          name: r.full_name,
          stars: r.stargazers_count,
        })),
      };
    })
    .catch(() => ({ pressure: 0, repos: [] }));
}

// ----------------- Hacker News Morale -----------------
function fetchHackerNewsMorale() {
  return fetch(
    "https://hn.algolia.com/api/v1/search?tags=story&numericFilters=points>100&hitsPerPage=2",
  )
    .then((res) => res.json())
    .then((data) => {
      const positiveKeywords = ["raise", "success", "funding", "launch"];
      let morale = 0;

      const stories = data.hits.map((story) => {
        const title = story.title;
        const isPositive = positiveKeywords.some((kw) =>
          title.toLowerCase().includes(kw),
        );
        morale += isPositive ? 1 : -0.5;
        return { title, impact: isPositive ? "+1" : "-0.5" };
      });

      return { morale: Math.round(morale), stories };
    })
    .catch(() => ({ morale: 0, stories: [] }));
}

module.exports = {
  fetchWeatherImpact,
  fetchGitHubMarketPressure,
  fetchHackerNewsMorale,
};
