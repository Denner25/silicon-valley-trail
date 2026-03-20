const { applyModifiers } = require("../services/modifiers");

describe("applyModifiers", () => {
  test("fast_developer boosts Bug Fix Marathon", () => {
    const team = [
      {
        name: "Sam",
        strengths: ["fast_developer"],
        weaknesses: [],
      },
    ];

    const result = {
      cash: 0,
      morale: 0,
      coffee: 0,
      notes: [],
    };

    applyModifiers(team, "Bug Fix Marathon", result);

    expect(result.cash).toBe(50);
    expect(result.notes.length).toBeGreaterThan(0);
  });

  test("organized reduces server crash impact", () => {
    const team = [
      {
        name: "Alex",
        strengths: ["organized"],
        weaknesses: [],
      },
    ];

    const result = {
      cash: 0,
      morale: 0,
      coffee: 0,
      notes: [],
    };

    applyModifiers(team, "Unexpected Server Crash", result);

    expect(result.cash).toBe(20);
    expect(result.morale).toBe(5);
  });
});
