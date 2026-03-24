const Game = require("../models/game");
const { getRandomEvent } = require("../services/events");
const {
  fetchWeatherImpact,
  fetchGitHubMarketPressure,
  fetchHackerNewsMorale,
} = require("../services/apiIntegration");
const { applyModifiers } = require("../services/modifiers");
const { LOCATIONS } = require("../utils/constants");

const USE_MOCK_API = process.env.USE_MOCK_API === "true";

// ----------------- Intermediate Choice -----------------
function applyIntermediateChoice(action, choice, result) {
  if (!choice) return;

  // ----------------- HACKATHON -----------------
  if (action === "hackathon") {
    if (choice === "aggressive") {
      result.cash = Math.floor(result.cash * 1.5);
      result.morale -= 10;
      result.notes.push(
        "Aggressive approach boosted rewards but hurt morale (-10 morale)",
      );
    }

    if (choice === "safe") {
      result.cash = Math.floor(result.cash * 1.2);
      result.notes.push("Safe approach slightly increased rewards (+20% cash)");
    }

    if (choice === "delegate") {
      result.cash += 10;
      result.morale += 5;
      result.coffee -= 1;
      result.notes.push(
        "Delegation improved balance (+10 cash, +5 morale, -1 coffee)",
      );
    }
  }

  // ----------------- TRAVEL -----------------
  if (action === "travel") {
    if (choice === "push") {
      result.cash -= 20;
      result.morale -= 5;
      result.notes.push("Pushed the team too hard (-20 cash, -5 morale)");
    }

    if (choice === "slow") {
      result.cash -= 10;
      result.notes.push("Slow travel reduced expenses (-10 cash)");
    }

    if (choice === "coffee") {
      result.morale += 1;
      result.coffee -= 1;
      result.notes.push("Coffee stop boosted morale (+1 morale, -1 coffee)");
    }
  }

  // ----------------- REST -----------------
  if (action === "rest") {
    if (choice === "short") {
      result.morale += 5;
      result.notes.push("Short rest recovered morale (+5)");
    }

    if (choice === "long") {
      result.morale += 10;
      result.coffee -= 1;
      result.notes.push("Long rest restored morale (+10 morale, -1 coffee)");
    }
  }
}

// ----------------- Start Game -----------------
function startGame(req, res) {
  const playerName = req.body.playerName;

  const game = new Game({
    playerName,
    team: [
      {
        name: "Alex",
        strengths: ["organized"],
        weaknesses: ["lactose_intolerant"],
      },
      {
        name: "Sam",
        strengths: ["fast_developer"],
        weaknesses: ["anxiety"],
      },
      {
        name: "Jordan",
        strengths: ["creative coder"],
        weaknesses: ["procrastination"],
      },
    ],
  });

  const currentLocation = LOCATIONS[game.locationIndex]?.name || "Unknown";

  game
    .save()
    .then((savedGame) => {
      res.json({
        ...savedGame.toObject(),
        currentLocation,
        lastWeather: null,
        deathNote: game.deathNote,
      });
    })
    .catch((err) => {
      console.error("startGame error:", err);
      res.status(500).json({ error: err.message });
    });
}

// ----------------- Take Turn -----------------
function takeTurn(req, res) {
  const { gameId, action, intermediateChoice } = req.body;

  Game.findById(gameId)
    .then((game) => {
      if (!game || game.isOver) {
        throw new Error("Game not found or already over");
      }

      // Move to next location
      game.locationIndex += 1;

      const locObj = LOCATIONS[game.locationIndex] || {
        name: "Unknown",
        lat: 37.3,
        lon: -121.9,
      };

      const currentLocation = locObj.name;

      const weatherPromise = USE_MOCK_API
        ? Promise.resolve({
            temp: 70,
            cashChange: 0,
            moraleChange: 1,
            coffeeChange: 0,
          })
        : fetchWeatherImpact(game.locationIndex);

      const marketPromise = USE_MOCK_API
        ? Promise.resolve({
            pressure: 2,
            repos: [
              { name: "mock/repo1", stars: 100 },
              { name: "mock/repo2", stars: 90 },
            ],
          })
        : fetchGitHubMarketPressure();

      const newsPromise = USE_MOCK_API
        ? Promise.resolve({
            morale: 1,
            stories: [{ title: "Mock success", impact: "+1" }],
          })
        : fetchHackerNewsMorale();

      return Promise.all([weatherPromise, marketPromise, newsPromise]).then(
        ([weatherImpact, marketData, newsData]) => {
          const marketPressure = marketData.pressure;
          const newsMorale = newsData.morale;

          game.dailyRepos = marketData.repos;
          game.dailyNews = newsData.stories;

          const event = getRandomEvent(action);

          let result = {
            cash: event.cashChange + (weatherImpact.cashChange || 0),
            morale: event.moraleChange + (weatherImpact.moraleChange || 0),
            coffee: event.coffeeChange + (weatherImpact.coffeeChange || 0),
            notes: [],
          };

          applyIntermediateChoice(action, intermediateChoice, result, game);

          applyModifiers(game.team, event.name, result);

          if (action === "hackathon" || event.name === "VC Pitch Success") {
            const reduction = 0.1 * marketPressure;

            result.cash = Math.floor(result.cash * (1 - reduction));

            result.notes.push(
              `Market pressure reduced rewards by ${Math.floor(
                reduction * 100,
              )}%`,
            );
          }

          result.morale += newsMorale;

          if (newsMorale !== 0) {
            result.notes.push(`Tech news affected morale by ${newsMorale}`);
          }

          // Save history with raw API items
          game.history.push({
            day: game.history.length + 1,
            action,
            intermediateChoice,
            location: currentLocation,
            event: event.name,
            description: event.description,
            weatherTemp: weatherImpact.temp,
            resourceChanges: {
              cash: result.cash,
              morale: result.morale,
              coffee: result.coffee,
            },
            modifiers: result.notes,
          });

          // Apply results
          game.resources.cash += result.cash;
          game.resources.morale += result.morale;
          game.resources.coffee += result.coffee;

          // Win / lose conditions
          if (
            game.resources.cash <= 0 ||
            game.resources.morale <= 0 ||
            game.resources.coffee <= 0
          ) {
            game.isOver = true;
            game.hasWon = false;

            if (game.resources.coffee <= 0) {
              game.deathNote =
                "No coffee left! Productivity plummeted, project failed.";
            } else if (game.resources.morale <= 0) {
              game.deathNote =
                "Team morale collapsed! Everyone quit in frustration.";
            } else if (game.resources.cash <= 0) {
              game.deathNote = "Bankruptcy! The project ran out of funds.";
            }
          }

          if (game.locationIndex >= LOCATIONS.length - 1) {
            game.isOver = true;
            game.hasWon = true;
          }

          return game.save().then((savedGame) =>
            res.json({
              ...savedGame.toObject(),
              currentLocation,
              lastWeather: weatherImpact,
              dailyRepos: game.dailyRepos,
              dailyNews: game.dailyNews,
            }),
          );
        },
      );
    })
    .catch((err) => {
      console.error("takeTurn error:", err);
      res.status(500).json({ error: err.message });
    });
}

module.exports = { startGame, takeTurn, applyIntermediateChoice };
