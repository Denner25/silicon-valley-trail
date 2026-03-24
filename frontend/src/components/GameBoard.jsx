// frontend/src/GameBoard.jsx
import { useState } from "react";
import "./GameBoard.css";

function GameBoard() {
  const [game, setGame] = useState(null);
  const [action, setAction] = useState("travel");
  const [intermediateChoice, setIntermediateChoice] = useState(null);
  const [showChoice, setShowChoice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playerName, setPlayerName] = useState("Denner");

  function startGame() {
    if (!playerName.trim()) {
      alert("Please enter a valid name.");
      return;
    }

    setLoading(true);
    fetch("http://localhost:3001/game/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerName: playerName.trim() }),
    })
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("startGame fetch error:", err);
        setLoading(false);
      });
  }

  function handleTakeTurn() {
    setShowChoice(true);
  }

  function submitIntermediateChoice(choice) {
    setShowChoice(false);
    setIntermediateChoice(choice);
    setLoading(true);

    fetch("http://localhost:3001/game/turn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId: game._id,
        action,
        intermediateChoice: choice,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
        setIntermediateChoice(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("takeTurn fetch error:", err);
        setIntermediateChoice(null);
        setLoading(false);
      });
  }

  // ── START SCREEN ──────────────────────────────────────────────
  if (!game || !game.resources || !game.history) {
    return (
      <section className="game-container">
        <div className="game-start-container">
          <div className="game-start-card">
            <p className="game-start-eyebrow">A startup road trip adventure:</p>
            <h1 className="game-start-title">
              Silicon
              <br />
              Valley Trail
            </h1>
            <p className="game-start-subtitle">
              San Jose → San Francisco · 10 stops
            </p>

            <label className="game-start-label" htmlFor="playerName">
              Founder name
            </label>
            <input
              id="playerName"
              className="game-start-input"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="e.g. Denner"
              onKeyDown={(e) => e.key === "Enter" && !loading && startGame()}
            />

            <button
              className="game-start-btn"
              onClick={startGame}
              disabled={loading}
            >
              {loading ? "Initializing..." : "Begin Journey →"}
            </button>

            <div className="game-start-route">
              {[
                "SJC",
                "PAL",
                "MTV",
                "SVL",
                "CPT",
                "MNP",
                "RWC",
                "SMT",
                "FCS",
                "SFO",
              ].map((stop, i, arr) => (
                <span key={stop} className="game-start-stop">
                  {stop}
                  {i < arr.length - 1 ? " →" : ""}
                </span>
              ))}
            </div>
          </div>

          {loading && <p className="game-start-loading">Booting up...</p>}
        </div>
      </section>
    );
  }

  // ── MAIN GAME SCREEN ──────────────────────────────────────────

  const STOPS = [
    "SJC",
    "PAL",
    "MTV",
    "SVL",
    "CPT",
    "MNP",
    "RWC",
    "SMT",
    "FCS",
    "SFO",
  ];
  const currentStop = Math.min(game.locationIndex, STOPS.length - 1);

  function resourceClass(value, thresholdWarn, thresholdDanger) {
    if (value <= thresholdDanger) return "danger";
    if (value <= thresholdWarn) return "warn";
    return "";
  }

  const cashClass = resourceClass(game.resources.cash, 40, 20);
  const moraleClass = resourceClass(game.resources.morale, 10, 5);
  const coffeeClass = resourceClass(game.resources.coffee, 2, 1);

  return (
    <section className="game-container">
      {/* ── Route Progress ── */}
      <div className="route-progress">
        <div className="route-stops">
          {STOPS.map((stop, i) => (
            <div
              key={stop}
              className={`route-stop ${i < currentStop ? "done" : ""} ${i === currentStop ? "active" : ""}`}
            >
              <div className="route-dot" />
              <span className="route-label">{stop}</span>
            </div>
          ))}
        </div>
        <div className="route-track">
          <div
            className="route-fill"
            style={{ width: `${(currentStop / (STOPS.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stats">
        <h2>
          Day {game.history.length + 1} — {game.playerName}
        </h2>
        <p>Location: {game.currentLocation}</p>
        <p className={`stat-cash ${cashClass}`}>Cash: ${game.resources.cash}</p>
        <p className={`stat-morale ${moraleClass}`}>
          Morale: {game.resources.morale}
        </p>
        <p className={`stat-coffee ${coffeeClass}`}>
          Coffee: {game.resources.coffee}
        </p>

        {game.lastWeather && (
          <div className="weather">
            <h4>Weather Today</h4>
            <p>{game.lastWeather.temp}°F</p>
          </div>
        )}

        {game.dailyRepos && (
          <div className="meta-repos">
            <h4>Top Repos</h4>
            {game.dailyRepos.map((r, i) => (
              <div key={i}>
                {r.name} ⭐ {r.stars}
              </div>
            ))}
          </div>
        )}

        {game.dailyNews && (
          <div className="meta-news">
            <h4>Tech News</h4>
            {game.dailyNews.map((n, i) => (
              <div key={i}>
                {n.title} ({n.impact})
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Controls ── */}
      <div className="controls">
        {game.isOver ? (
          <button onClick={startGame} disabled={loading}>
            New Game
          </button>
        ) : (
          <>
            <select value={action} onChange={(e) => setAction(e.target.value)}>
              <option value="travel">Travel</option>
              <option value="rest">Rest</option>
              <option value="hackathon">Hackathon</option>
            </select>
            <button onClick={handleTakeTurn} disabled={loading}>
              {loading ? "Processing..." : "Take Turn →"}
            </button>
          </>
        )}
      </div>

      {/* ── Intermediate Choice ── */}
      {showChoice && (
        <div className="intermediate-choice">
          <h3>Choose Your Approach</h3>

          {action === "hackathon" && (
            <ul>
              <li>
                <button onClick={() => submitIntermediateChoice("aggressive")}>
                  Aggressive (+50% cash, -10 morale)
                </button>
              </li>
              <li>
                <button onClick={() => submitIntermediateChoice("safe")}>
                  Safe (+20% cash)
                </button>
              </li>
              <li>
                <button onClick={() => submitIntermediateChoice("delegate")}>
                  Delegate (+10 cash, +5 morale, -1 coffee)
                </button>
              </li>
            </ul>
          )}

          {action === "travel" && (
            <ul>
              <li>
                <button onClick={() => submitIntermediateChoice("push")}>
                  Push the Team (faster, more cash cost)
                </button>
              </li>
              <li>
                <button onClick={() => submitIntermediateChoice("slow")}>
                  Take it Slow (less cash cost, morale stable)
                </button>
              </li>
              <li>
                <button onClick={() => submitIntermediateChoice("coffee")}>
                  Stop for Coffee (+1 morale, -1 coffee)
                </button>
              </li>
            </ul>
          )}

          {action === "rest" && (
            <ul>
              <li>
                <button onClick={() => submitIntermediateChoice("short")}>
                  Short Rest (+5 morale)
                </button>
              </li>
              <li>
                <button onClick={() => submitIntermediateChoice("long")}>
                  Long Rest (+10 morale, -1 coffee)
                </button>
              </li>
            </ul>
          )}
        </div>
      )}

      {/* ── History ── */}
      <div className="history">
        <h3>History</h3>
        <ul>
          {game.history.map((h) => (
            <li key={h.day} className="history-entry">
              <strong>
                Day {h.day} — {game.playerName}
              </strong>
              <div>Action: {h.action}</div>
              <div>Choice: {h.intermediateChoice}</div>
              <div>Location: {h.location}</div>
              <div>Event: {h.event}</div>
              {h.description && (
                <div className="event-description">{h.description}</div>
              )}
              {h.modifiers &&
                h.modifiers.map((m, i) => (
                  <div key={i} className="modifier-note">
                    {m}
                  </div>
                ))}
              {h.weatherTemp && (
                <div className="weather-impact">Weather: {h.weatherTemp}°F</div>
              )}
              <div className="resource-changes">
                Cash {h.resourceChanges.cash >= 0 ? "+" : ""}
                {h.resourceChanges.cash} &nbsp;|&nbsp; Morale{" "}
                {h.resourceChanges.morale >= 0 ? "+" : ""}
                {h.resourceChanges.morale} &nbsp;|&nbsp; Coffee{" "}
                {h.resourceChanges.coffee >= 0 ? "+" : ""}
                {h.resourceChanges.coffee}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Game Over ── */}
      {game.isOver && (
        <h2
          className="game-result"
          style={{ color: game.hasWon ? "green" : "red" }}
        >
          {game.hasWon ? "You reached the destination!" : game.deathNote}
        </h2>
      )}
    </section>
  );
}

export default GameBoard;
