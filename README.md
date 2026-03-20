# Silicon Valley Trail

A small, replayable startup-themed game inspired by _Oregon Trail_. Guide your startup team from San Jose to San Francisco, managing resources, tackling events, and making strategic choices. Game outcomes are influenced by live or mocked public APIs.

---

## 🎮 Features

- **Game Loop:** Each turn represents a "day" where you can choose an action: Travel, Rest, or Hackathon.
- **Resources:** Track and manage Cash, Coffee, and Team Morale.
- **Events & Choices:** Random events occur at each location. Make consequential choices that impact resources.
- **Public API Integration:**
  - Weather (Open-Meteo) affects morale and coffee consumption.
  - GitHub repository trends influence market pressure.
  - Hacker News stories affect team morale.
- **Offline Playability:** Set `USE_MOCK_API=true` to play without internet or API keys.
- **Win/Lose Conditions:** Reach the final destination to win. Lose if cash, morale, or coffee hits zero.

---

## 🏁 Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/silicon-valley-trail.git
cd silicon-valley-trail
```

### 2. Install Dependencies

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd ../frontend
npm install
```

### 3. Set Environment Variables

Create a `.env` file based on `.env.example`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/silicon-valley-trail
USE_MOCK_API=true
PORT=3001
```

- `USE_MOCK_API=true` → offline mode.
- `MONGO_URI` → uses a local MongoDB instance by default (no credentials required), you can replace MONGO_URI with any valid MongoDB connection string if desired.

### 4. Start Backend

```bash
cd ../backend
npm start
```

### 5. Start Frontend

```bash
cd ../frontend
npm start
```

The app will open in your browser at `http://localhost:3000`.

---

## 🗺 Architecture Overview

**Backend (Node.js + Express):**

| File                            | Description                            |
| ------------------------------- | -------------------------------------- |
| `app.js`                        | Main Express app                       |
| `server.js`                     | Connects MongoDB and starts the server |
| `controllers/gameController.js` | Handles game start and turns           |
| `models/Game.js`                | Mongoose schema for game state         |
| `services/apiIntegration.js`    | Fetches live or mocked API data        |
| `services/events.js`            | Defines random events                  |
| `services/modifiers.js`         | Applies team member traits             |
| `routes/gameRoutes.js`          | Defines API endpoints                  |
| `tests/game.test.js`            | Unit tests for core game mechanics     |

**Frontend (React):**

| File            | Description                   |
| --------------- | ----------------------------- |
| `GameBoard.jsx` | Main game UI and interactions |
| `GameBoard.css` | Styles                        |

Fetches backend API for game start and turns. Supports intermediate choice dialogs and history display.

---

## ⚙ Running Tests

Backend unit tests:

```bash
cd backend
npm test
```

Tests cover:

- Random event generation
- Resource updates
- Core modifiers logic

---

## 🎯 Example Commands / Inputs

**Start game:**

Click **Start Game** → sends `POST /game/start` → creates a new game session.

**Take turn:**

1. Select an action: Travel, Rest, or Hackathon
2. Click **Take Turn** → sends `POST /game/turn`
3. If the action requires an intermediate choice, select your strategy

**Offline mode:**

Set `USE_MOCK_API=true` in `.env` → game runs entirely on mocked data.

---

## 📖 Design Notes

### Game Loop & Balance

- Each turn advances a location and triggers events.
- Events randomly impact resources.
- Intermediate choices add meaningful trade-offs (e.g., cash vs morale).

### API Choice & Impact

- **Weather:** Modifies morale and coffee.
- **GitHub:** Market pressure reduces rewards for hackathons/VC pitches.
- **Hacker News:** Positive/negative headlines modify morale.

### Data Modeling

Game document tracks:

- Player name
- Team members (strengths/weaknesses)
- Resources (cash, morale, coffee)
- Location index
- History of actions and events
- Win/Lose status

### Error Handling

- Network failures fallback to mocks.
- No API keys or secrets are stored in source code.
- All critical logic handled on server-side.

### Trade-offs & Future Work

- Current UI is minimal (React) to focus on backend logic.
- Implement centralized error handling.
- Integrate a fun "trending spotify playlist" API or similar for influencing the morale stats.
- Could expand resources, events, team members and traits, and map visualization.
- More sophisticated event weighting or AI-driven events possible with more time.

---

## 🤖 AI Usage

- AI was used as an assistant to help structure code, write services, and design the game loop.
- All logic decisions, event design, and resource mechanics were carefully reviewed and customized by the developer.
- AI helped accelerate development and ensure clarity, but final gameplay design, balance, and feature implementation were developer-driven.

---
