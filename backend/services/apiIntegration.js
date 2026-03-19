// backend/services/apiIntegration.js
const fetch = require("node-fetch");
const { LOCATIONS } = require("../utils/constants");
const {
  mockWeatherImpact,
  mockGitHubMarketPressure,
  mockHackerNewsMorale,
} = require("./mockApi");

const USE_MOCK = process.env.USE_MOCK_API === "true";

// ----------------- Weather -----------------
function fetchWeatherImpact(locationIndex) {
  if (USE_MOCK) return mockWeatherImpact(locationIndex);

  const loc = LOCATIONS[locationIndex] || { lat: 37.3, lon: -121.9 };
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&hourly=temperature_2m&temperature_unit=fahrenheit&timezone=America/Los_Angeles`;

  return fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const temps = data.hourly?.temperature_2m || [];
      const times = data.hourly?.time || [];
      if (temps.length === 0 || times.length === 0)
        return mockWeatherImpact(locationIndex);

      const nowHourStr = new Date().toISOString().slice(0, 13); // "YYYY-MM-DDTHH"
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
      console.error("Weather API failed, using mock:", err);
      return mockWeatherImpact(locationIndex);
    });
}

// ----------------- GitHub Market Pressure -----------------
function fetchGitHubMarketPressure() {
  if (USE_MOCK) return mockGitHubMarketPressure();

  const url =
    "https://api.github.com/search/repositories?q=stars:>100&sort=stars&order=desc";

  return fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const topRepos = data.items.slice(0, 2);
      const pressure =
        topRepos.reduce((sum, r) => sum + r.stargazers_count, 0) / 1000;
      return {
        pressure: Math.min(Math.floor(pressure), 5),
        repos: topRepos.map((r) => ({
          name: r.full_name,
          stars: r.stargazers_count,
        })),
      };
    })
    .catch((err) => {
      console.error("GitHub API failed, using mock:", err);
      return mockGitHubMarketPressure();
    });
}

// ----------------- Hacker News Morale -----------------
function fetchHackerNewsMorale() {
  if (USE_MOCK) return mockHackerNewsMorale();

  const url =
    "https://hn.algolia.com/api/v1/search?tags=story&numericFilters=points>100&hitsPerPage=2";

  return fetch(url)
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
    .catch((err) => {
      console.error("Hacker News API failed, using mock:", err);
      return mockHackerNewsMorale();
    });
}

module.exports = {
  fetchWeatherImpact,
  fetchGitHubMarketPressure,
  fetchHackerNewsMorale,
};
