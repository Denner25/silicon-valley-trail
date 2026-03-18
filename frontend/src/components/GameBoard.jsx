// frontend/src/GameBoard.jsx
import { useState } from "react";
import "./GameBoard.css";

function GameBoard() {
  const [game, setGame] = useState(null);
  const [action, setAction] = useState("travel");
  const [intermediateChoice, setIntermediateChoice] = useState(null);
  const [showChoice, setShowChoice] = useState(false);
  const [loading, setLoading] = useState(false);

  function startGame() {
    setLoading(true);
    fetch("http://localhost:3001/game/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerName: "Denner" }),
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

  if (!game || !game.resources || !game.history) {
    return (
      <section className="game-container">
        <button onClick={startGame} disabled={loading}>
          Start Game
        </button>
        {loading && <p>Loading...</p>}
      </section>
    );
  }

  return (
    <section className="game-container">
      {/* ================= Stats ================= */}
      <div className="stats">
        <h2>Day {game.history.length + 1}</h2>
        <p>Location: {game.currentLocation}</p>
        <p>Cash: {game.resources.cash}</p>
        <p>Morale: {game.resources.morale}</p>
        <p>Coffee: {game.resources.coffee}</p>

        {game.lastWeather && (
          <div className="weather">
            <h4>Weather Today:</h4>
            <p>{game.lastWeather.temp}°F</p>
          </div>
        )}

        {game.dailyRepos && (
          <div className="meta-repos">
            <h4>Top Repos:</h4>
            {game.dailyRepos.map((r, i) => (
              <div key={i}>
                {r.name} ⭐ {r.stars}
              </div>
            ))}
          </div>
        )}

        {game.dailyNews && (
          <div className="meta-news">
            <h4>Tech News:</h4>
            {game.dailyNews.map((n, i) => (
              <div key={i}>
                {n.title} ({n.impact})
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= Controls ================= */}
      <div className="controls">
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="travel">Travel</option>
          <option value="rest">Rest</option>
          <option value="hackathon">Hackathon</option>
        </select>
        <button onClick={handleTakeTurn} disabled={loading}>
          Take Turn
        </button>
      </div>

      {/* ================= Intermediate Choice ================= */}
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

      {/* ================= History ================= */}
      <div className="history">
        <h3>History</h3>
        <ul>
          {game.history.map((h) => (
            <li key={h.day} className="history-entry">
              <strong>Day {h.day}</strong>
              <div>Action: {h.action}</div>
              <div>Intermediate Choice: {h.intermediateChoice}</div>
              <div>Location: {h.location}</div>
              <div>Event: {h.event}</div>
              {h.description && <div className="event-description">{h.description}</div>}
              {h.modifiers &&
                h.modifiers.map((m, i) => (
                  <div key={i} className="modifier-note">
                    {m}
                  </div>
                ))}
              {h.weatherTemp && <div className="weather-impact">Weather: {h.weatherTemp}°F</div>}
              <div className="resource-changes">
                Resource Changes → Cash {h.resourceChanges.cash >= 0 ? "+" : ""}
                {h.resourceChanges.cash} | Morale {h.resourceChanges.morale >= 0 ? "+" : ""}
                {h.resourceChanges.morale} | Coffee {h.resourceChanges.coffee >= 0 ? "+" : ""}
                {h.resourceChanges.coffee}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {game.isOver && (
        <h2 className="game-result" style={{ color: game.hasWon ? "green" : "red" }}>
          {game.hasWon ? "You reached the destination!" : game.deathNote}
        </h2>
      )}
    </section>
  );
}

export default GameBoard;