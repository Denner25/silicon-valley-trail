const { mockWeatherImpact } = require("../services/mockApi");

describe("API Mock Fallbacks", () => {
  test("mock weather returns valid structure", async () => {
    const result = await mockWeatherImpact(1);

    expect(result).toHaveProperty("temp");
    expect(result).toHaveProperty("moraleChange");
  });
});
