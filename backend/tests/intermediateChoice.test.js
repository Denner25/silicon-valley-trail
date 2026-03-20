const { applyIntermediateChoice } = require("../controllers/gameController");

describe("applyIntermediateChoice", () => {
  let baseResult;

  beforeEach(() => {
    baseResult = {
      cash: 100,
      morale: 50,
      coffee: 5,
      notes: [],
    };
  });

  test("hackathon aggressive increases cash and reduces morale", () => {
    applyIntermediateChoice("hackathon", "aggressive", baseResult, {});

    expect(baseResult.cash).toBe(150);
    expect(baseResult.morale).toBe(40);
    expect(baseResult.notes.length).toBeGreaterThan(0);
  });

  test("travel push reduces cash and morale", () => {
    applyIntermediateChoice("travel", "push", baseResult, {});

    expect(baseResult.cash).toBe(80);
    expect(baseResult.morale).toBe(45);
  });

  test("rest long increases morale and reduces coffee", () => {
    applyIntermediateChoice("rest", "long", baseResult, {});

    expect(baseResult.morale).toBe(60);
    expect(baseResult.coffee).toBe(4);
  });
});
