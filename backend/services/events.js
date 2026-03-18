const EVENTS = [
  // Coffee Run
  {
    name: "Coffee Run",
    description: "The team stopped for a caffeine boost before continuing.",
    cashChange: -20,      // was -20 ✅ keep
    moraleChange: 5,      // was 10 → nerf
    coffeeChange: 2,      // was 3 → nerf
  },

  // VC Pitch Success
  {
    name: "VC Pitch Success",
    description: "Investors loved the demo and offered funding.",
    cashChange: 150,      // was 200 → nerf
    moraleChange: 10,     // was 15 → nerf
    coffeeChange: 0,
  },

  // Bug Fix Marathon
  {
    name: "Bug Fix Marathon",
    description: "The team spent hours fixing critical bugs.",
    cashChange: 0,
    moraleChange: -10,    // was -5 → make harsher
    coffeeChange: -1,
  },

  // Unexpected Server Crash
  {
    name: "Unexpected Server Crash",
    description: "Production servers went down unexpectedly.",
    cashChange: -80,      // was -50 → harsher
    moraleChange: -15,    // was -10 → harsher
    coffeeChange: 0,
  },
  {
    name: "Team Lunch",
    description: "The team took a break and shared a meal.",
    cashChange: -30,
    moraleChange: 5,
    coffeeChange: 0,
  },
  {
    name: "Hackathon",
    description: "The team entered a hackathon and faced tight deadlines.",
    cashChange: 0,
    moraleChange: -5,
    coffeeChange: 0,
  },
];

function getRandomEvent() {
  const index = Math.floor(Math.random() * EVENTS.length);
  return EVENTS[index];
}

module.exports = { getRandomEvent };
