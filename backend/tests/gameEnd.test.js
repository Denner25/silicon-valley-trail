describe("Game End Conditions", () => {
  function checkGameEnd(game) {
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
        game.deathNote = "Team morale collapsed! Everyone quit in frustration.";
      } else if (game.resources.cash <= 0) {
        game.deathNote = "Bankruptcy! The project ran out of funds.";
      }
    }
  }

  test("loses when cash reaches zero", () => {
    const game = {
      resources: { cash: 0, morale: 10, coffee: 2 },
    };

    checkGameEnd(game);

    expect(game.isOver).toBe(true);
    expect(game.hasWon).toBe(false);
    expect(game.deathNote).toMatch("Bankruptcy");
  });

  test("loses when morale reaches zero", () => {
    const game = {
      resources: { cash: 10, morale: 0, coffee: 2 },
    };

    checkGameEnd(game);

    expect(game.deathNote).toMatch("morale");
  });

  test("loses when coffee reaches zero", () => {
    const game = {
      resources: { cash: 10, morale: 10, coffee: 0 },
    };

    checkGameEnd(game);

    expect(game.deathNote).toMatch("coffee");
  });
});
