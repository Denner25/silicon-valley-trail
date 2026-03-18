// backend/tests/game.test.js

const { getRandomEvent } = require("../services/events");

test("random event returns valid structure", function () {
  const event = getRandomEvent();

  expect(event).toHaveProperty("name");
  expect(event).toHaveProperty("cashChange");
  expect(event).toHaveProperty("moraleChange");
  expect(event).toHaveProperty("coffeeChange");
});
