// backend/models/Game.js

const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
  name: String,
  strengths: [String],
  weaknesses: [String],
});

const gameSchema = new mongoose.Schema(
  {
    playerName: { type: String, required: true },
    locationIndex: { type: Number, default: 0 },
    team: [teamMemberSchema],
    resources: {
      cash: { type: Number, default: 100 },
      coffee: { type: Number, default: 3 },
      morale: { type: Number, default: 25 },
    },
    history: [
      {
        day: Number,
        action: String,
        intermediateChoice: String,
        location: String,
        event: String,
        description: String,
        weatherTemp: Number,
        resourceChanges: {
          cash: Number,
          morale: Number,
          coffee: Number,
        },
        modifiers: [String],
      },
    ],
    isOver: { type: Boolean, default: false },
    hasWon: { type: Boolean, default: false },

    deathNote: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Game", gameSchema);
