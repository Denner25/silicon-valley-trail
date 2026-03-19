// backend/services/mockApi.js

const { LOCATIONS } = require("../utils/constants");

// ----------------- Weather Impact Mock -----------------
function mockWeatherImpact(locationIndex) {
  const loc = LOCATIONS[locationIndex] || { lat: 37.3, lon: -121.9 };
  // Simple variation by location index for dynamic effect
  const temp = 60 + locationIndex * 2;
  return Promise.resolve({
    temp,
    cashChange: 0,
    moraleChange: temp > 80 ? -1 : 1,
    coffeeChange: 0,
  });
}

// ----------------- GitHub Market Pressure Mock -----------------
function mockGitHubMarketPressure() {
  // Simulate top repos dynamically
  const repos = [
    { name: "facebook/react", stars: 200000 },
    { name: "vuejs/vue", stars: 190000 },
  ];
  const pressure = Math.floor((repos[0].stars + repos[1].stars) / 100000) % 5;
  return Promise.resolve({
    pressure,
    repos,
  });
}

// ----------------- Hacker News Morale Mock -----------------
function mockHackerNewsMorale() {
  const stories = [
    { title: "Startup launches successful new product", impact: "+1" },
    { title: "Funding round closes with positive traction", impact: "+1" },
  ];
  const morale = 2; // positive morale boost
  return Promise.resolve({ morale, stories });
}

module.exports = {
  mockWeatherImpact,
  mockGitHubMarketPressure,
  mockHackerNewsMorale,
};
